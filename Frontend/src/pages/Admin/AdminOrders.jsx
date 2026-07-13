import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import API from "../../../API/api.js";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

const AdminOrders = () => {
  const [form, setForm] = useState({
    search: "",
    order_status: "",
    payment_status: "",
  });
  console.log("Form", form);

  const statusVal = [
    "awaiting_payment",
    "processing",
    "delivered",
    "cancelled",
  ];
  const paymentVal = ["pending", "successful", "failed", "refunded"];

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("orders/admin/orders", {
          params: {
            ...form,
            page,
            limit: 2,
          },
        });

        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [page, form]);

  return (
    <div className="flex flex-col items-center justify-center w-full bg-gray-100 p-5">
      {/* Top Filters */}
      <div className="flex w-[90%] gap-5 mb-5">
        {/* Search */}
        <div className="w-[50%]">
          <Field className="w-full">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>

              <InputGroupInput
                placeholder="Search order, customer, product..."
                value={form.search}
                onChange={(e) =>
                  setForm({
                    ...form,
                    search: e.target.value,
                  })
                }
              />
            </InputGroup>
          </Field>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Order Status */}
          <Select
            value={form.order_status}
            onValueChange={(value) =>
              setForm({
                ...form,
                order_status: value,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>

              {statusVal.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Payment Status */}
          <Select
            value={form.payment_status}
            onValueChange={(value) =>
              setForm({
                ...form,
                payment_status: value,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>

              {paymentVal.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-[90%] rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>

              <TableHead>Product</TableHead>

              <TableHead>Total</TableHead>

              <TableHead>Payment</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Date</TableHead>

              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                {/* Customer */}
                <TableCell>
                  <div>
                    <p className="font-medium">{order.name}</p>

                    <p className="text-sm text-gray-500">{order.email}</p>
                  </div>
                </TableCell>

                {/* Product */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={order.image_url}
                      alt={order.title}
                      className="w-12 h-10 rounded object-cover"
                    />

                    <div>
                      <p>{order.display_title}</p>

                      <p className="text-xs text-gray-500">
                        {order.item_count} item(s)
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Total */}
                <TableCell>${order.total_price}</TableCell>

                {/* Payment */}
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                    {order.payment_status}
                  </span>
                </TableCell>

                {/* Order Status */}
                <TableCell>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                    {order.order_status}
                  </span>
                </TableCell>

                {/* Date */}
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString("en-GB")}
                </TableCell>

                {/* Action */}
                <TableCell>
                  <Button onClick={() => navigate(`/admin/orders/${order.id}`)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                isActive={page === index + 1}
                onClick={(e) => {
                  e.preventDefault();

                  setPage(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AdminOrders;
