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
    price: 5000,
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

  return (
    <div className=" flex flex-col items-center justify-center w-[100%] bg-gray-100">
      <div>
        <Button onClick={() => navigate("/admin/products/add")}>
          Add Products
        </Button>
      </div>
      <div className=" flex w-298">
        <div className="w-[50%]">
          <Field className="w-[100%]">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search..."
                onChange={(e) => setForm({ ...form, search: e.target.value })}
              />
            </InputGroup>
          </Field>
        </div>

        <div className="w-[50%] flex  justify-around">
          <div className="w-[20%]">
            <label htmlFor="">{form.price}</label>
            <Slider
              value={form.price}
              max={5000}
              step={10}
              className="w-85 bg-red-900"
              onValueChange={(value) => setForm({ ...form, price: value })}
            />
          </div>
          <div>
            <Select
              value={form.category}
              onValueChange={(value) => setForm({ ...form, category: value })}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue>
                  {form.category === "all"
                    ? "All"
                    : category.find((c) => String(c.id) === form.category)
                        ?.name || "Select a Category"}
                </SelectValue>
                {/* <SelectValue placeholder="Select a Category" /> */}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem key={"all"} value={"all"}>
                    All
                  </SelectItem>
                  {category.map((c) => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                      className={"w-[100%]"}
                    >
                      {c.name || String(c.id)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={form.color}
              onValueChange={(value) => setForm({ ...form, color: value })}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue>
                  {form.color === "all" ? (
                    "All"
                  ) : form.color ? (
                    <div
                      className="w-5 h-5 rounded-full border"
                      style={{
                        backgroundColor: color.find(
                          (c) => c.color === form.color,
                        )?.color,
                      }}
                    />
                  ) : (
                    "Select a Color"
                  )}
                </SelectValue>
                {/* <SelectValue placeholder="Select a Category" /> */}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Color</SelectLabel>
                  <SelectItem value={"all"}>All</SelectItem>
                  {color.map((c) => (
                    <SelectItem key={c.id} value={String(c.color)}>
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      ></div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue>
                  {form.status === "all"
                    ? "All"
                    : status.find((c) => c === form.status)?.toUpperCase() ||
                      "Select a Category"}
                </SelectValue>
                {/* <SelectValue placeholder="Select a Category" /> */}
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>

                  {status.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className=" w-[70%]">
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status </TableHead>
                <TableHead>Created </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.image_url}
                        alt={c.title}
                        className="w-15 h-10 rounded-md object-cover"
                      />
                      <p>{c.title}</p>
                    </div>
                  </TableCell>
                  <TableCell>{c.category_name}</TableCell>
                  <TableCell>
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: c.color }}
                    ></div>
                  </TableCell>
                  <TableCell>${c.price}</TableCell>
                  <TableCell
                    className={"flex gap-3 items-center justify-center h-20 "}
                  >
                    <p> {c.stock} </p>

                    <div>
                      {c.stock > 20 && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "green" }}
                        ></div>
                      )}
                      {c.stock <= 20 && c.stock > 10 && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "orange" }}
                        ></div>
                      )}
                      {c.stock <= 10 && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "red" }}
                        ></div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={""}>
                    <div>
                      {
                        <div
                          className=" rounded-full px-3 w-fit"
                          style={{
                            backgroundColor:
                              c.status === "published" ? "#D0FAE5" : "red",
                            color:
                              c.status === "published" ? "#007A55" : "white",
                          }}
                        >
                          <p>{c.status}</p>
                        </div>
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString("en-GB")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => navigate(`/admin/products/${c.id}`)}>
                      Edit
                    </Button>
                    <div>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={<Button variant="outline">Delete</Button>}
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProduct(c.id)}
                            >
                              Continue
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
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={page === index + 1}
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
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Products;
