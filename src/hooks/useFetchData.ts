import { useEffect, useState } from "react"

type ProductsType = {
  id: number, title: string, image: string, description: string, price: number, category: string, rating: any
}[]

type CategoriesType = {
  id: number, image: string, category: string
}[]

const useFetchData = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({ products: <ProductsType>[], categories: <CategoriesType>[] })

  const getData = async () => {
    await Promise.all([
      fetch('https://fakestoreapi.com/products/').then(res => res.json()),
      fetch('https://fakestoreapi.com/products/categories').then(res => res.json())

    ]).then((responses) => {
      let products = responses[0]
      let categoriesList = responses[1]

      //Creating new "categoryList" with id, img and category name
      let categories: CategoriesType = []

      for (let i = 0; i < categoriesList.length; i++) {
        let categoryImage = products.find((product: any) => product.category === categoriesList[i]).image;
        categories.push({ id: i, image: categoryImage, category: categoriesList[i] })
      }

      setProductData({ products, categories })
      setLoading(false)

    }).catch(error => console.log(error))

  }

  useEffect(() => {
    getData();
    setLoading(true);

  }, [])

  return { loading, productData }
}

export default useFetchData