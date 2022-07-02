
import '../styles/product.css';

import Preview from '../pages/Preview';

function Products(props) {
    return (
        <div className="product-page">

            {props.formType != "preview" &&
                <>
                    <h1>Results</h1>
                    <div className='product-list'>


                        {props.productList !== "" && props.productList.map((product, key) => {

                            let image = "https://loremflickr.com/250/200/products?random=" + product.product_id;
                            // let image = product.product_image;
                            return (
                                <div className='product' key={product.product_id}>
                                    <div className="product-inner-container">
                                        <div className='product_image' onClick={() => { props.setPreview(product.product_id) }}>
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

                        } {props.productList == "" && <h1 className='product-list_error'>Error download list, try again</h1>}

                    </div>

                </>
            }

            {
                props.formType == "preview" &&
                <Preview previewInfo={props.previewInfo} setFormType={props.setFormType} addToBasket={props.addToBasket} />

            }
        </div >
    )
}





export default Products;