import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/api.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/");
        setOrders(res.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1
          className="
        text-3xl
        font-bold
        mb-8
      "
        >
          My Orders
        </h1>

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
            <h2
              className="
            text-2xl
            font-semibold
          "
            >
              No orders yet
            </h2>

            <p
              className="
            text-gray-500
            mt-2
          "
            >
              Your purchased products will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/order/${order.id}`)}
                className="
                bg-white
                rounded-xl
                border
                shadow-sm
                p-6
                cursor-pointer
                hover:shadow-md
                transition
              "
              >
                <div
                  className="
                flex
                items-center
                justify-between
              "
                >
                  {/* Left side */}

                  <div
                    className="
                  flex
                  items-center
                  gap-5
                "
                  >
                    <img
                      src={order.image_url}
                      alt={order.display_title}
                      className="
                      w-20
                      h-20
                      rounded-xl
                      object-cover
                    "
                    />

                    <div>
                      <h2
                        className="
                      font-semibold
                      text-lg
                    "
                      >
                        {order.display_title}
                      </h2>

                      <p
                        className="
                      text-sm
                      text-gray-500
                      mt-1
                    "
                      >
                        Order #{order.id}
                      </p>

                      <p
                        className="
                      text-sm
                      text-gray-500
                    "
                      >
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right side */}

                  <div className="text-right">
                    <p
                      className="
                    text-xl
                    font-bold
                  "
                    >
                      {order.total_price} ETB
                    </p>

                    <span
                      className={`
                      inline-block
                      mt-2
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-medium

                      ${
                        order.order_status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.order_status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>

                <div
                  className="
                mt-5
                border-t
                pt-4
                text-right
              "
                >
                  <button
                    className="
                    text-indigo-600
                    font-medium
                    hover:underline
                  "
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
