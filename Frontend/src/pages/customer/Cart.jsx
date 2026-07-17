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
      await API.patch(`/cart/${product_id}`, {
        quantity,
      });

      setP(p + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const dec = async (id) => {
    let product_id = id;
    let quantity = cart.find((c) => c.product_id === id).quantity - 1;
    try {
      await API.patch(`/cart/${product_id}`, {
        quantity,
      });

      setP((prev) => prev + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div
      className="
    min-h-screen
    bg-background
    px-4
    sm:px-6
    py-8
    sm:py-12
    "
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-10">
          <h1
            className="
          text-3xl
          sm:text-4xl
          font-bold
          "
          >
            Shopping Cart
          </h1>

          <p className="text-muted-foreground mt-2">
            Review your items before completing your purchase.
          </p>
        </div>

        <div
          className="
        grid
        lg:grid-cols-3
        gap-8
        "
        >
          {/* Cart Items */}

          <div
            className="
          lg:col-span-2
          space-y-5
          "
          >
            {cart.length === 0 ? (
              <div
                className="
              bg-card
              rounded-3xl
              border
              p-12
              text-center
              shadow-sm
              "
              >
                <div className="text-6xl mb-5">🛒</div>

                <h2 className="text-2xl font-bold">Your cart is empty</h2>

                <p className="text-muted-foreground mt-3">
                  Looks like you haven't added anything yet.
                </p>

                <button
                  onClick={() => navigate("/products")}
                  className="
                mt-7
                bg-primary
                text-primary-foreground
                px-8
                py-3
                rounded-xl
                font-semibold
                hover:opacity-90
                transition
                "
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cart.map((c) => (
                <div
                  key={c.id}
                  className="
                bg-card
                rounded-3xl
                border
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
                  rounded-2xl
                  object-cover
                  "
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold">{c.title}</h2>

                        <p
                          className="
                        text-sm
                        text-muted-foreground
                        mt-2
                        line-clamp-2
                        "
                        >
                          {c.description}
                        </p>

                        <p
                          className="
                        text-emerald-600
                        text-sm
                        mt-3
                        font-medium
                        "
                        >
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
                        hover:text-red-600
                        transition
                        "
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div
                      className="
                    flex
                    items-center
                    justify-between
                    mt-6
                    "
                    >
                      <span className="text-muted-foreground">Quantity</span>

                      <div
                        className="
                      flex
                      items-center
                      gap-4
                      bg-secondary
                      rounded-full
                      px-4
                      py-2
                      "
                      >
                        <button
                          onClick={() => dec(c.product_id)}
                          className="
                        w-8
                        h-8
                        rounded-full
                        hover:bg-card
                        transition
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
                        hover:bg-card
                        transition
                        disabled:opacity-40
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

          {/* Summary */}

          <div
            className="
          bg-card
          rounded-3xl
          border
          shadow-sm
          p-7
          h-fit
          sticky
          top-24
          "
          >
            <h2 className="text-2xl font-bold mb-7">Order Summary</h2>

            <div className="space-y-5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>

                <span className="font-medium">{cart.length}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>

                <span className="text-emerald-600 font-medium">Free</span>
              </div>

              <hr />

              <div
                className="
              flex
              justify-between
              text-xl
              font-bold
              "
              >
                <span>Total</span>

                <span>${totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="
            w-full
            mt-7
            bg-primary
            text-primary-foreground
            py-3
            rounded-xl
            font-semibold
            hover:opacity-90
            transition
            "
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
