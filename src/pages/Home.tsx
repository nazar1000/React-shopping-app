import '../styles/home.css';
import { Outlet, useNavigate } from "react-router-dom"

type HomeProps = {
  productCategories: {}[]
}

function Home(props: HomeProps) {
  const navigate = useNavigate()

  return (

    <div className="Home">
      <div className='home_inner_container'>
        <h1>Welcome</h1>
        <div id='about-text'>
          <p> About this page ... Id deserunt pariatur sit laborum excepteur quis enim culpa elit voluptate cillum.
            Mollit do commodo dolore excepteur. Quis laboris dolore ea culpa eu ullamco ex exercitation dolor reprehenderit nisi mollit.
            Adipisicing laborum nulla labore id consectetur exercitation excepteur ut quis. Irure commodo in enim ipsum ipsum commodo.</p>
        </div>


        <div className='categories_container'>
          <h2>Our products</h2>

          {props.productCategories && props.productCategories.map((product: any, key) => {
            let image = "https://loremflickr.com/250/200/games?random=" + product.product_id;
            // let image = product.product_image;
            return (

              <div key={product.product_id} className='product_category' onClick={() => navigate(`/products/${product.category}`)}>
                <div className='product_category_image'>
                  <img src={image} />
                  <label>Sample image</label>
                </div>
                <h3>{product.category}</h3>
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