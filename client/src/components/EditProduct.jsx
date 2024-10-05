import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Pencil } from "lucide-react"

// Define the schema for validation
const productFormSchema = z.object({
  price: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

export function EditProductDialog({ product }) {
  // Initialize form with default values from the product being edited
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      price: product.price ?? 0, // Set the default value for price
      description: product.description ?? "", // Set the default value for description
    },
  })

  // Handle form submission
  function onSubmit(values) {
    console.log("Product Edited", values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button>
      <Pencil /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        {/* Edit Product Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
            {/* Display-only Name Field */}
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="p-2 bg-gray-100 rounded-md">
                {product.name}
              </div>
            </FormItem>

            {/* Display-only Quantity Field */}
            <FormItem>
              <FormLabel>Available Quantity</FormLabel>
              <div className="p-2 bg-gray-100 rounded-md">
                {product.quantity}
              </div>
            </FormItem>

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the price"
                      type="number"
                      {...field}
                      valueAsNumber // Automatically converts the input to a number
                    />
                  </FormControl>
                  <FormDescription>Price of the product in USD.</FormDescription>
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
                    <Textarea
                      placeholder="Enter the description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Provide a brief description of the product.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="place-self-end" type="submit">
              Save Changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
