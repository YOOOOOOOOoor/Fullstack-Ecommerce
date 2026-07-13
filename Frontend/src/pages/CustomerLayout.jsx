import { Outlet } from "react-router-dom";
import Navi from "../components/Navi";

export default function CustomerLayout({ user, setUser }) {
  return (
    <>
      <Navi user={user} setUser={setUser} />
      <Outlet />
    </>
  );
}
