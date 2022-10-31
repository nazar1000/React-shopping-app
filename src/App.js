import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';
import { Routes, Route } from "react-router-dom"


import './styles/App.css';
import NavBar from './components/navBar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Basket from './pages/Basket';
import useAxiosData from './hooks/useAxiosData';
import Preview from "./pages/Preview"

function App() {
  const [cookie, setCookie, removeCookie] = useCookies("");
  const [page, setPages] = useState("login");
  const [formType, setFormTypes] = useState("login");

  const [registerForm, setRegisterForm] = useState();
  const [loginForm, setLoginForm] = useState();
  const [loginStatus, setLoginStatus] = useState(cookie.user_name != undefined ? true : false)
  //products
  const [productList, setProductList] = useState("");

  const { loading, productData } = useAxiosData() //products, categories


  const [basketList, setBasketList] = useState([]);
  const [basketItems, setBasketItems] = useState(0);

  const [previewInfo, setPreviewInfo] = useState("");

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    //Sets cookies (does not work in non https environment)
    Axios.get('http://127.0.0.1:3001/api/login').then((response) => {
      if (response.data.loggedIn == true) setLoginStatus(true);
      // console.log("Refresh: Data back");
      // console.log(response.data);
      // console.log(cookie)
    });

  }, [])

  // useEffect(() => {
  //   //returns product list
  //   Axios.get('http://127.0.0.1:3001/api/products').then((response) => {
  //     if (response.data.length > 0) {
  //       setProductList(response.data)
  //       // console.log(response.data);
  //     }
  //   });

  // }, [])

  // useEffect(() => {
  //   //returns product list
  //   Axios.get('http://127.0.0.1:3001/api/categories').then((response) => {
  //     if (response.data.length > 0) {
  //       setProductCategories(response.data);
  //       // console.log(response.data);
  //     }
  //   });

  // }, [])

  useEffect(() => {
    // console.log(productData)
  }, [loading])


  //handles form change
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    // headers:{"x-access-token": localStorage.getItem("token")}

    if (formType == "login") setLoginForm(values => ({ ...values, [name]: value }))
    else if (formType == "register") setRegisterForm(values => ({ ...values, [name]: value }))
    // console.log(loginForm);

  }

  //Sends data to backEnd
  const handleRegister = (event) => {
    event.preventDefault();
    // if (error.downloadError) return;
    if (registerForm.password != registerForm.rep_password) return;

    Axios.post('http://127.0.0.1:3001/api/register', {
      first_name: registerForm.first_name,
      last_name: registerForm.last_name,
      email: registerForm.email,
      password: registerForm.password
    }).then((res) => {
      if (res.data == "userExist") {
        console.log("User already exists")
      } else {
        console.log("Registration complete")
      }

    }, console.log("error"));
    event.target.reset();
    console.log(event);
  }

  //Sends data to backEnd
  const handleLogin = (event) => {
    event.preventDefault();
    // if (error.downloadError) return;

    Axios.post('http://127.0.0.1:3001/api/login', {
      email: loginForm.email,
      password: loginForm.password,
    }).then((res) => {
      if (!res.data.auth) {
        setLoginStatus(false);
        signOut();
      }
      else {

        localStorage.setItem("token", res.data.token)
        setLoginStatus(true);
        setPage("home");

        //Setting cookie for login
        setCookie("user_name", res.data.result.first_name, { maxAge: 60 * 24 * 3 });
        setCookie("user_email", res.data.result.email, { maxAge: 60 * 24 * 3 });
        // console.log(cookie)
        // console.log("Login: Response");
        // console.log(res.data);
      }

    });
    event.target.reset();
  }
  //testing function
  const userAuthenticated = () => {
    Axios.get('http://127.0.0.1:3001/api/isUserAuth', {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      }
    }).then((response) => {
      if (!response.data.auth) console.log(response.data.message + ", Please login again!");
      else console.log("Authenticated!");
      // response.data

    });
  };

  const signOut = () => {
    removeCookie("user_name");
    removeCookie("user_email");
    localStorage.removeItem("token");
    setLoginStatus(false);
  }


  const addToBasket = (newItem = [], newQuantity = 1) => {

    // console.log(newItem)
    const item = basketList.filter((item) => item.id === newItem.product_id);

    console.log(item)
    console.log(basketList)

    //Update basket if in basket
    if (item.length > 0) {
      const newQuantityNotZero = (item[0].quantity + newQuantity > 0)
      if (newQuantityNotZero) {

        setBasketList(basketList => (
          basketList.map(el => (el.id === newItem.product_id ? { ...el, quantity: el.quantity + newQuantity } : el))
        ))
      } else {
        //Delete item
        setBasketList((basketList) => basketList.filter(item => item.id !== newItem.id))
      }

    } else {
      // if it is not add
      setBasketList(() => ([
        ...basketList,
        {
          "id": newItem.product_id,
          "name": newItem.product_name,
          "description": newItem.desc,
          "quantity": newQuantity,
          "price": newItem.price,
        }
      ]))
    }
  }





  const search = (filterValue) => {
    console.log(filterValue)
    let filter = filterValue.toUpperCase();
    let products = document.getElementsByClassName("product");
    for (let i = 0; i < products.length; i++) {

      let productName = products[i].getElementsByClassName("prd_desc_container")[0].firstChild.innerHTML.toUpperCase();

      if (productName.indexOf(filter) > -1) {
        // console.log("yes")
        products[i].style.display = "block";
      } else {
        products[i].style.display = "none";
      }
    }

  }

  const setPreview = (id) => {

    const temp = [...productList];
    const index = temp.findIndex(index => index.product_id == id)

    setPreviewInfo(productList[index]);
    setFormTypes("preview")

  }


  const setPage = (name) => {
    setPages(name);
  }

  const setFormType = (name) => {
    setFormTypes(name);
  }

  return (
    <div className="App">
      {/* <header>
        <NavBar setPage={setPage} setFormType={setFormType} basketTotal={basketTotal}
          search={search} cookie={cookie} signOut={signOut} />
      </header> */}

      <div className='app-container'>

        <Routes>
          <Route path='/' element={
            <NavBar setPage={setPage} setFormType={setFormType} basketTotal={basketList.length}
              search={search} cookie={cookie} signOut={signOut} />
          } >

            <Route path='home' element={
              <Home productCategories={productData?.categories} />
            } />


            <Route path="products" element={
              <Products formType={formType} setFormType={setFormType} productList={productData.products} categories={productData.categories}
                setPreview={setPreview} previewInfo={previewInfo} addToBasket={addToBasket} />}
            />

            <Route path="products/:category" element={
              <Products formType={formType} setFormType={setFormType} productList={productData.products} categories={productData.categories}
                setPreview={setPreview} previewInfo={previewInfo} addToBasket={addToBasket} />}
            />

            <Route path="products/:category/:product_id" element={
              <Preview addToBasket={addToBasket} />
            }
            />


            <Route path="login" element={
              <Login formType={formType} handleLogin={handleLogin} handleChange={handleChange} setFormType={setFormType} handleRegister={handleRegister} loginStatus={loginStatus} />}
            />

            <Route path="basket" element={
              <Basket basketItems={basketItems} basketList={basketList} addToBasket={addToBasket} />}
            />

          </Route>
        </Routes>



        {/* {page == "home" &&
          <Home productCategories={productCategories} />
        }

        {page == "products" &&
          <Products formType={formType} setFormType={setFormType} productList={productList} setPreview={setPreview} previewInfo={previewInfo} addToBasket={addToBasket} />
        }

        {page == "login" &&
          <Login formType={formType} handleLogin={handleLogin} handleChange={handleChange} setFormType={setFormType} handleRegister={handleRegister} loginStatus={loginStatus} />
        }

        {page == "basket" &&
          <Basket basketItems={basketItems} basketList={basketList} addToBasket={addToBasket} />
        } */}
      </div>
    </div>
  );
}

export default App;
