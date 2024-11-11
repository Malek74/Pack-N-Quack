import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // Track submission status

  const { toast } = useToast();

  // Define schema for validation, including images as an array
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
    images: z
      .array(z.instanceof(File))
      .min(1, { message: "At least one image is required." }), // Add validation for images
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: "",
      description: "",
      images: [], // Add default empty array for images
    },
  });

  // Handle form submission
  async function onSubmit(values) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price.toString()); // Ensure price is a string
    formData.append("available_quantity", values.quantity.toString()); // Ensure quantity is a string
    formData.append("description", values.description);
    values.images.forEach((image) => {
      formData.append(`images`, image); // Append each image from form data
    });

    try {
      const response = await axios.post(`/api/products/${adderId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSubmissionSuccess(true); // Set success to true

      toast({
        title: "Product created successfully!",
      });
      onRefresh();

      form.reset();
    } catch (error) {
      setSubmissionSuccess(false); // Ensure it doesn’t close on error

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
              <FormDescription>
                Price in <strong>USD</strong>.
              </FormDescription>
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

        {/* Image Uploader Field */}
        <Controller
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageUploader
                  imagesUploaded={field.value}
                  setImagesUploaded={(images) => field.onChange(images)}
                  shouldHandleSave={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submissionSuccess ? (
          <DialogClose asChild>
            <Button className="place-self-end" type="submit">
              Submit
            </Button>
          </DialogClose>
        ) : (
          <Button className="place-self-end" type="submit">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
