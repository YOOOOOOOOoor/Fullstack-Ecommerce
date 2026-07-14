import API from "../../../API/api.js";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cartAmount, setCartAmount] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    address: "",
    email: "",
    number: "",
  });

  // const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await API.post("/checkout/chapa");

      window.location.href = res.data.data.checkout_url;
    } catch (error) {
      console.log(error.response?.data);

      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const carts = await API.get("/checkout/cart");
        const tot = await API.get("/checkout/total");
        const userInfo = await API.get("/checkout/info");

        setUser(userInfo.data);
        setTotalAmount(tot.data.total);
        setCartAmount(carts.data);
        console.log(carts.data);
        console.log(tot.data.total);
        console.log(userInfo.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    fetchCarts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div
        className="
      max-w-7xl
      mx-auto
      grid
      lg:grid-cols-3
      gap-8
    "
      >
        {/* Checkout Form */}

        <div
          className="
        lg:col-span-2
        bg-white
        border
        rounded-2xl
        shadow-sm
        p-8
      "
        >
          <h1
            className="
          text-3xl
          font-bold
          mb-8
        "
          >
            Checkout
          </h1>

          {/* Customer Info */}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium">Full Name</label>

              <input
                type="text"
                placeholder="Your name"
                value={user.name}
                className="
                mt-2
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>

              <input
                type="text"
                placeholder="Delivery address"
                value={user.address}
                onChange={(e) =>
                  setUser({
                    ...user,
                    address: e.target.value,
                  })
                }
                className="
                mt-2
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>

              <input
                type="email"
                placeholder="Email address"
                value={user.email}
                className="
                mt-2
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>

              <input
                type="text"
                placeholder="Phone number"
                value={user.number}
                onChange={(e) =>
                  setUser({
                    ...user,
                    number: e.target.value,
                  })
                }
                className="
                mt-2
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              />
            </div>
          </div>

          {/* Payment */}

          <div className="mt-8">
            <h2
              className="
            text-xl
            font-semibold
            mb-4
          "
            >
              Payment Method
            </h2>

            <div className="flex gap-4">
              <button
                className="
                border
                border-indigo-600
                bg-indigo-600
                text-white
                px-6
                py-3
                rounded-lg
                font-medium
              "
              >
                Chapa
              </button>

              <button
                disabled
                className="
                border
                text-gray-400
                px-6
                py-3
                rounded-lg
                cursor-not-allowed
                opacity-50
              "
              >
                Pay on delivery
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}

        <div
          className="
        bg-white
        border
        rounded-2xl
        shadow-sm
        p-6
        h-fit
        sticky
        top-24
      "
        >
          <h2
            className="
          text-2xl
          font-bold
          mb-6
        "
          >
            Order Summary
          </h2>

          <div
            className="
          space-y-4
          max-h-[400px]
          overflow-y-auto
        "
          >
            {cartAmount.map((c) => (
              <div
                key={c.id}
                className="
              flex
              gap-4
              border-b
              pb-4
            "
              >
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="
                w-16
                h-16
                rounded-lg
                object-cover
              "
                />

                <div className="flex-1">
                  <p className="font-semibold">{c.title}</p>

                  <p
                    className="
                text-sm
                text-gray-500
              "
                  >
                    {c.quantity} × ${c.price}
                  </p>
                </div>

                <p className="font-semibold">
                  ${(c.quantity * Number(c.price)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>${totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>

              <span
                className="
              text-green-600
              font-semibold
            "
              >
                FREE
              </span>
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
            disabled={loading}
            onClick={handlePayment}
            className="
            w-full
            mt-6
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-lg
            font-semibold
            disabled:opacity-50
          "
          >
            {loading ? "Redirecting..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
