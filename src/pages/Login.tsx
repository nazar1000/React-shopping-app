import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

type LoginProps = {
  setLogin: Function,
  loginStatus: boolean

}

function Login(props: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errorMessage, setErrorMessage] = useState("")
  const [hasForgot, setHasForgot] = useState(false)
  const navigate = useNavigate()

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = document.getElementById("login-form") as HTMLFormElement;
    // check inputs

    //send request
    Axios.post('http://127.0.0.1:3001/api/login', {
      email: formData.email,
      password: formData.password,
    }).then((res: any) => {
      console.log(res);
      if (res.data.auth) {
        // login successful
        props.setLogin(true, res.data)
        localStorage.setItem("token", res.data.token)
        navigate("/products");
      } else {
        // if login failed
        setErrorMessage(res.data.message)
        props.setLogin(false)
      }
      form.reset();
    })
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setFormData(formData => ({ ...formData, [name]: value }))
  }

  return (
    <div className="Login">
      <div className='form-container'>

        {!hasForgot &&
          <form id='login-form' onSubmit={handleForm}>
            <h2>Login</h2>
            <p>{errorMessage}</p>
            <label>Email:</label>
            <input type="email" name='email' onChange={handleChange} autoFocus required></input>
            <label>Password:</label>
            <input type="password" name='password' onChange={handleChange} required></input>
            <h6 onClick={() => setHasForgot(!hasForgot)}>Forgot password?</h6>
            <button className='button-style' type='submit'>Submit</button>
            <h6 onClick={() => navigate("/register")}>Not registered?</h6>
          </form>
        }

        {hasForgot &&
          <form>
            <h2>Retrieve password</h2>
            <label>Email address:</label>
            <input type="email" autoFocus required></input>
            <button className='button-style' type='submit'>Submit</button>
            <h6 onClick={() => setHasForgot(!hasForgot)}>Go back to login</h6>
          </form>
        }

      </div>
    </div>
  )
}





export default Login