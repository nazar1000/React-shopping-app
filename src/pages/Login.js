import '../styles/Login.css';

function Login(props) {
    return (
        <div className="Login">

            <div className='form-container'>

                {props.formType == "login" &&
                    <form onSubmit={props.handleLogin}>
                        <h2>Login</h2>
                        <label>Email:</label>
                        <input type="email" name='email' onChange={props.handleChange} autoFocus required></input>
                        <label>Password:</label>
                        <input type="password" name='password' onChange={props.handleChange} required></input>
                        <h6 onClick={() => props.setFormType("forgot")}>Forgot password?</h6>
                        <button className='button-style' type='submit'>Submit</button>
                        <h6 onClick={() => props.setFormType("register")}>Not registered?</h6>
                    </form>
                }
                {props.formType == "forgot" &&
                    <form>
                        <h2>Retrieve password</h2>
                        <label>Email address:</label>
                        <input type="email" autoFocus required></input>
                        <button className='button-style' type='submit'>Submit</button>
                        <h6 onClick={() => props.setFormType("login")}>Go back to login</h6>
                    </form>
                }

                {props.formType == "register" &&
                    <form onSubmit={props.handleRegister} >
                        <h2>Register</h2>
                        <label>First name:</label>
                        <input type="text" name="first_name" onChange={props.handleChange} autoFocus required></input>
                        <label>Last name:</label>
                        <input type="text" name="last_name" onChange={props.handleChange} required></input>
                        <label>Email:</label>
                        <input type="email" name="email" onChange={props.handleChange} required></input>
                        <label>Password:</label>
                        <input type="password" name="password" onChange={props.handleChange} required></input>
                        <label>Re-enter password:</label>
                        <input type="password" name="rep_password" onChange={props.handleChange} required></input>
                        <button className='button-style' type='submit'>Submit</button>
                        <h6 onClick={() => props.setFormType("login")}>Go back to login</h6>
                    </form>
                }

                {props.loginStatus && (
                    <button onClick={props.userAuthenticated}>Check if Auth</button>
                )}
            </div>
        </div>
    )
}





export default Login;