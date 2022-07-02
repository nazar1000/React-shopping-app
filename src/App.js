import { useState } from 'react';
import { useEffect } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';

import './styles/App.css';
import NavBar from './components/navBar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Basket from './pages/Basket';

function App() {
  const [cookie, setCookie, removeCookie] = useCookies("");
  const [page, setPages] = useState("login");
  const [formType, setFormTypes] = useState("login");

  const [registerForm, setRegisterForm] = useState();
  const [loginForm, setLoginForm] = useState();
  const [loginStatus, setLoginStatus] = useState(cookie.user_name != undefined ? true : false)
  //products
  const [productList, setProductList] = useState("");
  const [productCategories, setProductCategories] = useState("");

  const [basketList, setBasketList] = useState([]);
  const [basketTotal, setBasketTotal] = useState(0);
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

  useEffect(() => {
    //returns product list
    Axios.get('http://127.0.0.1:3001/api/products').then((response) => {
      if (response.data.length > 0) {
        setProductList(response.data)
        // console.log(response.data);
      }
    });

  }, [])

  useEffect(() => {
    //returns product list
    Axios.get('http://127.0.0.1:3001/api/categories').then((response) => {
      if (response.data.length > 0) {
        setProductCategories(response.data);
        // console.log(response.data);
      }
    });

  }, [])


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

  const addToBasket = (product_id, product_name, desc, price, quantity, option = "add") => {
    //Checks if basket exists and gets values if it does
    // if (localStorage.getItem(basket) != null) {
    //   basket = JSON.parse(localStorage.getItem(basket));
    // }
    // basket.push(product_id) //adding new value
    // //saving new value in localstorage
    // localStorage.setItem('basket', JSON.stringify(basket));

    let extra = 0;
    if (option == "add") extra = 1;
    else if (option == "minus") extra = -1;

    if (basketList.length == 0) {

      //add to basket
      setBasketList(() => ([
        ...basketList,
        {
          "id": product_id,
          "name": product_name,
          "description": desc,
          "quantity": extra,
          "price": price,
        }
      ]));

      setBasketItems(basketItems + 1);
      setBasketTotal(basketTotal + 1);
      return;

    } else {
      for (let i = 0; i < basketItems; i++) {
        if (basketList[i].id == product_id) {
          if (basketList[i].quantity + extra < 1) {

            //removes product from basket
            setBasketList((arr) =>
              arr.filter(element => {
                return element.id != product_id;
              }),
            );

            setBasketItems(basketItems - 1);
            setBasketTotal(basketTotal - 1);
            break;
          }

          //Update product quantity
          const temp = [...basketList];
          const index = temp.findIndex(index => index.id == product_id)
          temp[index].quantity = extra + basketList[i].quantity;

          setBasketList(temp);
          setBasketTotal(basketTotal + extra)
          break;
        }

        if (i == basketList.length - 1) {

          //adds new product to basket
          setBasketList(() => ([
            ...basketList,
            {
              "id": product_id,
              "name": product_name,
              "description": desc,
              "quantity": extra,
              "price": price,
            }
          ]));

          setBasketItems(basketItems + 1);
          setBasketTotal(basketTotal + 1);
          break;
        }
      }
    }
    console.log(basketTotal);
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
      <header>
        <NavBar setPage={setPage} setFormType={setFormType} basketTotal={basketTotal}
          search={search} cookie={cookie} signOut={signOut} />
      </header>

      <div className='app-container'>

        {page == "home" &&
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
        }
      </div>
    </div>
  );
}

export default App;
