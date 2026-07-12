import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../../API/api.js";

import { Button } from "@/components/ui/button";

const SinglePage = () => {
  const productId = useParams();
  const [quantity1, setQuantity] = useState(1);
  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/customer/${productId.id}`);
        setProduct(res.data);
        console.log(res.data, productId.id, productId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const addCarts = async (id) => {
    let product_id = id;
    let quantity = quantity1;
    try {
      await API.post("/cart/", {
        product_id,
        quantity,
      });
      console.log("Product added to cart!");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
      <p>{product.category_name}</p>
      <p>
        <Button
          onClick={() => {
            setQuantity(quantity1 - 1);
          }}
          disabled={quantity1 === 1}
        >
          -
        </Button>
        {quantity1}
        <Button
          onClick={() => {
            setQuantity(quantity1 + 1);
          }}
          disabled={quantity1 === product.stock}
        >
          +
        </Button>
      </p>
      <p>{product.stock}p</p>
      <div
        className="w-5 h-5 rounded-full border"
        style={{
          backgroundColor: product.color,
        }}
      ></div>
      <img
        src={product.image_url}
        alt={product.name}
        className="w-10 h-10 rounded "
      />
      <Button onClick={() => addCarts(product.product_id)}>Add to cart</Button>
    </div>
  );
};

export default SinglePage;
