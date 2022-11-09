import Axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

type LoginProps = {
  loginStatus: boolean

}

type FormDataType = {
  first_name: string, last_name: string, email: string, password: string, rep_password: string
}
function Register(props: LoginProps) {
  const [formData, setFormData] = useState<FormDataType>({ first_name: "", last_name: "", email: "", password: "", rep_password: "" })
  const [errorMessage, setErrorMessage] = useState<any>({})
  const [submitMessage, setSubmitMessage] = useState("");

  const navigate = useNavigate()

  const handleRegister = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    let form = document.getElementById("registration-form") as HTMLInputElement;
    form.checkValidity()
    form.reportValidity()

    let errors = 0;
    errors += checkValidity("first_name", formData.first_name)
    errors += checkValidity("last_name", formData.last_name)
    errors += checkValidity("email", formData.email)
    errors += checkValidity("password", formData.password)
    errors += checkValidity("rep_password", formData.rep_password)

    if (errors > 0) {
      setSubmitMessage("Validity failed, please check the form");
      return;
    }

    Axios.post('http://127.0.0.1:3001/api/register', {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      password: formData.password
    }).then((res) => {
      if (res.data === "userExist") {
        console.log("User already exists")
        setSubmitMessage("User with the specified email already exists")

      } else {
        console.log("Registration complete")
        setSubmitMessage("Registration complete, please login.")
      }

    }).catch(error => console.log(error));
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    checkValidity(name, value)

    setFormData((formData: any) => ({ ...formData, [name]: value }))
  }

  const checkValidity = (name: string, value: string) => {
    let error = ""
    //Testing inputs
    if (name === "first_name" || name === "last_name") {
      error = checkString(value)
      value.trim();
    }
    else if (name === "email") error = checkEmail(value)
    else if (name === "password") error = checkPassword(value)
    else if (name === "rep_password") {
      if (formData.password !== value) error = "Passwords does not match"
      else error = "";
    }
    setErrorMessage({ ...errorMessage, [name]: error ? error : "" })
    if (error === "") return 0
    else return 1;
  }

  const checkString = (value: string) => {
    let error = "";
    let lettersOnly = /^[A-Za-z]+$/

    if (value === "") error = "Field cannot be empty*"
    else if (!value.match(lettersOnly)) error = "Only A-Z characters are allowed*"
    else error = "";
    return error;
  }

  const checkEmail = (value: string) => {
    let error = "";
    let email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (value === "") error = "Field cannot be empty*"
    else if (!value.match(email)) error = "Invalid format*"
    else error = "";
    return error;
  }

  const checkPassword = (value: string) => {
    let error = "";

    if (value === "") error = "Password cannot be empty*"
    else if (!value.match(/[a-z]/)) error = "Must contain lowercase character*"
    else if (!value.match(/[A-Z]/)) error = "Must contain uppercase character*"
    else if (!value.match(/[0-9]/)) error = "Must contain number*"
    else if (value.length < 5) error = "Must be at least 5 characters long*"
    else error = "";
    return error;
  }

  return (
    <div className="Login">
      <div className='form-container'>

        <form id='registration-form'>
          <h2>Register</h2>
          <p>{submitMessage}</p>
          <label>First name:</label>
          <p>{errorMessage?.first_name}</p>
          <input type="text" name="first_name" onChange={handleChange} autoFocus required></input>
          <label>Last name:</label>
          <p>{errorMessage?.last_name}</p>
          <input type="text" name="last_name" onChange={handleChange} required></input>
          <label>Email:</label>
          <p>{errorMessage?.email}</p>
          <input type="email" name="email" onChange={handleChange} required></input>
          <label>Password:</label>
          <p>{errorMessage?.password}</p>
          <input type="password" name="password" onChange={handleChange} required></input>
          <label>Re-enter password:</label>
          <p>{errorMessage?.rep_password}</p>
          <input type="password" name="rep_password" onChange={handleChange} required></input>
          <button className='button-style' type='submit' onClick={handleRegister}>Submit</button>
          <h6 onClick={() => navigate("/login")}>Go back to login</h6>
        </form>

      </div>
    </div>
  )
}



export default Register;