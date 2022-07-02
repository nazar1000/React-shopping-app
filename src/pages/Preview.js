import '../styles/preview.css';

function Preview(props) {

    return (
        <div id='preview_container'>
            <button className='back-button' onClick={() => { props.setFormType("products") }}>Go back</button>
            <div id='preview-inner-div'>



                <div id='preview-image-div'>
                    {/* <img src={props.previewInfo.product_image} /> */}
                    <img src=" https://loremflickr.com/250/200/games?random=" />


                </div>
                <div id='preview-info-div'>
                    <h2 className='product-name'>{props.previewInfo.product_name}</h2>
                    <h3 className='product-category'>Category: {props.previewInfo.category}</h3>
                    <h4 className='product-code'>Product no: {props.previewInfo.product_id} </h4>
                    <h3 className='product-stock'>Available: {props.previewInfo.quantity}</h3>
                    <h3 className='product-desc'>{props.previewInfo.description}</h3>
                    <h3 className='product-price'>price: {props.previewInfo.price}</h3>
                    <div className='add-button button-style' onClick={() => { props.addToBasket(props.previewInfo.product_id, props.previewInfo.product_name, props.previewInfo.description, props.previewInfo.price, 1, "add") }}>Add to basket</div>

                </div>

                <div id='more-info-div'></div>
            </div>
        </div>
    )
}





export default Preview;