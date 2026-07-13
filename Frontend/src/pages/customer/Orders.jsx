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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/order/${order.id}`)}
            className="
              flex items-center justify-between
              border rounded-lg p-4
              cursor-pointer
              hover:bg-gray-100
            "
          >
            {/* Product image */}
            <div className="flex items-center gap-4">
              <img
                src={order.image_url}
                alt={order.title}
                className="w-16 h-16 rounded object-cover"
              />

              <div>
                <h2 className="font-semibold">{order.display_title}</h2>

                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold">{order.total_price} ETB</p>

              <p className="text-sm">{order.order_status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
