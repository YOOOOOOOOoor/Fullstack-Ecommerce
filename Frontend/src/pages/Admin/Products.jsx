import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
// import Edit from "./products/Edit";

import { useState, useEffect } from "react";
import API from "../../../API/api.js";

import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

const Products = () => {
  const [form, setForm] = useState({
    category: "",
    search: "",
    color: "",
    status: "all",
    price: 100000,
  });
  console.log("Form", form);

  const [category, setCategory] = useState([]);
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");
        const data = res.data.map((c) => ({
          id: c.id,
          name: c.name,
        }));
        setCategory(data);
        console.log("mapped:", data);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchCategory();
  }, []);

  const [color, setColor] = useState([]);
  useEffect(() => {
    const fetchColor = async () => {
      try {
        const res = await API.get("/products/color");
        const data = res.data.map((c) => ({
          id: c.id,
          color: c.color,
        }));
        setColor(data);
        console.log("mapping:", data);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchColor();
  }, []);

  const status = ["all", "published", "draft"];

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [val, setVal] = useState(1);
  // const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const val2 = () => {
    return setVal((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products", {
          params: {
            ...form,
            page,
            limit: 5,
          },
        });

        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [page, val, form]);

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      val2();
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    console.log(products);
  }, [products]);

  //
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your store products, stock and visibility
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/products/add")}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-5 rounded-lg"
        >
          + Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="w-full max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-center">
          {/* Search */}
          <div className="lg:col-span-2">
            <Field>
              <InputGroup className="h-12">
                <InputGroupAddon>
                  <SearchIcon className="text-gray-400" />
                </InputGroupAddon>

                <InputGroupInput
                  placeholder="Search products..."
                  className="text-base"
                  onChange={(e) => setForm({ ...form, search: e.target.value })}
                />
              </InputGroup>
            </Field>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Maximum Price</label>

              <span className="text-indigo-600 font-semibold">
                ${form.price}
              </span>
            </div>

            <Slider
              value={form.price}
              max={100000}
              step={10}
              onValueChange={(value) => setForm({ ...form, price: value })}
            />
          </div>

          {/* Category */}
          <Select
            value={form.category}
            onValueChange={(value) => setForm({ ...form, category: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue>
                {form.category === "all"
                  ? "All Categories"
                  : category.find((c) => String(c.id) === form.category)
                      ?.name || "Select Category"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>

                <SelectItem value="all">All Categories</SelectItem>

                {category.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Extra Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {/* Color */}
          <Select
            value={form.color}
            onValueChange={(value) => setForm({ ...form, color: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue>
                {form.color === "all" ? (
                  "All Colors"
                ) : form.color ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{
                        backgroundColor: form.color,
                      }}
                    />

                    <span>{form.color}</span>
                  </div>
                ) : (
                  "Select Color"
                )}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color</SelectLabel>

                <SelectItem value="all">All Colors</SelectItem>

                {color.map((c) => (
                  <SelectItem key={c.id} value={String(c.color)}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border"
                        style={{
                          backgroundColor: c.color,
                        }}
                      />

                      {c.color}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={form.status}
            onValueChange={(value) => setForm({ ...form, status: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue>
                {form.status === "all"
                  ? "All Status"
                  : form.status.toUpperCase()}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>

                {status.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Products Table */}
      <div className="w-full max-w-[1400px] mx-auto bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold">All Products</h2>

          <p className="text-sm text-gray-500">
            View and manage your available products
          </p>
        </div>

        <div className="overflow-x-auto p-4">
          <Table className=" ">
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Product</TableHead>

                <TableHead className="font-semibold">Category</TableHead>

                <TableHead className="font-semibold">Color</TableHead>

                <TableHead className="font-semibold">Price</TableHead>

                <TableHead className="font-semibold">Stock</TableHead>

                <TableHead className="font-semibold">Status</TableHead>

                <TableHead className="font-semibold">Created</TableHead>

                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50 transition">
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <img
                        src={c.image_url}
                        alt={c.title}
                        className="w-14 h-14 rounded-lg object-cover border"
                      />

                      <div>
                        <p className="font-semibold text-gray-900">{c.title}</p>

                        <p className="text-sm text-gray-500 max-w-[200px] truncate">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                      {c.category_name}
                    </span>
                  </TableCell>

                  {/* Color */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full border shadow-sm"
                        style={{
                          backgroundColor: c.color,
                        }}
                      />
                    </div>
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <span className="font-semibold text-gray-900">
                      ${c.price}
                    </span>
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{c.stock}</span>

                      {c.stock > 20 && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          High
                        </span>
                      )}

                      {c.stock <= 20 && c.stock > 10 && (
                        <span className="flex items-center gap-1 text-xs text-orange-600">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          Medium
                        </span>
                      )}

                      {c.stock <= 10 && (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Low
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <span className="text-gray-600">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString("en-GB")
                        : "-"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => navigate(`/admin/products/${c.id}`)}
                      >
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          }
                        />

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. The product will be
                              permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteProduct(c.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center py-6 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();

                    if (page > 1) {
                      setPage(page - 1);
                    }
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={page === index + 1}
                    className="cursor-pointer"
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
                  className="cursor-pointer"
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
      </div>
    </div>
  );
};

export default Products;
