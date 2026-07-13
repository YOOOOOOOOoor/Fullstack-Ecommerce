import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../API/api.js";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (error) {
        console.log(error.response?.data);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Order #{order.id}</h1>

      {/* Order info */}
      <div className="border rounded p-4 mb-5">
        <p>
          Payment:
          <span className="font-semibold ml-2">{order.payment_method}</span>
        </p>

        <p>
          Payment status:
          <span className="font-semibold ml-2">{order.payment_status}</span>
        </p>

        <p>
          Order status:
          <span className="font-semibold ml-2">{order.order_status}</span>
        </p>

        <p>
          Date:
          <span className="font-semibold ml-2">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </p>
      </div>

      {/* Products */}
      <h2 className="text-xl font-bold mb-3">Items</h2>

      <div className="flex flex-col gap-4">
        {order.items.map((item) => (
          <div
            key={item.product_id}
            className="
            flex items-center justify-between
            border rounded p-4
            "
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.image_url}
                alt={item.title}
                className="
                w-20 h-20 rounded object-cover
                "
              />

              <div>
                <h3 className="font-semibold">{item.title}</h3>

                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>

            <div>
              <p>{item.price_at_purchase} ETB</p>

              <p className="font-bold">
                {item.quantity * item.price_at_purchase} ETB
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-5 text-right">
        <p className="text-xl font-bold">Total: {order.total_price} ETB</p>
      </div>
    </div>
  );
};

export default OrderDetails;
