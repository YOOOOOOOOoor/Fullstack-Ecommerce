import { useEffect, useState } from "react";
import API from "../../API/api.js";
import { useNavigate } from "react-router-dom";

const Login = ({ user, setUser }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!form.email || !form.password) {
        setError("Please fill in all fields");
        return;
      }

      setLoading(true);

      const res = await API.post("/auth/login", form);

      setUser(res.data.user);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    min-h-screen
    bg-gray-50
    flex
    items-center
    justify-center
    px-6
  "
    >
      <div
        className="
      w-full
      max-w-md
      bg-white
      rounded-2xl
      shadow-lg
      border
      p-8
    "
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="
      flex
      items-center
      gap-2
      text-gray-600
      hover:text-indigo-600
      mb-6
      transition
    "
        >
          ← Go back
        </button>
        <div className="text-center mb-8">
          <h1
            className="
          text-3xl
          font-bold
        "
          >
            Welcome Back
          </h1>
        </div>

        {error && (
          <div
            className="
          bg-red-100
          text-red-700
          px-4
          py-3
          rounded-lg
          mb-5
          text-sm
        "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="
            text-sm
            font-medium
          "
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="
              mt-2
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            />
          </div>

          <div>
            <label
              className="
            text-sm
            font-medium
          "
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              className="
              mt-2
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            bg-indigo-600
            hover:bg-indigo-700
            text-white
            py-3
            rounded-lg
            font-semibold
            transition
            disabled:opacity-50
          "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className="
        text-center
        text-sm
        text-gray-500
        mt-6
      "
        >
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="
            text-indigo-600
            font-medium
            cursor-pointer
            ml-1
          "
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
