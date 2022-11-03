
import '../styles/product.scss';
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom"

type ProductsProps = {
  productList: {}[],
  categories: {}[],
  addToBasket: Function
}

function Products(props: ProductsProps) {
  const { category, searchQuery } = useParams()

  const [filter, setFilter] = useState(category ? category : "all")
  const [price, setPrice] = useState([0, 5000])
  const [filteredData, setFilteredData] = useState<{}[]>([])

  const navigate = useNavigate();
  const location = useLocation();


  //Filtering products
  useEffect(() => {
    sortData();
    console.log(props.productList)
  }, [filter, props.productList, price, useParams()])


  const sortData = () => {
    if (category === undefined) setFilter("all");

    let search = "";
    if (searchQuery && searchQuery !== "search=") search = searchQuery

    let nameFilterList: any[] = [];

    //Searching for searchQuery match
    if (search !== "") {
      nameFilterList = props.productList.filter((product: any) => {
        let productName = product.title.toLowerCase();
        let query = search.toLowerCase();
        if (productName.includes(query)) return product;
      })
    }

    //If query does not exist use primary list for filter sorting, otherwise use nameFilterList
    let list = search !== "" ? nameFilterList : props.productList

    let filteredList = list.filter((product: any) => {
      if ((product.category === filter || filter === "all") &&
        product.price > price[0] && product.price <= price[1]
      ) return product
    })

    setFilteredData(filteredList)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //if search is active
    if (e.target.value === "all") navigate(`/products/${searchQuery}`)
    else navigate(`/products/${searchQuery ? searchQuery : "search="}/${e.target.value}`)
    setFilter(e.target.value)
  }

  const handlePriceFilter = (min: number, max: number) => setPrice([min, max])
  const handleProductClick = (productCategory: string, productId: number) => {
    if (filter === "all") navigate(`/products/${searchQuery ? searchQuery : "search="}/${productCategory}/${productId}`)
    else navigate(`${productId}`)
  }

  const calculateImg = () => {

  }

  return (
    <div className="product-page">

      <div className='filter'>
        <div id='filter__category'>
          <label htmlFor="category-input">Category: </label>
          <select id='category-input' value={filter} onChange={handleCategoryChange}>
            <option value="all">All</option>
            {props.categories.map((category: any) => {
              return <option key={category.id} value={category.category}>{category.category}</option>
            })}
          </select>
        </div>

        <div id='filter__price'>
          <label>Price</label>
          <button onClick={() => handlePriceFilter(0, 5000)}>Any</button>
          <button onClick={() => handlePriceFilter(0, 20)}>Up to £20</button>
          <button onClick={() => handlePriceFilter(20, 50)}>£20 to £50</button>
          <button onClick={() => handlePriceFilter(50, 100)}>£50 to £100</button>
          <button onClick={() => handlePriceFilter(100, 5000)}>£100 & above</button>
        </div>
      </div>

      <>
        <h1 onClick={() => console.log(location.pathname)}>Results {searchQuery ? ("for " + searchQuery) : ""}</h1>
        <div className='product-list'>

          {props.productList && filteredData.map((product: any) => {
            // let image = "https://loremflickr.com/250/200/products?random=" + product.id;
            // let image = product.product_image;
            return (
              <div className='product' key={product.id}>
                <div className="product-inner-container">
                  {/* <div className='product_image' onClick={() => { props.setPreview(product.product_id) }}> */}
                  <div className='product_image' onClick={() => handleProductClick(product.category, product.id)}>

                    <img src={product.image} />
                    {/* <img src={cat} /> */}
                  </div>
                  <div className='product_info'>
                    <h4 className='product_id'>Product#: {product.id}</h4>
                    <h4 className='product_category'>Category: {product.category}</h4>

                    <div className='prd_desc_container'>
                      <h3 className='product_name'>{product.title}</h3>
                      <h4 className='product_desc'>{product.description}</h4>
                    </div>

                    <h4 className='product_price'>£{product.price}</h4>
                    <h4 className='product_quantity'>In stock: {product?.quantity}</h4>
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