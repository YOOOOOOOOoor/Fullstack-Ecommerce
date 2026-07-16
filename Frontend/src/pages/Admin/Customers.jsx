import { useEffect, useState } from "react";
import API from "../../../API/api.js";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Customers = () => {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("all");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [updatingId, setUpdatingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/admin/customers", {
        params: {
          page,
          search,
          role,
        },
      });

      setUsers(res.data.users);

      setTotalPages(res.data.pages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = () => {
    setPage(1);

    fetchUsers();
  };

  // =========================
  // UPDATE ROLE
  // =========================

  const updateRole = async (id, role) => {
    try {
      setUpdatingId(id);

      await API.put(`/admin/customers/${id}/role`, {
        role,
      });

      toast.success("User role updated successfully.");

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (id) => {
    try {
      setDeletingId(id);

      await API.delete(`/admin/customers/${id}`);

      toast.success("User deleted successfully.");

      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="
    p-6
    space-y-8
    bg-background
    "
    >
      {/* HEADER */}

      <div
        className="
      flex
      flex-col
      md:flex-row
      md:justify-between
      md:items-center
      gap-4
      "
      >
        <div>
          <h1
            className="
          text-3xl
          font-bold
          text-foreground
          "
          >
            Customers
          </h1>

          <p className="text-muted-foreground">
            Manage customer accounts and permissions
          </p>
        </div>

        <div
          className="
        flex
        flex-col
        sm:flex-row
        gap-3
        "
        >
          <input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="
          border
          border-border
          bg-background
          text-foreground
          placeholder:text-muted-foreground
          rounded-lg
          px-4
          py-2
          w-full
          sm:w-64
          "
          />

          <Select
            value={role}
            onValueChange={(value) => {
              setRole(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>

              <SelectItem value="customer">Customers</SelectItem>

              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* CUSTOMER GRID */}

      <div
        className="
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-6
      "
      >
        {loading ? (
          <p className="text-muted-foreground">Loading customers...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No customers found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="
            bg-background
            border
            border-border
            rounded-2xl
            shadow-sm
            p-5
            space-y-4
            "
            >
              {/* PROFILE */}

              <div
                className="
              flex
              items-center
              gap-4
              "
              >
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt={user.name}
                  className="
                w-16
                h-16
                rounded-full
                object-cover
                border
                border-border
                "
                />

                <div>
                  <h2
                    className="
                  font-semibold
                  text-lg
                  text-foreground
                  "
                  >
                    {user.name}
                  </h2>

                  <span
                    className={`
                  inline-block
                  mt-1
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  ${
                    user.role === "admin"
                      ? `
                      bg-purple-100
                      dark:bg-purple-950
                      text-purple-700
                      dark:text-purple-300
                      `
                      : `
                      bg-muted
                      text-muted-foreground
                      `
                  }
                  `}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              {/* INFORMATION */}

              <div
                className="
              space-y-2
              text-sm
              "
              >
                <div>
                  <p className="text-muted-foreground">Email</p>

                  <p
                    className="
                  font-medium
                  text-foreground
                  truncate
                  "
                  >
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Phone</p>

                  <p className="font-medium text-foreground">
                    {user.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Joined</p>

                  <p className="font-medium text-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div
                className="
              flex
              flex-col
              gap-3
              pt-3
              border-t
              border-border
              "
              >
                <Select
                  value={user.role}
                  disabled={updatingId === user.id}
                  onValueChange={(value) => updateRole(user.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>

                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <AlertDialog>
                  <AlertDialogTrigger
                    className="
                  w-full
                  bg-red-600
                  text-white
                  py-2
                  rounded-lg
                  text-sm
                  hover:bg-red-700
                  transition
                  "
                  >
                    Delete Account
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User?</AlertDialogTitle>

                      <AlertDialogDescription>
                        This action cannot be undone. The account and related
                        data will be permanently removed.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction
                        disabled={deletingId === user.id}
                        className="
                      bg-red-600
                      hover:bg-red-700
                      "
                        onClick={() => deleteUser(user.id)}
                      >
                        {deletingId === user.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page > 1) {
                  setPage(page - 1);
                }
              }}
            />
          </PaginationItem>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) => index + 1,
          ).map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href="#"
                isActive={page === number}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(number);
                }}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();

                if (page < totalPages) {
                  setPage(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Customers;
