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
    phone: "",
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
    <div className="flex justify-around">
      <div className="flex flex-col">
        <div>
          <p>Checkout</p>
        </div>
        <div>
          <form className="flex flex-col">
            <input
              type="text"
              name=""
              id=""
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
            <input
              type="text"
              name=""
              id=""
              placeholder="Address"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
            />
            <input
              type="email"
              name=""
              id=""
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="text"
              name=""
              id=""
              placeholder="Phone NUmber"
              value={user.number}
              onChange={(e) => setUser({ ...user, number: e.target.value })}
            />
          </form>
        </div>
        <div>
          <p>Payment Method</p>
          <div className="flex gap-4">
            <button className="border border-indigo-600 bg-indigo-600 text-white px-4 py-2 rounded font-medium cursor-pointer">
              Chapa
            </button>
            <button
              disabled
              className="border border-gray-300 text-gray-400 px-4 py-2 rounded font-medium cursor-not-allowed opacity-50 bg-gray-50"
            >
              Pay on delivery
            </button>
          </div>
        </div>
      </div>
      <div>
        <p>Order summary</p>
        <div className="flex flex-col gap-5">
          {cartAmount.map((c) => (
            <div
              key={c.id}
              className="flex gap-3 border border-indigo-600 rounded px-4 py-2"
            >
              <div>
                <img src={c.image_url} alt="" className=" w-8 h-8 rounded" />
              </div>
              <div>
                <p>{c.title}</p>
                <p className="text-[11px] text-gray-500">
                  Qty: {c.quantity} X ${c.price}
                </p>
              </div>
              <div>${c.quantity * c.price}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{totalAmount}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p className="text-green-800 font-semibold">FREE</p>
          </div>
        </div>
        <div className="flex justify-between">
          <p>Total</p>
          <p className="font-bold">{totalAmount}</p>
        </div>
        <button
          disabled={loading}
          onClick={handlePayment}
          className="border border-indigo-600 bg-cyan-600 text-white px-4 py-2 rounded font-medium"
        >
          {loading ? "Redirecting..." : "Place order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
