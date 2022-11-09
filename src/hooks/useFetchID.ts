import { useEffect, useState } from "react"


const useFetchID = (productId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>([])

  const getData = async () => {

    if (productId === undefined) {
      setProduct([])
      setLoading(false)
      return;
    };


    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      .then(data => {

        setProduct(data)
        setLoading(false)

      }).catch(error => console.log(error))
  }

  useEffect(() => {
    getData();
    setLoading(true);

  }, [])

  return { loading, product }
}

export default useFetchID