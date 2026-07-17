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
import { toast } from "sonner";

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
    const product_id = id;

    if (quantity == null) {
      quantity = 1;
    }

    try {
      const res = await API.post("/cart", {
        product_id,
        quantity,
      });

      toast.success(res.data.message || "Product added to cart successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart.",
      );
    }
  };

  const addWishList = async (id) => {
    const product_id = id;

    try {
      const res = await API.post("/wishlist", {
        product_id,
      });

      toast.success(
        res.data.message || "Product added to wishlist successfully.",
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to wishlist.",
      );
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

  const [maxPrice, setMaxPrice] = useState(100000);
  const [price, setPrice] = useState([100000]);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const res = await API.get("/products/max-price");

        setMaxPrice(res.data.maxPrice);
        setPrice([res.data.maxPrice]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMaxPrice();
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

  return (
    <div className="min-h-screen bg-background px-5 sm:px-8 py-10">
      {/* Header */}

      <div className="max-w-7xl mx-auto mb-10">
        <h1
          className="
        text-3xl
        font-bold
        text-foreground
        "
        >
          Products
        </h1>

        <p
          className="
        mt-2
        text-muted-foreground
        "
        >
          Explore our collection and find something you love.
        </p>
      </div>

      {/* Filters */}

      <div
        className="
      max-w-7xl
      mx-auto
      bg-card
      border
      rounded-xl
      shadow-sm
      p-6
      mb-10
      "
      >
        <div
          className="
        grid
        md:grid-cols-4
        gap-6
        "
        >
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
            <div
              className="
            flex
            justify-between
            mb-3
            "
            >
              <span
                className="
              text-sm
              text-muted-foreground
              "
              >
                Maximum Price
              </span>

              <span className="font-semibold">${form.price}</span>
            </div>

            <Slider
              value={price}
              max={maxPrice}
              step={100}
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
              <SelectValue placeholder="Category">
                {category.find((c) => String(c.id) === form.category)?.name}
              </SelectValue>
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

        <div
          className="
        mt-6
        flex
        items-center
        gap-4
        flex-wrap
        "
        >
          <span
            className="
          text-sm
          text-muted-foreground
          "
          >
            Colors
          </span>

          <button
            onClick={() =>
              setForm({
                ...form,
                color: "all",
              })
            }
            className="
          border
          rounded-full
          px-4
          py-1
          text-sm
          hover:bg-muted
          transition
          "
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
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:ring-2 hover:ring-muted"
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
          group
          bg-card
          border
          rounded-xl
          overflow-hidden
          shadow-sm
          hover:shadow-md
          transition
          "
            >
              {/* Image */}

              <div
                onClick={() => navigate(`/products/${p.id}`)}
                className="
            cursor-pointer
            overflow-hidden
            relative
            "
              >
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="
              w-full
              h-60
              object-cover
              group-hover:scale-105
              transition
              duration-300
              "
                />
              </div>

              {/* Content */}

              <div className="p-5 space-y-3">
                <h2
                  className="
              text-lg
              font-semibold
              truncate
              "
                >
                  {p.title}
                </h2>

                <p
                  className="
              text-sm
              text-muted-foreground
              line-clamp-2
              "
                >
                  {p.description}
                </p>

                <div
                  className="
              flex
              items-center
              justify-between
              "
                >
                  <span
                    className="
                text-2xl
                font-bold
                "
                  >
                    ${p.price}
                  </span>

                  <div
                    className="
                w-7
                h-7
                rounded-full
                border
                "
                    style={{
                      backgroundColor: p.color,
                    }}
                  />
                </div>

                <div>
                  <span
                    className="
                inline-flex
                rounded-full
                bg-muted
                px-3
                py-1
                text-xs
                text-muted-foreground
                "
                  >
                    {p.stock} available
                  </span>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button className="flex-1" onClick={() => addCarts(p.id)}>
                    Add Cart
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addWishList(p.id)}
                  >
                    ♡
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}

        <div className="mt-12 flex justify-center">
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
