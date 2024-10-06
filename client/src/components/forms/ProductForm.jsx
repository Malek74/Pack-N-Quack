import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ProductForm() {
  // Define schema for validation
  const productFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
    quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
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
  function onSubmit(values) {
    console.log("Form Submitted", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
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
              <FormDescription>Name of the product being sold.</FormDescription>
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
                <Input placeholder="Enter the price" type="number" {...field} valueAsNumber/>
              </FormControl>
              <FormDescription>Price of the product in EGP.</FormDescription>
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
                <Input placeholder="Enter the quantity" type="number" {...field} />
              </FormControl>
              <FormDescription>Set the available quantity of the product.</FormDescription>
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
              <FormDescription>Provide a brief description of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="place-self-end" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
