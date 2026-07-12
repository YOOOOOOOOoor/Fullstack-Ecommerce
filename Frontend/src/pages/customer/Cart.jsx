import API from "../../../API/api.js";
import { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [p, setP] = useState(1);

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchTotalCarts = async () => {
      try {
        const res = await API.get("/cart/all");
        console.log("hi,", res.data);
        setTotalAmount(res.data.total);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    fetchTotalCarts();
  }, [p]);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const res = await API.get("/cart");
        console.log(res.data);
        setCart(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    fetchCarts();
  }, [p]);

  const inc = async (id) => {
    let product_id = id;
    const quantity = cart.find((c) => c.product_id === id).quantity + 1;
    try {
      const res = await API.patch(`/cart/${product_id}`, {
        quantity,
      });
      console.log(res.data);
      setP(p + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const dec = async (id) => {
    let product_id = id;
    let quantity = cart.find((c) => c.product_id === id).quantity - 1;
    try {
      const res = await API.patch(`/cart/${product_id}`, {
        quantity,
      });
      console.log(res.data);
      setP(p + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      <div>
        <div className="flex flex-col gap-4">
          {cart.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 bg-slate-400 text-center"
            >
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <p>${c.price}</p>
              <p>{c.quantity}</p>
              <button
                className="bg-red-400"
                onClick={() => {
                  inc(c.product_id);
                }}
              >
                +ADD
              </button>
              <button
                className="bg-yellow-400"
                onClick={() => dec(c.product_id)}
              >
                -Minus
              </button>
            </div>
          ))}
        </div>
        <div>
          <p>Checkout</p>

          <p>Total: ${totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
