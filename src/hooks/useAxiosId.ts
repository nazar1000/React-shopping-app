import axios from "axios";
import { useEffect, useState } from "react"


const useAxiosId = (productId: number) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([])

  const getData = async () => {
    // console.log(productId)
    const request = axios.get(`http://127.0.0.1:3001/api/productbyid/${productId}`)
    request.then(res => {
      setProduct(res.data)
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