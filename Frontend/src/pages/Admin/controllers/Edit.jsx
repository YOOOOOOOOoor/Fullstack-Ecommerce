import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import API from "../../../../API/api.js";
import { useEffect, useState } from "react";

const Edit = ({ onSuccess, id }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "" });

  useEffect(() => {
    const fetchCate = async () => {
      try {
        const res = await API.get(`/category/${id}`);
        setForm({ name: res.data.name });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCate();
  }, [id]);

  const EditProduct = async (e) => {
    e.preventDefault();
    console.log("running");
    try {
      const res = await API.put(`/category/${id}`, form);
      console.log(res.data);
      onSuccess();
      setForm({ name: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
    8;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-red-500 text-white hover:bg-red-600 cursor-pointer">
            Edit Category
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={EditProduct}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Edit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
