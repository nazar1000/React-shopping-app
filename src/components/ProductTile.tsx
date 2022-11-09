
import './productTile.scss';

type Product = {
  id: number,
  title: string,
  description: string,
  image: string,
  price: number,
  category: string,
  rating: { rate: number, count: number }
}

type ProductTileType = {
  product: Product,
  onClick: Function
}

function ProductTile({ product, onClick }: ProductTileType) {


  const formatPrice = (price: number) => {
    let pounds = Math.floor(price)
    let pence = Math.round((price - pounds) * 100)

    return <><span>£ </span>{pounds}<span> {pence === 0 ? "00" : pence}</span></>
  }
  return (
    <div className='product' key={product.id}>
      <div className="product-inner-container">
        {/* <div className='product_image' onClick={() => { props.setPreview(product.product_id) }}> */}
        <div className='product_image' onClick={() => onClick(product.category, product.id)}>
          <img src={product.image} alt={product.title} />
        </div>
        <div className='product_info'>
          <h4 className='product_id'>Code: #{product.id}</h4>
          {/* <h4 className='product_category'>Category: {product.category}</h4> */}

          <div className='prd_desc_container'>
            <h3 className='product_name'>{product.title}</h3>
            <h3 className='rating'><span>&#9733;{product.rating.rate}</span> <span>&#40;{product.rating.count}&#41;</span></h3>
            {/* <h4 className='product_desc'>{product.description}</h4> */}
          </div>

          <h4 className='product_price'>{formatPrice(product.price)}</h4>
          {/* <h4 className='product_quantity'>In stock: {product?.quantity}</h4> */}
          {/* <h4 className='text'>Click for details.</h4> */}
          {/* <button onClick={() => { addToBasket(product.product_id, product.product_name, product.description, product.price, 1, "add") }} className='button-style'>Add to basket</button> */}
        </div>
      </div>
    </div>
  )
}





export default ProductTile;