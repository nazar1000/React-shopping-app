
import '../styles/product.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom"
import ProductTile from '../components/ProductTile';

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
  // console.log(props.productList)

  //Filtering products
  useEffect(() => {
    sortData();
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
        else return false
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


  return (
    <div className="product-page">
      <div className='filter'>
        <div className='filter-inner'>

          <h3>Filter</h3>
          <div id='filter__category'>
            <div className='filter-separator'>
              <label htmlFor="category-input">Category: </label>

              <select id='category-input' value={filter} onChange={handleCategoryChange}>
                <option value="all">All</option>
                {props.categories.map((category: any) => {
                  return <option key={category.id} value={category.category}>{category.category[0].toUpperCase() + category.category.substring(1)}</option>
                })}
              </select>
            </div>
          </div>

          <div id='filter__price'>
            <div className='filter-separator'>
              <label>Price:</label>
              <div>

                <button className={price[1] === 10000 ? "active" : ""} onClick={() => handlePriceFilter(0, 10000)}>Any</button>
                <button className={price[1] === 20 ? "active" : ""} onClick={() => handlePriceFilter(0, 20)}>Up to £20</button>
                <button className={price[1] === 50 ? "active" : ""} onClick={() => handlePriceFilter(20, 50)}>£20 to £50</button>
                <button className={price[1] === 100 ? "active" : ""} onClick={() => handlePriceFilter(50, 100)}>£50 to £100</button>
                <button className={price[1] === 5000 ? "active" : ""} onClick={() => handlePriceFilter(100, 5000)}>£100 & above</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 onClick={() => console.log(location.pathname)}>Results</h1>
      <div className='product-list'>

        {props.productList && filteredData.map((product: any) => {
          return (
            <ProductTile key={product.id} product={product} onClick={handleProductClick} />
          )
        })
        } {filteredData.length === 0 && <h1 className='product-list_error'>Nothing has been found!</h1>}

      </div>
    </div >
  )
}





export default Products;