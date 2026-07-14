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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>

            <p className="text-gray-500 mt-2">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>

          <div
            className={`
            px-4
            py-2
            rounded-full
            text-sm
            font-semibold
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
          </div>
        </div>

        {/* Order Information */}

        <div
          className="
        bg-white
        rounded-xl
        border
        shadow-sm
        p-6
        mb-8
      "
        >
          <h2
            className="
          text-xl
          font-bold
          mb-5
        "
          >
            Order Information
          </h2>

          <div
            className="
          grid
          md:grid-cols-3
          gap-5
        "
          >
            <div>
              <p className="text-gray-500 text-sm">Payment Method</p>

              <p className="font-semibold mt-1">{order.payment_method}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Payment Status</p>

              <p
                className="
              font-semibold
              mt-1
            "
              >
                {order.payment_status}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Order Status</p>

              <p
                className="
              font-semibold
              mt-1
            "
              >
                {order.order_status}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}

        <div
          className="
        bg-white
        rounded-xl
        border
        shadow-sm
        p-6
      "
        >
          <h2
            className="
          text-xl
          font-bold
          mb-5
        "
          >
            Items
          </h2>

          <div className="space-y-5">
            {order.items.map((item) => (
              <div
                key={item.product_id}
                className="
              flex
              items-center
              justify-between
              border-b
              pb-5
              last:border-none
            "
              >
                <div
                  className="
              flex
              items-center
              gap-5
            "
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="
                  w-24
                  h-24
                  rounded-xl
                  object-cover
                "
                  />

                  <div>
                    <h3
                      className="
                  font-semibold
                  text-lg
                "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                  text-gray-500
                  text-sm
                  mt-1
                "
                    >
                      Quantity: {item.quantity}
                    </p>

                    <p
                      className="
                  text-gray-500
                  text-sm
                "
                    >
                      Price: {item.price_at_purchase} ETB
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className="
                font-bold
                text-lg
              "
                  >
                    {(item.quantity * item.price_at_purchase).toFixed(2)} ETB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}

          <div
            className="
          mt-8
          border-t
          pt-5
          flex
          justify-between
          items-center
        "
          >
            <span
              className="
            text-lg
            font-semibold
          "
            >
              Total
            </span>

            <span
              className="
            text-2xl
            font-bold
          "
            >
              {order.total_price} ETB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
