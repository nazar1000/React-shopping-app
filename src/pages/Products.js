
import '../styles/product.css';
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useParams } from "react-router-dom"

function Products(props) {
  const { category } = useParams()

  const [filter, setFilter] = useState(category ? category : "all")
  const [filteredData, setFilteredData] = useState([])

  const navigate = useNavigate();


  useEffect(() => {
    if (filter === "all") {
      setFilteredData(props.productList)
    } else {
      let filteredProductList = props.productList.filter(product => product.category === filter);
      setFilteredData(filteredProductList)
    }

  }, [filter, props.productList])

  const handleChange = (e) => {
    if (e.target.value === "all") navigate(`/products`)
    else navigate(`/products/${e.target.value}`)
    setFilter(e.target.value)
  }




  return (
    <div className="product-page">
      <div className='filter'>
        <select value={filter} onChange={handleChange}>
          <option value="all">All</option>
          {props.categories.map(element => {
            return <option key={element.category} value={element.category}>{element.category}</option>
          })}
        </select>
      </div>

      <>
        <h1>Results</h1>
        <div className='product-list'>

          {props.productList && filteredData.map((product, key) => {
            let image = "https://loremflickr.com/250/200/products?random=" + product.product_id;
            // let image = product.product_image;
            return (
              <div className='product' key={product.product_id}>
                <div className="product-inner-container">
                  {/* <div className='product_image' onClick={() => { props.setPreview(product.product_id) }}> */}
                  <div className='product_image' onClick={() => navigate(`/products/${product.category}/${product.product_id}`)}>

                    <img src={image} />
                    {/* <img src={cat} /> */}
                  </div>
                  <div className='product_info'>
                    <h4 className='product_id'>Product#: {product.product_id}</h4>
                    <h4 className='product_category'>Category: {product.category}</h4>

                    <div className='prd_desc_container'>
                      <h3 className='product_name'>{product.product_name}</h3>
                      <h4 className='product_desc'>{product.description}</h4>
                    </div>

                    <h4 className='product_price'>£{product.price}</h4>
                    <h4 className='product_quantity'>In stock: {product.quantity}</h4>
                    <h4 className='text'>Click for details.</h4>
                    {/* <button onClick={() => { addToBasket(product.product_id, product.product_name, product.description, product.price, 1, "add") }} className='button-style'>Add to basket</button> */}
                  </div>
                </div>
              </div>
            )
          })

          } {filteredData.length === 0 && <h1 className='product-list_error'>Nothing has been found!</h1>}

        </div>
      </>
    </div >
  )
}





export default Products;