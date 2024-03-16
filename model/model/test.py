import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import warnings

warnings.filterwarnings("ignore", category=UserWarning)
loaded_model = joblib.load('E:/HACK PROJECTS/CAD/model/model/trained_model.pkl')

def predict_payment_method(total_savings, monthly_savings, price, essential):

    input_data = [[total_savings, monthly_savings, price, essential]]
    
    predicted_label = loaded_model.predict(input_data)
    return predicted_label[0]

total_savings = float(input("Enter total savings: "))
monthly_savings = float(input("Enter monthly savings: "))
price = float(input("Enter price of the item: "))
essential = int(input("Enter if the item is essential (1 for Yes, 0 for No): "))

predicted_label = predict_payment_method(total_savings, monthly_savings, price, essential)
print("Predicted payment method label:", predicted_label)