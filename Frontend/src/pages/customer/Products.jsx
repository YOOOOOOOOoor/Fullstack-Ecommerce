import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: "",
    search: "",
    color: "",
    price: 5000,
  });

  // const [cart, setCart] = useEffect({
  //   product_id: "",
  //   quantity: "",
  // });

  const addCarts = async (id, quantity) => {
    let product_id = id;
    if (quantity == null) {
      quantity = 1;
    }
    try {
      const res = await API.post("/cart", {
        product_id,
        quantity,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

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
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchColor();
  }, []);

  const [products, setProducts] = useState([]);
  // const [val, setVal] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products/customer", {
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
  }, [page, form]);

  // useEffect(() => {
  //   console.log(products);
  // }, [products]);

  return (
    <div className=" flex flex-col items-center justify-center w-[100%] bg-gray-100">
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
                <TableHead>Created </TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
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
                  <TableCell className={" "}>
                    <p> {c.stock} </p>
                  </TableCell>
                  <TableCell>
                    {c.created_at
                      ? new Date(c.created_at).toLocaleDateString("en-GB")
                      : "-"}
                  </TableCell>
                  <div>
                    <TableCell>
                      <Button onClick={() => addCarts(c.id)}>
                        Add to cart
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button>WishList</Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => navigate(`/products/${c.id}`)}>
                        View
                      </Button>
                    </TableCell>
                  </div>
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
