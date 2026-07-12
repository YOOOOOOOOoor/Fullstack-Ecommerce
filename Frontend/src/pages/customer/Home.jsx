import { Link } from "react-router-dom";

const Home = ({ user }) => {
  return (
    <div>
      {user ? (
        <p>
          Welcome {user.name} Your are {user.role}
        </p>
      ) : (
        <h1>
          Welcome New user{" "}
          <Link to="/login" className="text-red-600">
            Login
          </Link>{" "}
        </h1>
      )}
    </div>
  );
};

export default Home;
