import '../styles/preview.css';
import { Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAxiosId from '../hooks/useAxiosId';
import useFetchID from '../hooks/useFetchID';

type PreviewProps = {
  addToBasket: Function
}

function Preview(props: PreviewProps) {
  let { product_id } = useParams();
  // const { loading, product } = useAxiosId(product_id)
  const { loading, product } = useFetchID(product_id)
  const navigate = useNavigate();
  const location = useLocation();

  const formatPrice = (price: number) => {
    let pound = Math.floor(price)
    let pence = Math.floor((price - pound) * 100)
    return "" + pound + "." + pence
  }

  useEffect(() => {
    // console.log(product)

  }, [product])

  const prepareAddToBasket = (product: any) => {
    props.addToBasket({
      id: product.id,
      name: product.title,
      description: product.description,
      quantity: 1,
      price: product.price,
      image: product.image
    })
  }

  const goBackButton = () => {
    if (product_id) {
      let newLocation = location.pathname.slice(0, location.pathname.length - product_id?.toString().length)
      navigate(newLocation)
    }
  }

  return (
    <div id='preview_container'>
      {product && product.id !== undefined &&
        <>
          <button className='back-button button-style' onClick={() => goBackButton()}> Back to results </button>

          <div id='preview-inner-div'>

            <div id='preview-image-div'>
              {/* <img src={product.product_image} /> */}
              {/* <img src=" https://loremflickr.com/250/200/games?random=" /> */}
              <img src={product.image} />
            </div>
            <div id='preview-info-div'>
              <h2 className='product-name'>{product.title}</h2>
              <h3 className='product-category'>Category: {product.category}</h3>
              <h4 className='product-code'>Product no: {product.id} </h4>
              <h3 className='product-stock'>Available: {10}</h3>
              <h3 className='product-desc'>{product.description}</h3>
              <h3 className='product-price'>£{formatPrice(product.price)}</h3>
              <div className='add-button button-style' onClick={() => prepareAddToBasket(product)}>Add to basket</div>

            </div>

            <div id='more-info-div'></div>
          </div>
        </>
      }
    </div>
  )
}





export default Preview;