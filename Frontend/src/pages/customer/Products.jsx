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
    price: 100000,
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

  const addWishList = async (id) => {
    let product_id = id;
    try {
      const res = await API.post("/wishlist", {
        product_id,
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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Filters */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-5">
          {/* Search */}
          <div className="md:col-span-2">
            <Field>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>

                <InputGroupInput
                  placeholder="Search products..."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      search: e.target.value,
                    })
                  }
                />
              </InputGroup>
            </Field>
          </div>

          {/* Price */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Max Price</span>

              <span className="font-semibold">${form.price}</span>
            </div>

            <Slider
              value={[form.price]}
              max={100000}
              step={10}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  price: value,
                })
              }
            />
          </div>

          {/* Category */}
          <Select
            value={form.category}
            onValueChange={(value) =>
              setForm({
                ...form,
                category: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>

              {category.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Colors */}
        <div className="mt-5 flex gap-3 items-center">
          <span className="text-sm text-gray-500">Colors:</span>

          <button
            onClick={() =>
              setForm({
                ...form,
                color: "all",
              })
            }
            className="border rounded-full px-3 py-1 text-sm"
          >
            All
          </button>

          {color.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setForm({
                  ...form,
                  color: c.color,
                })
              }
              className={`
      w-8
      h-8
      rounded-full
      border-2
      transition
      ${
        form.color === c.color
          ? "ring-2 ring-indigo-600 ring-offset-2"
          : "hover:ring-2 hover:ring-gray-300"
      }
    `}
              style={{
                backgroundColor: c.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Products */}

      <div className="max-w-7xl mx-auto">
        <div
          className="
        grid 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6
      "
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="
          bg-white 
          rounded-xl 
          border
          shadow-sm
          overflow-hidden
          hover:shadow-lg
          transition
          "
            >
              {/* Image */}
              <div
                onClick={() => navigate(`/products/${p.id}`)}
                className="cursor-pointer"
              >
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="
              w-full
              h-56
              object-cover
              "
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2
                  className="
            font-semibold
            text-lg
            truncate
            "
                >
                  {p.title}
                </h2>

                <p
                  className="
            text-gray-500
            text-sm
            mt-2
            line-clamp-2
            "
                >
                  {p.description}
                </p>

                <div
                  className="
            flex
            justify-between
            items-center
            mt-4
            "
                >
                  <p
                    className="
              text-xl
              font-bold
              "
                  >
                    ${p.price}
                  </p>

                  <div
                    className="
                w-6
                h-6
                rounded-full
                border
                "
                    style={{
                      backgroundColor: p.color,
                    }}
                  />
                </div>

                <p
                  className="
            text-sm
            text-green-600
            mt-3
            "
                >
                  {p.stock} available
                </p>

                <div
                  className="
            flex
            gap-2
            mt-5
            "
                >
                  <Button className="flex-1" onClick={() => addCarts(p.id)}>
                    Add Cart
                  </Button>

                  <Button variant="outline" onClick={() => addWishList(p.id)}>
                    ♡
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}

        <div className="mt-10 flex justify-center">
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
    </div>
  );
};

export default Products;
