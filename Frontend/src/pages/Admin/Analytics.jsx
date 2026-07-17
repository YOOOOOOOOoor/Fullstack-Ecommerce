import { useEffect, useState } from "react";
import API from "../../../API/api.js";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

const Analytics = () => {
  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#9333ea",
    "#0891b2",
  ];
  const [range, setRange] = useState("30");

  const [analytics, setAnalytics] = useState({
    revenue: 0,
    orders: 0,
    averageOrder: 0,
    customers: 0,
    revenueByCategory: [],
    ordersFrequency: [],
    revenueTrend: [],
    bestSellingProducts: [],
  });

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(`/trueanalytics?range=${range}`);

      const data = res.data;

      setAnalytics({
        ...data,

        revenueByCategory: data.revenueByCategory.map((item) => ({
          ...item,
          revenue: Number(item.revenue),
        })),

        revenueTrend: data.revenueTrend.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          revenue: Number(item.revenue),
        })),

        ordersFrequency: data.ordersFrequency.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          orders: Number(item.orders),
        })),

        bestSellingProducts: data.bestSellingProducts.map((item) => ({
          ...item,
          sold: Number(item.sold),
          revenue: Number(item.revenue),
        })),
      });
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  return (
    <div
      className="
      p-6
      space-y-8
    "
    >
      {/* HEADER */}

      <div
        className="
        flex
        justify-between
        items-center
      "
      >
        <div>
          <h1
            className="
            text-3xl
            font-bold
          "
          >
            Analytics
          </h1>

          <p
            className="
            text-gray-500
          "
          >
            Detailed store performance
          </p>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="
            border
            rounded-lg
            px-4
            py-2
            bg-white
          "
        >
          <option value="7">Last 7 Days</option>

          <option value="30">Last 30 Days</option>

          <option value="90">Last 90 Days</option>

          <option value="all">All Time</option>
        </select>
      </div>

      {/* SUMMARY CARDS */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-5
      "
      >
        <Card
          title="Revenue"
          value={`ETB ${analytics.revenue.toLocaleString()}`}
        />

        <Card title="Orders" value={analytics.orders} />

        <Card
          title="Average Order"
          value={`ETB ${analytics.averageOrder.toFixed(2)}`}
        />

        <Card title="Customers with Orders" value={analytics.customers} />
      </div>

      {/* CHARTS ROW */}

      <div
        className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      "
      >
        {/* CATEGORY PIE */}

        {/* CATEGORY DONUT */}

        <div className="chart-card">
          <h2 className="chart-title">Sales By Category</h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={analytics.revenueByCategory}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                paddingAngle={4}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {analytics.revenueByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `ETB ${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ORDERS BAR */}

        <div className="chart-card">
          <h2 className="chart-title">Orders Frequency</h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analytics.ordersFrequency}>
              <CartesianGrid />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* REVENUE TREND */}

      <div className="chart-card">
        <h2 className="chart-title">Revenue Trend</h2>

        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analytics.revenueTrend}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />

                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `ETB ${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* BEST SELLING PRODUCTS */}

      <div
        className="
        bg-white
        rounded-xl
        shadow
        border
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
          Best Selling Products
        </h2>

        <div
          className="
          overflow-x-auto
        "
        >
          <table
            className="
            w-full
          "
          >
            <thead>
              <tr
                className="
                border-b
              "
              >
                <th className="text-left p-3">Rank</th>

                <th className="text-left p-3">Product</th>

                <th className="text-left p-3">Sold</th>

                <th className="text-left p-3">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {analytics.bestSellingProducts.map((product, index) => (
                <tr
                  key={product.id}
                  className="
                        border-b
                      "
                >
                  <td className="p-3">#{index + 1}</td>

                  <td className="p-3">
                    <div className="flex items-center">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <p className="px-3">{product.title}</p>
                    </div>
                  </td>

                  <td className="px-3">{product.sold} sold</td>

                  <td className="p-3">
                    ETB {Number(product.revenue).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => {
  return (
    <div
      className="
      bg-white
      rounded-xl
      shadow
      border
      p-5
    "
    >
      <p
        className="
        text-gray-500
      "
      >
        {title}
      </p>

      <h2
        className="
        text-2xl
        font-bold
        mt-2
      "
      >
        {value}
      </h2>
    </div>
  );
};

export default Analytics;
