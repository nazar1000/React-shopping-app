import axios from "axios";
import { useEffect, useState } from "react"


const useAxiosId = (productId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>([])

  const getData = async () => {
    // console.log(productId)
    // console.log("sending id" + productId)

    if (productId === undefined) {
      setProduct([])
      setLoading(false)
      return;
    };


    const request = axios.get(`http://127.0.0.1:3001/api/productbyid/${productId}`)
    request.then(res => {
      // console.log(res)

      setProduct(res.data[0])
      setLoading(false)
    }).catch(error => { })
  }

  useEffect(() => {
    getData();
    setLoading(true);

  }, [])

  return { loading, product }
}

export default useAxiosId