import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import ImageUploader from "../shared/ImageUploader";

export default function ProductForm({ onRefresh, adderId }) {
  const { toast } = useToast();
  const [imagesUploaded, setImagesUploaded] = useState([]);

  // Define schema for validation
  const productFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    price: z.coerce
      .number()
      .min(0, { message: "Price must be a positive number." }),
    quantity: z.coerce
      .number()
      .min(1, { message: "Quantity must be at least 1." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." }),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      description: "",
    },
  });

  // Handle form submission
  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("available_quantity", values.quantity);
    formData.append("description", values.description);
    formData.append("id", adderId);

    imagesUploaded.forEach((image, index) => {
      formData.append(`images[${index}]`, image); // Append each image
    });

    try {
      const response = await axios.post("/api/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Product created successfully!",
      });
      onRefresh();
      setImagesUploaded([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Product could not be created",
        description: error.response?.data?.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter the price" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the quantity"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter the description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Uploader */}
        <ImageUploader
          imagesUploaded={imagesUploaded}
          setImagesUploaded={setImagesUploaded}
          shouldHandleSave={false} // Set to true if you want to save immediately
        />

        <DialogClose className="place-self-end">
          <Button className="place-self-end" type="submit">
            Submit
          </Button>
        </DialogClose>
      </form>
    </Form>
  );
}
