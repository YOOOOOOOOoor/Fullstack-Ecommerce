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
import { useState } from "react";
import API from "../../../../API/api.js";

const Add = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });

  const addProduct = async (e) => {
    e.preventDefault();
    console.log("running");
    try {
      const res = await API.post("/category", form);
      console.log(res.data);
      onSuccess();
      setForm({ name: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-blue-500 text-white hover:bg-green-600 cursor-pointer">
            Add Category
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={addProduct}>
          <DialogHeader>
            <DialogDescription className="">
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Category Name:</Label>
              <Input
                id="name-1"
                name="name"
                // defaultValue="Pedro Duarte"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Add;
