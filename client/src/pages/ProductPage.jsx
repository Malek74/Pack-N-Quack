import Product from "@/components/product/Product";
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams();
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const fetcher2 = (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        fetch(url)
          .then((res) => res.json())
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      }, 250);
    });
  };

  return (
    <div>
      <BreadcrumbTab name={item.name} />
      <Product item={item} />
      <hr />
      <ProductReviews item={item} />
      <hr />
    </div>
  );
}
