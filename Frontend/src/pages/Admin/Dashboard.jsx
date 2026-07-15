import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/api.js";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState({});
  const [chart, setChart] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, revenueRes, chartRes, stockRes, ordersRes] =
          await Promise.all([
            API.get("/admin/analytics/stats"),
            API.get("/admin/analytics/revenue"),
            API.get("/admin/analytics/revenue-chart"),
            API.get("/admin/analytics/low-stock"),
            API.get("/admin/analytics/recent-orders"),
          ]);

        setStats(statsRes.data);
        setRevenue(revenueRes.data);
        setChart(chartRes.data);
        setLowStock(stockRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-muted-foreground">
            Welcome back, here's what's happening today.
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Products</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{stats.total_products || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Customers</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{stats.total_customers || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Orders</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{stats.total_orders || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Revenue Today</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {Number(revenue.today || 0).toLocaleString()} ETB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Low Stock</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-orange-500">
              {stats.low_stock_products || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Out of Stock</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {stats.out_of_stock_products || 0}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Revenue Chart + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    `${Number(value).toLocaleString()} ETB`,
                    "Revenue",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 flex flex-col items-center justify-center text-center ">
            <Button
              className="w-50 h-8 text-xs flex items-center justify-center "
              onClick={() => navigate("/admin/products/add")}
            >
              + Add Product
            </Button>

            <Button
              variant="outline"
              className="w-50 h-8 text-xs flex items-center justify-center"
              onClick={() => navigate("/admin/categories")}
            >
              + Add Category
            </Button>

            <Button
              variant="outline"
              className="w-50 h-8 text-xs flex items-center justify-center"
              onClick={() => navigate("/admin/orders")}
            >
              View Orders
            </Button>

            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-2">Revenue Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>This Week</span>
                  <span className="font-medium">
                    {Number(revenue.this_week || 0).toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>This Month</span>
                  <span className="font-medium">
                    {Number(revenue.this_month || 0).toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>This Year</span>
                  <span className="font-medium">
                    {Number(revenue.this_year || 0).toLocaleString()} ETB
                  </span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>

                  <span>
                    {Number(revenue.total_revenue || 0).toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>{" "}
      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Products</CardTitle>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/products")}
            >
              View All
            </Button>
          </CardHeader>

          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                All products have healthy stock 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    p-3
                    cursor-pointer
                    transition-colors
                    hover:bg-muted
                    "
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="
                        w-12
                        h-12
                        rounded-md
                        object-cover
                        "
                      />

                      <div>
                        <p className="font-medium">{product.title}</p>

                        <p className="text-sm text-muted-foreground">
                          {Number(product.price).toLocaleString()} ETB
                        </p>
                      </div>
                    </div>

                    <span className="font-semibold text-red-500">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/orders")}
            >
              View All
            </Button>
          </CardHeader>

          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent orders.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="
                    flex
                    items-center
                    justify-between
                    border-b
                    pb-3
                    "
                  >
                    <div>
                      <p className="font-medium">{order.name}</p>

                      <p className="text-sm text-muted-foreground">
                        #{order.id}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {Number(order.total_price).toLocaleString()} ETB
                      </p>

                      <p
                        className={`
                        text-sm
                        ${
                          order.order_status === "delivered"
                            ? "text-green-600"
                            : order.order_status === "cancelled"
                              ? "text-red-600"
                              : "text-orange-500"
                        }
                        `}
                      >
                        {order.order_status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
