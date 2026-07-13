import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../API/api";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminOrderDetail = () => {
  const { id } = useParams();

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

  if (!order) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Order #{order.id}</h1>

      {/* Order Information */}
      <div className="border rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold">Order Information</h2>

        <div className="space-y-2">
          <p className="font-semibold">Order Status</p>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-60">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="awaiting_payment">Awaiting Payment</SelectItem>

              <SelectItem value="processing">Processing</SelectItem>

              <SelectItem value="shipped">shipped</SelectItem>

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

        <p>
          <strong>Payment Status:</strong> {order.payment_status}
        </p>

        <p>
          <strong>Payment Method:</strong> {order.payment_method}
        </p>

        <p>
          <strong>Total:</strong> ${order.total_price}
        </p>

        <p>
          <strong>Created:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {/* Customer Information */}
      <div className="border rounded-lg p-6 space-y-3">
        <h2 className="text-xl font-semibold">Customer</h2>

        <p>
          <strong>Name:</strong> {order.name}
        </p>

        <p>
          <strong>Email:</strong> {order.email}
        </p>
      </div>

      {/* Ordered Products */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Products</h2>

        <div className="space-y-5">
          {order.items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-5 border-b pb-5"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-24 h-24 rounded object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>

                <p>Quantity: {item.quantity}</p>

                <p>Price: ${item.price_at_purchase}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
