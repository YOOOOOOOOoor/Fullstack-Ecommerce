import API from "../../../API/api.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
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

  const remove = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      setP(p + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

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
      setP((prev) => prev + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.length === 0 ? (
            <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
              <div className="text-6xl mb-5">🛒</div>

              <h2 className="text-2xl font-bold">Your cart is empty</h2>

              <p className="text-gray-500 mt-2">
                Looks like you haven't added anything yet.
              </p>

              <button
                className="
                mt-6
                bg-indigo-600
                hover:bg-indigo-700
                transition
                text-white
                px-8
                py-3
                rounded-xl
                font-semibold
              "
                onClick={() => navigate("/products")}
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((c) => (
              <div
                key={c.id}
                className="
                bg-white
                rounded-2xl
                border
                shadow-sm
                p-5
                flex
                gap-5
                hover:shadow-md
                transition
              "
              >
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="
                  w-32
                  h-32
                  rounded-xl
                  object-cover
                "
                />

                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">{c.title}</h2>

                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                        {c.description}
                      </p>

                      <p className="text-green-600 text-sm mt-3 font-medium">
                        {c.stock} available
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">${c.price}</p>

                      <button
                        onClick={() => remove(c.product_id)}
                        className="
                        text-red-500
                        text-sm
                        mt-3
                        hover:text-red-700
                      "
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <span className="text-gray-500">Quantity</span>

                    <div
                      className="
                      flex
                      items-center
                      gap-4
                      border
                      rounded-full
                      px-3
                      py-1
                    "
                    >
                      <button
                        onClick={() => dec(c.product_id)}
                        className="
                        w-8
                        h-8
                        rounded-full
                        hover:bg-gray-100
                        text-lg
                      "
                      >
                        -
                      </button>

                      <span className="font-semibold">{c.quantity}</span>

                      <button
                        disabled={c.quantity >= c.stock}
                        onClick={() => inc(c.product_id)}
                        className="
                        w-8
                        h-8
                        rounded-full
                        hover:bg-gray-100
                        disabled:opacity-40
                        text-lg
                      "
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div
          className="
          bg-white
          rounded-2xl
          border
          shadow-sm
          p-7
          h-fit
          sticky
          top-24
        "
        >
          <h2 className="text-2xl font-bold mb-7">Order Summary</h2>

          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-medium text-gray-900">{cart.length}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>${totalAmount}</span>
          </div>

          <button
            className="
            w-full
            mt-7
            bg-indigo-600
            hover:bg-indigo-700
            transition
            text-white
            py-3
            rounded-xl
            font-semibold
          "
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
