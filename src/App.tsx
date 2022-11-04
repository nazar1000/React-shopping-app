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
import useFetchData from './hooks/useFetchData';

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

  // const { loading, productData } = useAxiosData() //products, categories
  const { loading, productData } = useFetchData() //products, categories

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
    price: number,
    image: string,

  }

  const addToBasket = (newItem: AddToBasketType, newQuantity = 1, override = false) => {

    // console.log(newItem)
    const item: any = basketList.filter((item: any) => item.id === newItem.id);
    if (item.length > 0) {
      //item is in basket

      let newQuantityNotZero: boolean;
      let updatedQuantity: number;

      //If overriding value
      if (override) {
        newQuantityNotZero = newQuantity > 0;
        updatedQuantity = newQuantity;
      }
      //If adding to value
      else {
        newQuantityNotZero = (item[0].quantity + newQuantity > 0)
        updatedQuantity = item[0].quantity + newQuantity
      }

      //If new quantity is not zero
      if (newQuantityNotZero) {
        //update item in basket
        setBasketList((basketList: any) => (
          basketList.map((el: any) => (el.id === newItem.id ? { ...el, quantity: updatedQuantity } : el))
        ))

        //Delete item since it is 0
      } else {
        setBasketList((basketList) => basketList.filter((item: any) => item.id !== newItem.id))
      }

      //Element not found 
      //add new item to the basket
    } else {
      setBasketList((basketList) => (
        [
          ...basketList,
          {
            "id": newItem.id,
            "name": newItem.name,
            "description": newItem.description,
            "quantity": newQuantity,
            "price": newItem.price,
            "image": newItem.image
          }
        ]
      ))
    }
  }


  return (
    <div className="App">
      <div className='app-container'>
        {/* <button onClick={() => checkAuthentication()}>Check authentication</button> */}

        <Routes>
          <Route path='/' element={
            <NavBar basketTotal={basketList.length}
              cookie={cookie} signOut={signOut} />
          } >


            <Route index element={
              <Home productCategories={productData?.categories} />
            } />


            <Route path="products" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            >
            </Route>

            <Route path="products/:searchQuery" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            />

            <Route path="products/:searchQuery/:category" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            />

            <Route path="products/:searchQuery/:category/:product_id" element={
              <Preview addToBasket={addToBasket} />
            }
            />
            {/* 
            <Route path="products/:category" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            /> */}

            {/* 
            <Route path="products/:searchQuery/:category" element={
              <Products productList={productData.products} categories={productData.categories}
                addToBasket={addToBasket} />}
            /> */}

            {/* <Route path="products/:searchQuery/:category/:product_id" element={
              <Preview addToBasket={addToBasket} />
            } */}
            {/* /> */}






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
