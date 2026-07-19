import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../API/api.js";
import {
  Package,
  Users,
  ShoppingBag,
  Wallet,
  AlertTriangle,
  XCircle,
  Plus,
  FolderPlus,
  Eye,
} from "lucide-react";

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

        // const chartData = [...chartRes.data];

        // if (chartData.length === 1) {
        //   const yesterday = new Date();
        //   yesterday.setDate(yesterday.getDate() - 1);

        //   const yesterdayLabel = yesterday.toLocaleDateString("en-US", {
        //     month: "short",
        //     day: "2-digit",
        //   });

        //   chartData.unshift({
        //     date: yesterdayLabel,
        //     revenue: 0,
        //   });
        // }

        // setChart(chartData);

        ////////////////////////////////
        setLowStock(stockRes.data);
        setRecentOrders(ordersRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-2">
          Welcome back, here's what's happening today.
        </p>
      </div>

      {/* Stats */}

      <div
        className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-6
      gap-5
      "
      >
        {[
          {
            title: "Products",
            value: stats.total_products || 0,
            icon: Package,
          },

          {
            title: "Customers",
            value: stats.total_customers || 0,
            icon: Users,
          },

          {
            title: "Orders",
            value: stats.total_orders || 0,
            icon: ShoppingBag,
          },

          {
            title: "Revenue Today",
            value: `${Number(revenue.today || 0).toLocaleString()} ETB`,
            icon: Wallet,
          },

          {
            title: "Low Stock",
            value: stats.low_stock_products || 0,
            icon: AlertTriangle,
          },

          {
            title: "Out Of Stock",
            value: stats.out_of_stock_products || 0,
            icon: XCircle,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="
            rounded-2xl
            hover:shadow-md
            transition
            "
            >
              <CardHeader
                className="
              flex
              flex-row
              items-center
              justify-between
              pb-2
              "
              >
                <CardTitle className="text-sm text-muted-foreground">
                  {item.title}
                </CardTitle>

                <Icon size={20} className="text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart + Actions */}

      <div
        className="
      grid
      lg:grid-cols-3
      gap-6
      "
      >
        {/* Revenue Chart */}

        <Card
          className="
        lg:col-span-2
        rounded-2xl
        "
        >
          <CardHeader>
            <CardTitle>Revenue (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent
            className="
          h-[350px]
          "
          >
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

        {/* Quick Actions */}

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button
              className="w-full gap-2"
              onClick={() => navigate("/admin/products/add")}
            >
              <Plus size={16} />
              Add Product
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate("/admin/categories")}
            >
              <FolderPlus size={16} />
              Add Category
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => navigate("/admin/orders")}
            >
              <Eye size={16} />
              View Orders
            </Button>

            <div className="pt-6 mt-6 border-t">
              <h3 className="font-semibold mb-4">Revenue Summary</h3>

              <div className="space-y-3 text-sm">
                {[
                  ["This Week", revenue.this_week],
                  ["This Month", revenue.this_month],
                  ["This Year", revenue.this_year],
                  ["Total", revenue.total_revenue],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className="
                    flex
                    justify-between
                    "
                  >
                    <span>{name}</span>

                    <span className="font-medium">
                      {Number(value || 0).toLocaleString()} ETB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}

      <div
        className="
      grid
      lg:grid-cols-2
      gap-6
      "
      >
        {/* Low Stock */}

        <Card className="rounded-2xl">
          <CardHeader
            className="
          flex
          flex-row
          justify-between
          items-center
          "
          >
            <CardTitle>Low Stock Products</CardTitle>

            <Button
              size="sm"
              variant="ghost"
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
              <div className="space-y-3">
                {lowStock.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/admin/products/${product.id}`)}
                    className="
                    flex
                    items-center
                    justify-between
                    border
                    rounded-xl
                    p-3
                    cursor-pointer
                    hover:bg-muted
                    transition
                    "
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={product.image_url}
                        className="
                        w-12
                        h-12
                        rounded-lg
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

                    <span className="text-red-500 font-semibold">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}

        <Card className="rounded-2xl">
          <CardHeader
            className="
          flex
          flex-row
          justify-between
          items-center
          "
          >
            <CardTitle>Recent Orders</CardTitle>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/admin/orders")}
            >
              View All
            </Button>
          </CardHeader>

          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent orders.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="
                  flex
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

                      <p className="text-sm text-muted-foreground">
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
