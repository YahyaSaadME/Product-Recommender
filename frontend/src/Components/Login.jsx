import React from 'react'

export default function Login() {
    return (

        <div className='login'>
            <div className="login-wrapper">
                <form action="">
                    <h1>Login</h1>
                    <div className="login-input-box">
                        <input type="text" placeholder="Email" required />
                        <i className='bx bxs-user'></i>
                    </div>
                    <div className="login-input-box">
                        <input type="password" placeholder="Password" required />
                        <i className='bx bxs-lock-alt' ></i>
                    </div>
                    <div className="login-remember-forgot">
                        <label><input type="checkbox" />Remember Me</label>
                        <a href="#">Forgot Password</a>
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                    <div className="login-register-link">
                        <p>Dont have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}
