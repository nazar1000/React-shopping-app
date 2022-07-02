import '../styles/basket.css';
import { useState, useEffect } from 'react';



function Basket(props) {
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        let cost = 0;

        Object.keys(props.basketList).map((basketItem, key) => (
            cost += (parseFloat(props.basketList[basketItem].price) * parseFloat(props.basketList[basketItem].quantity))
        ));

        setTotalCost(cost.toFixed(2));

    }, [props.addToBasket])


    return (
        <div className='basket'>
            <div className='basket_inner_container'>

                <div className='basket_list'>
                    <div className='basket_list_inner_container'>
                        <div className='container'>
                            <h2>Shopping Cart</h2>
                            <h2>{props.basketItems} Items</h2>
                            <table>

                                <tbody>
                                    <tr>
                                        <th>ID:</th>
                                        <th>Product name:</th>
                                        {/* <th>Product description:</th> */}
                                        <th>Price:</th>
                                        <th>Quantity:</th>
                                        <th>Total:</th>

                                    </tr>
                                    {props.basketList !== "" &&
                                        Object.keys(props.basketList).map((basketItem, key) => (

                                            // <div key={key}>
                                            <tr key={key}>

                                                <th >{props.basketList[basketItem].id}</th>
                                                <th >{props.basketList[basketItem].name}</th>
                                                {/* <th >{props.basketList[basketItem].description}</th> */}
                                                <th >£{props.basketList[basketItem].price.toFixed(2)}</th>
                                                <th >
                                                    <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(props.basketList[basketItem].id, props.basketList[basketItem].name, props.basketList[basketItem].description, props.basketList[basketItem].price, 1, "minus") }} >-</button>
                                                    {props.basketList[basketItem].quantity}
                                                    <button className='bsk_quantity_btn' onClick={() => { props.addToBasket(props.basketList[basketItem].id, props.basketList[basketItem].name, props.basketList[basketItem].description, props.basketList[basketItem].price, 1, "add") }}>+</button>
                                                </th>

                                                <th>£{(parseFloat(props.basketList[basketItem].price) * parseFloat(props.basketList[basketItem].quantity)).toFixed(2)}</th>

                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </div>

                        <div className='basket_checkout'>
                            <div className='checkout_container'>
                                <h2>Checkout</h2>
                                <h3>{props.basketItems} items </h3>
                                {/* <h3>Total Cost</h3> */}
                            </div>
                            <div className='checkout_container'>
                                <h3>Shipping</h3>
                                <input type="checkbox" id="shipping1" name="shipping1" value="standard" defaultChecked></input>
                                <label htmlFor="shipping1"> Standard shipping - £5.00</label>
                            </div>
                            <div className='checkout_container'>
                                <h3>Promo code</h3>
                                <input type="text" placeholder="Enter code"></input>
                                <button className='button-style' id='bsk_button1'>Apply</button>
                            </div>
                            <div className='checkout_container'>
                                <h3>Total cost</h3>
                                <h3>£{totalCost}</h3>
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