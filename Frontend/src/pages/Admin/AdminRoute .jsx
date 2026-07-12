import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
