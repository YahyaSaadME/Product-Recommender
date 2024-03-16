from flask import Flask,request,jsonify
import pymongo
import json
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import google.generativeai as genai
import joblib
loaded_model  = joblib.load('E:/HACK PROJECTS/CAD/server/trained_model.pkl')

genai.configure(api_key="AIzaSyDnpHdjRW7viHXdRFcQNWqsDBZhUurdlNc")

# Set up the model
generation_config = {
  "temperature": 0.9,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}
safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]
model = genai.GenerativeModel(model_name="gemini-1.0-pro-001",
                              generation_config=generation_config,
                              safety_settings=safety_settings)
convo = model.start_chat(history=[
])

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["planner"]
users = db["users"]


app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'alklsjhIUTFBWCKRYWIUWIULCNC#@%'
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@app.route('/signup',methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not email or not username or not password or not confirm_password:
        return jsonify({'message': 'All fields are required.'}), 400

    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match.'}), 400

    existing_user = users.find_one({'$or': [{'email': email}, {'username': username}]})
    if existing_user:
        return jsonify({'message': 'Email or username already exists.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = {'email': email, 'username': username, 'password': hashed_password}
    user = users.insert_one(new_user)
    token_data = {
    'user_id': str(user['_id']),
        'email': user['email'],
        'username': user['username']
    }
    access_token = create_access_token(identity=token_data)
    return jsonify({'message': 'User created successfully.',"token":access_token}), 201

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    user = users.find_one({'email': email})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Include additional user details in the token
    token_data = {
        'user_id': str(user['_id']),
        'email': user['email'],
        'username': user['username']
    }
    access_token = create_access_token(identity=token_data)
    return jsonify({'token': access_token}), 200        

@app.route('/check_token', methods=['GET'])
@jwt_required()
def check_token():
    current_user = get_jwt_identity()
    user = users.find_one({'_id': current_user['user_id']})

    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'message': 'Token is valid',
        'user_id': str(current_user['user_id']),
        'email': current_user['email'],
        'username': current_user['username']
    }), 200

@app.route('/predict',methods=['POST'])
def predict():
        data = request.json
        print(data)
        output = loaded_model.predict(list(data['data']))[0]
        return jsonify({"res":str(output)})

@app.route('/ai',methods=['POST'])
def ai():
        data = request.json
        if int(data['Ms'])+int(data['Ts'])<int(data['price']):
            convo.send_message(f"Give me some budget {data['prompt']} under rupess {data['Ts']+data['Ms']} just give their list of names with price one by one")
        else:
            convo.send_message(f"Give me some budget {data['prompt']} under rupess {data['price']} just give their list of names with price one by one")
        return jsonify({"res":convo.last.text.replace("*","</br>")})

if __name__ == '__main__':
    app.run(debug=True)
