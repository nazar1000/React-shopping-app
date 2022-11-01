import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';
import { Routes, Route } from "react-router-dom"


import './styles/App.css';
import NavBar from './components/navBar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Basket from './pages/Basket';
import useAxiosData from './hooks/useAxiosData';
import Preview from "./pages/Preview"

type BasketListType = {
  "id": number,
  "name": string,
  "description": string,
  "quantity": number,
  "price": number,
}[]

function App() {
  const [cookie, setCookie, removeCookie] = useCookies();
  const [formType, setFormTypes] = useState("login");

  const [loginStatus, setLoginStatus] = useState(cookie.user_name != undefined ? true : false)
  const [userInfo, setUserInfo] = useState<any>()

  const { loading, productData } = useAxiosData() //products, categories


  const [basketList, setBasketList] = useState<BasketListType>([]);
  const [basketItems, setBasketItems] = useState(0);

  Axios.defaults.withCredentials = true;
  useEffect(() => {
    //Sets cookies (does not work in non https environment)
    // Axios.get('http://127.0.0.1:3001/api/login').then((response) => {
    //   if (response.data.loggedIn === true) setLoginStatus(true);
    //   // console.log("Refresh: Data back");
    //   console.log(response.data);
    //   console.log(cookie)

    // });
  }, [])

  //testing function
  const checkAuthentication = () => {
    let token = localStorage.getItem("token");

    Axios.get('http://127.0.0.1:3001/api/isUserAuth', {
      headers: {
        "x-access-token": token ? token : "",
      }
    }).then((response) => {
      if (!response.data.auth) console.log(response.data.message + ", Please login again!");
      else console.log("Authenticated!");
      // response.data
    })
  }

  //Sends data to backEnd
  const setLogin = (loginStatus: boolean, data?: { auth: boolean, token: string, result: any }) => {
    if (data) {
      // login success
      localStorage.setItem("token", data.token)
      setLoginStatus(loginStatus)
      setUserInfo({ email: data.result.email, firstName: data.result.first_name, lastName: data.result.last_name })
      // Setting cookie for login
      setCookie("user_name", data.result.first_name, { maxAge: 60 * 24 * 3 });
      setCookie("user_email", data.result.email, { maxAge: 60 * 24 * 3 });

    } else {
      //login failed
      setLoginStatus(loginStatus)
      signOut();
    }
  };

  const signOut = () => {
    removeCookie("user_name");
    removeCookie("user_email");
    localStorage.removeItem("token");
    setLoginStatus(false);
  }

  type AddToBasketType = {
    id: number,
    name: string,
    description: string,
    quantity: number,
    price: number

  }

  const addToBasket = (newItem: AddToBasketType, newQuantity = 1) => {

    // console.log(newItem)
    const item: any = basketList.filter((item: any) => item.id === newItem.id);

    // console.log("Item added", newItem)
    // console.log("In basket", basketList)
    // console.log("Item is in basket", item)

    if (item.length > 0) {
      //item is in basket
      // console.log("Item in basket")

      const newQuantityNotZero = (item[0].quantity + newQuantity > 0)
      if (newQuantityNotZero) {
        // console.log("Updating")
        //update item in basket

        setBasketList((basketList: any) => (
          basketList.map((el: any) => (el.id === newItem.id ? { ...el, quantity: el.quantity + newQuantity } : el))
        ))
      } else {
        // console.log("Deleting")
        //Delete item since new quantity is 0
        setBasketList((basketList) => basketList.filter((item: any) => item.id !== newItem.id))
      }

    } else {
      // console.log("Adding new")
      //add new item to the basket

      setBasketList((basketList) => (
        [
          ...basketList,
          {
            "id": newItem.id,
            "name": newItem.name,
            "description": newItem.description,
            "quantity": newQuantity,
            "price": newItem.price,
          }
        ]
      ))
    }
  }

  const search = (filterValue: string) => {
    console.log(filterValue)
    let filter = filterValue.toUpperCase();
    let products = document.getElementsByClassName("product");
    // for (let i = 0; i < products.length; i++) {
    //   let productName = products[i].getElementsByClassName("prd_desc_container")[0].firstChild.innerHTML.toUpperCase();

    //   if (productName.indexOf(filter) > -1) {
    //     // console.log("yes")
    //     products[i].style.display = "block";
    //   } else {
    //     products[i].style.display = "none";
    //   }
    // }

  }

  return (
    <div className="App">
      <div className='app-container'>
        <button onClick={() => checkAuthentication()}>Check authentication</button>

        <Routes>
          <Route path='/' element={
            <NavBar basketTotal={basketList.length}
              search={search} cookie={cookie} signOut={signOut} />
          } >


            <Route path='home' element={
              <Home productCategories={productData?.categories} />
            } />


            <Route path="products" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            />

            <Route path="products/:category" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            />

            <Route path="products/:category/:product_id" element={
              <Preview addToBasket={addToBasket} />
            }
            />


            <Route path="login" element={
              <Login setLogin={setLogin} loginStatus={loginStatus} />}
            />
            <Route path="register" element={
              <Register loginStatus={loginStatus} />}
            />

            <Route path="basket" element={
              <Basket basketItems={basketItems} basketList={basketList} addToBasket={addToBasket} />}
            />

          </Route>
        </Routes>

      </div>
    </div>
  );

}
export default App;
