import Product from "@/components/productPage/Product";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import ProductReviews from "@/components/productPage/ProductReviews";
import { useUser } from "@/context/UserContext";
export default function ProductPage() {
  const { id } = useParams();
  const [item, setItem] = useState();
  const { prefCurrency } = useUser();
  const fetchProducts = () => {
    axios
      .get(`api/products/productDetails/${id}?currency=${prefCurrency}`)
      .then((response) => {
        setItem(response.data);
        console.log(response.data);
        console.log(response.data.name);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    console.log(id);
    fetchProducts();
  }, [prefCurrency]);

  if (item) {
    return (
      <div>
        <Product item={item} />
        <hr />
        {/* <ProductReviews item={item} /> */}
        <hr />
      </div>
    );
  }
}
