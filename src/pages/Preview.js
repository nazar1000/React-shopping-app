import '../styles/preview.css';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosId from '../hooks/useAxiosId';


function Preview(props) {
  let { product_id } = useParams();
  const { loading, product } = useAxiosId(product_id)
  const navigate = useNavigate();

  useEffect(() => {
    // console.log(product)
  }, [product])




  return (
    <div id='preview_container'>
      <button className='back-button' onClick={() => { navigate(`/products/${product.category}`) }}>Go back to {product.category}</button>

      <div id='preview-inner-div'>
        <div id='preview-image-div'>
          {/* <img src={product.product_image} /> */}
          <img src=" https://loremflickr.com/250/200/games?random=" />
        </div>
        <div id='preview-info-div'>
          <h2 className='product-name'>{product.product_name}</h2>
          <h3 className='product-category'>Category: {product.category}</h3>
          <h4 className='product-code'>Product no: {product.product_id} </h4>
          <h3 className='product-stock'>Available: {product.quantity}</h3>
          <h3 className='product-desc'>{product.description}</h3>
          <h3 className='product-price'>price: {product.price}</h3>
          <div className='add-button button-style' onClick={() => { props.addToBasket(product) }}>Add to basket</div>

        </div>

        <div id='more-info-div'></div>
      </div>
    </div>
  )
}





export default Preview;