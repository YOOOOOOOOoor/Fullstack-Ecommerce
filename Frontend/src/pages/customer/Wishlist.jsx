import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/api.js";

const Wishlist = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const addCarts = async (id, quantity) => {
    let product_id = id;
    if (quantity == null) {
      quantity = 1;
    }
    try {
      const res = await API.post("/cart", {
        product_id,
        quantity,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const remove = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);

      fetchOrders();
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/wishlist/");
      setOrders(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };
  useEffect(() => {
    console.log(fetchOrders());
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ❤️</h1>

        {orders.length === 0 ? (
          <div
            className="
          bg-white
          rounded-xl
          border
          shadow-sm
          p-10
          text-center
        "
          >
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>

            <p className="text-gray-500 mt-2">
              Save products you love and find them here later.
            </p>
          </div>
        ) : (
          <div
            className="
          grid
          sm:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="
              bg-white
              rounded-xl
              border
              shadow-sm
              overflow-hidden
              hover:shadow-lg
              transition
              "
              >
                {/* Image */}

                <div
                  onClick={() => navigate(`/products/${order.product_id}`)}
                  className="cursor-pointer"
                >
                  <img
                    src={order.image_url}
                    alt={order.title}
                    className="
                    w-full
                    h-56
                    object-cover
                  "
                  />
                </div>

                {/* Details */}

                <div className="p-5">
                  <h2
                    className="
                  text-xl
                  font-semibold
                  truncate
                "
                  >
                    {order.title}
                  </h2>

                  <p
                    className="
                  text-gray-500
                  text-sm
                  mt-2
                  line-clamp-2
                "
                  >
                    {order.description}
                  </p>

                  <div
                    className="
                  flex
                  justify-between
                  items-center
                  mt-4
                "
                  >
                    <p
                      className="
                    text-xl
                    font-bold
                  "
                    >
                      {order.price} ETB
                    </p>

                    <p
                      className="
                    text-sm
                    text-green-600
                  "
                    >
                      {order.stock} left
                    </p>
                  </div>

                  <div
                    className="
                  flex
                  gap-3
                  mt-5
                "
                  >
                    <button
                      className="
                      flex-1
                      bg-indigo-600
                      hover:bg-indigo-700
                      text-white
                      py-2
                      rounded-lg
                      font-medium
                    "
                      onClick={() => addCarts(order.product_id)}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="
                      border
                      px-4
                      rounded-lg
                      hover:bg-gray-100
                    "
                      onClick={() => navigate(`/products/${order.product_id}`)}
                    >
                      View
                    </button>

                    <button
                      className="border px-4 rounded-lg hover:bg-gray-100  text-red-500 bg-red-100"
                      onClick={() => remove(order.id)}
                    >
                      Remove{" "}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
