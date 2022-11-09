import '../styles/basket.scss';
import { useState, useEffect } from 'react';

type BasketProps = {
  basketList: {}[],
  addToBasket: Function,

}

function Basket(props: BasketProps) {
  const [totalCost, setTotalCost] = useState(0);
  const [totalItems, setTotalItems] = useState(0)
  const [shippingCost, setShippingCost] = useState(0)

  useEffect(() => {
    let totalCost = 0;
    let totalItems = 0;
    props.basketList.forEach((item: any) => {
      totalCost += (item.quantity * item.price)
      totalItems += item.quantity;
    });

    totalCost += shippingCost;
    setTotalCost(totalCost)
    setTotalItems(totalItems)

  }, [props.basketList, shippingCost])


  const formatPrice = (price: number) => {
    let pound = Math.floor(price)
    let pence = Math.floor((price - pound) * 100)
    return "" + pound + "." + (pence === 0 ? "00" : pence)
  }

  return (
    // <div className='basket'>
    //   <div className='basket_inner_container'>

    //     <div className='basket_list'>
    //       <div className='basket_list_inner_container'>
    //         <div className='container'>
    //           <h2>Shopping Cart</h2>
    //           <h2>{props.basketItems} Items</h2>
    //           <div className='basket-item'>
    //             <div>
    //               <img></img>
    //             </div>
    //             <div className='item__info'>
    //               <h2>Title</h2>
    //               <h3>in stock</h3>
    //               <h3>Quantity</h3>

    //             </div>
    //             <div className='item__cost'>
    //               <h2>Cost</h2>
    //             </div>


    //           </div>

    //           <table>
    //             <tbody>
    //               <tr>
    //                 <th>ID:</th>
    //                 <th>Product name:</th>
    //                 {/* <th>Product description:</th> */}
    //                 <th>Price:</th>
    //                 <th>Quantity:</th>
    //                 <th>Total:</th>

    //               </tr>
    //               {props.basketList.length > 0 &&
    //                 // <></>
    //                 props.basketList.map((item: any) => (
    //                   <tr key={item.id}>

    //                     <th >{item.id}</th>
    //                     <th >{item.name}</th>
    //                     <th >£{item.price.toFixed(2)}</th>
    //                     <th >
    //                       <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(item, -1) }} >-</button>
    //                       {item.quantity}
    //                       <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(item, +1) }}>+</button>
    //                     </th>

    //                     <th>£{(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}</th>

    //                   </tr>





    //                 ))
    //                 // Object.keys(props.basketList).map((basketItem: string, key) => (
    //                 // <tr key={key}>

    //                 //     <th >{props.basketList[basketItem].id}</th>
    //                 //     <th >{props.basketList[basketItem].name}</th>
    //                 //     <th >£{props.basketList[basketItem].price.toFixed(2)}</th>
    //                 //     <th >
    //                 //         <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(props.basketList[basketItem].id, props.basketList[basketItem].name, props.basketList[basketItem].description, props.basketList[basketItem].price, 1, "minus") }} >-</button>
    //                 //         {props.basketList[basketItem].quantity}
    //                 //         <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(props.basketList[basketItem].id, props.basketList[basketItem].name, props.basketList[basketItem].description, props.basketList[basketItem].price, 1, "add") }}>+</button>
    //                 //     </th>

    //                 //     <th>£{(parseFloat(props.basketList[basketItem].price) * parseFloat(props.basketList[basketItem].quantity)).toFixed(2)}</th>

    //                 // </tr>
    //                 // ))
    //               }

    //             </tbody>
    //           </table>
    //         </div>

    //         <div className='basket_checkout'>
    //           <div className='checkout_container'>
    //             <h2>Checkout</h2>
    //             <h3>{props.basketItems} items </h3>
    //             {/* <h3>Total Cost</h3> */}
    //           </div>
    //           <div className='checkout_container'>
    //             <h3>Shipping</h3>
    //             <input type="checkbox" id="shipping1" name="shipping1" value="standard" defaultChecked></input>
    //             <label htmlFor="shipping1"> Standard shipping - £5.00</label>
    //           </div>
    //           <div className='checkout_container'>
    //             <h3>Promo code</h3>
    //             <input type="text" placeholder="Enter code"></input>
    //             <button className='button-style' id='bsk_button1'>Apply</button>
    //           </div>
    //           <div className='checkout_container'>
    //             <h3>Total cost</h3>
    //             <h3>£{totalCost}</h3>
    //             <button className='button-style' id='bsk_button2'>Checkout</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //   </div>
    // </div>

    <div className='basket'>
      <div className='basket_inner_container'>

        <div className='basket_list'>
          <div className='basket_list_inner_container'>

            <div className='container'>
              <div id='basket__legend'>
                <h2>Cart {"(" + props.basketList.length + ")"}</h2>
              </div>

              {props.basketList.length > 0 && props.basketList.map((item: any) => (
                <div key={item.id} className='basket__item'>
                  <div className='item__image'>
                    <img src={item.image} alt="" />
                  </div>
                  <div className='item__info'>
                    <h3>{item.name}</h3>
                    <p>Quantity: </p>
                    {/* <input type="number" onChange={(e) => setNewQuantity(Number(e.target.value))}></input> */}
                    <button onClick={() => props.addToBasket(item, -1)}>-</button>
                    <p>{item.quantity}</p>
                    <button onClick={() => props.addToBasket(item, 1)}>+</button>

                    <p>Cost: £{formatPrice(item.price * item.quantity)} {item.quantity > 1 ? "(" + formatPrice(item.price) + " per item)" : ""}</p>
                    <button onClick={() => props.addToBasket(item, -1000)}>Remove</button>
                  </div>

                </div>
              ))}

            </div>

            <div className='basket_checkout'>
              <div className='tab items-tab'>
                <h2>Checkout</h2>
                <h3>{totalItems} items </h3>
                {/* <h3>Total Cost</h3> */}
              </div>
              <div className='tab shipping-tab'>
                <h3>Shipping</h3>
                <input type="radio" id="shipping1" name="shipping" value="0" defaultChecked onChange={(e) => setShippingCost(Number(e.target.value))}></input>
                <label htmlFor="shipping1"> Standard shipping - Free</label>
                <input type="radio" id="shipping2" name="shipping" value="5" onChange={(e) => setShippingCost(Number(e.target.value))}></input>
                <label htmlFor="shipping2"> Fast shipping - £5.00</label>
              </div>
              <div className='tab promo-tab'>
                <h3>Promo code</h3>
                <input type="text" placeholder="Enter code"></input>
                <button className='button-style' id='bsk_button1'>Apply</button>
              </div>
              <div className='tab total-tab'>
                {/* <div className='cost-summary'> */}
                <h3>Total cost</h3>
                <h3>£{formatPrice(totalCost)}</h3>

                <h5>Items: </h5>
                <h5>£{formatPrice(totalCost - shippingCost)}</h5>

                <h5>Shipping:</h5>
                <h5>{shippingCost > 0 ? "£" + formatPrice(shippingCost) : "-"}</h5>
                {/* </div> */}
                <button className='button-style' id='bsk_button2'>Checkout</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Basket;