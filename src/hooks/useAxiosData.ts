import axios from "axios";
import { useEffect, useState } from "react"


const useAxiosData = () => {
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState({ products: [], categories: [] })

  const getData = async () => {

    const requestArr = [
      axios.get('http://127.0.0.1:3001/api/products'),
      axios.get('http://127.0.0.1:3001/api/categories')
    ];

    await Promise.allSettled(requestArr).then((res) => {
      let data1;
      let data2;

      if (res[0].status === "fulfilled") data1 = res[0].value.data
      else data1 = { error: res[0].reason }

      if (res[1].status === "fulfilled") data2 = res[1].value.data
      else data2 = { error: res[1].reason }

      setProductData({
        products: data1,
        categories: data2,
      });

      setLoading(false)

    }).catch(error => { })


  }

  useEffect(() => {
    getData();
    setLoading(true);

  }, [])

  return { loading, productData }
}

export default useAxiosData