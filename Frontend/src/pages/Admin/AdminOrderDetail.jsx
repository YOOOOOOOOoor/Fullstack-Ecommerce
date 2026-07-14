import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../API/api";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Package,
  User,
  CreditCard,
  CalendarDays,
} from "lucide-react";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/admin/orders/${id}`);

        setOrder(res.data);
        setStatus(res.data.order_status);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    try {
      setLoading(true);

      await API.patch(`/orders/admin/orders/${id}`, {
        order_status: status,
      });

      setOrder((prev) => ({
        ...prev,

        order_status: status,
      }));

      alert("Order updated successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (value) => {
    switch (value) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const paymentColor = (value) => {
    switch (value) {
      case "successful":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!order) {
    return (
      <div className="p-10 text-center text-gray-500">Loading order...</div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-gray-100
      p-8
    "
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id}</h1>

            <p className="text-gray-500 mt-1">
              Manage order details and delivery status
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>

        {/* Top Summary */}

        <div
          className="
          grid
          md:grid-cols-4
          gap-5
        "
        >
          <div
            className="
            bg-white
            rounded-xl
            border
            p-5
          "
          >
            <CreditCard className="mb-3" />

            <p className="text-gray-500 text-sm">Payment</p>

            <span
              className={`
              inline-block
              mt-2
              px-3
              py-1
              rounded-full
              text-sm
              ${paymentColor(order.payment_status)}
            `}
            >
              {order.payment_status}
            </span>
          </div>

          <div
            className="
            bg-white
            rounded-xl
            border
            p-5
          "
          >
            <Package className="mb-3" />

            <p className="text-gray-500 text-sm">Status</p>

            <span
              className={`
              inline-block
              mt-2
              px-3
              py-1
              rounded-full
              text-sm
              ${statusColor(order.order_status)}
            `}
            >
              {order.order_status}
            </span>
          </div>

          <div
            className="
            bg-white
            rounded-xl
            border
            p-5
          "
          >
            <p className="text-gray-500 text-sm">Total</p>

            <p className="text-2xl font-bold mt-2">${order.total_price}</p>
          </div>

          <div
            className="
            bg-white
            rounded-xl
            border
            p-5
          "
          >
            <CalendarDays className="mb-3" />

            <p className="text-gray-500 text-sm">Created</p>

            <p className="font-semibold mt-2">
              {new Date(order.created_at).toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>

        {/* Order Management */}

        <div
          className="
          bg-white
          rounded-xl
          border
          p-6
          space-y-5
        "
        >
          <h2 className="text-xl font-bold">Update Order</h2>

          <div
            className="
            flex
            flex-col
            md:flex-row
            gap-4
            items-center
          "
          >
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="awaiting_payment">
                  Awaiting Payment
                </SelectItem>

                <SelectItem value="processing">Processing</SelectItem>

                <SelectItem value="shipped">Shipped</SelectItem>

                <SelectItem value="delivered">Delivered</SelectItem>

                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={updateStatus}
              disabled={loading || status === order.order_status}
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>

        {/* Customer */}

        <div
          className="
          bg-white
          rounded-xl
          border
          p-6
        "
        >
          <div className="flex items-center gap-2 mb-5">
            <User />

            <h2 className="text-xl font-bold">Customer</h2>
          </div>

          <p>
            <strong>Name:</strong> {order.name}
          </p>

          <p>
            <strong>Email:</strong> {order.email}
          </p>
        </div>

        {/* Products */}

        <div
          className="
          bg-white
          rounded-xl
          border
          p-6
        "
        >
          <h2 className="text-xl font-bold mb-6">Ordered Products</h2>

          <div className="space-y-5">
            {order.items.map((item) => (
              <div
                key={item.product_id}
                className="
                  flex
                  items-center
                  gap-5
                  border
                  rounded-xl
                  p-4
                  hover:bg-gray-50
                "
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="
                    w-24
                    h-24
                    rounded-lg
                    object-cover
                  "
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>

                  <p className="text-gray-500">Quantity: {item.quantity}</p>

                  <p className="font-semibold mt-2">
                    ${item.price_at_purchase}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
