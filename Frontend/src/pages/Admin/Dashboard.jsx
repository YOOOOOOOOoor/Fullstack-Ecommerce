const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Products</h2>

          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Orders</h2>

          <p className="text-3xl mt-3">0</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold">Revenue</h2>

          <p className="text-3xl mt-3">$0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
