import '../styles/home.css';
import { useNavigate } from "react-router-dom"

type HomeProps = {
  productCategories: {}[]
}

function Home(props: HomeProps) {
  const navigate = useNavigate()

  return (

    <div className="home">
      <div className='home_inner_container'>
        <h1>ShopA</h1>
        <div id='about-text'>
          <p> About this page ... Id deserunt pariatur sit laborum excepteur quis enim culpa elit voluptate cillum.
            Mollit do commodo dolore excepteur. Quis laboris dolore ea culpa eu ullamco ex exercitation dolor reprehenderit nisi mollit.
            Adipisicing laborum nulla labore id consectetur exercitation excepteur ut quis. Irure commodo in enim ipsum ipsum commodo.</p>
        </div>


        <div className='categories_container'>
          <h2>Our products</h2>

          {props.productCategories && props.productCategories.map((category: any, key) => {
            return (

              <div key={category.id} className='product_category' onClick={() => navigate(`/products/search=/${category.category}`)}>
                <div className='product_category_image'>
                  <img src={category.image} alt={category.category} />
                </div>
                <h3>{category.category}</h3>
              </div>

            )
          })

          }
        </div>
      </div>
    </div>
  )
}





export default Home;