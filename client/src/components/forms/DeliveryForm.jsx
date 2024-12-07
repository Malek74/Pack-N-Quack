import { useToast } from "@/hooks/use-toast";
import { nationalities } from "../shared/nationalities";
import { TableBody, TableHeader } from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DialogClose } from "../ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Import Select component

// Define zod schema for main and extra addresses
const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town is required"),
  postcode: z.string().min(1, "Postcode is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

const schema = z.object({
  mainAddress: addressSchema,
  extraAddresses: z.array(addressSchema.optional()),
});

export default function DeliveryForm() {
  const { toast } = useToast();

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mainAddress: {
        address: "",
        town: "",
        postcode: "",
        nationality: "",
      },
      extraAddresses: [
        {
          address: "",
          town: "",
          postcode: "",
          nationality: "",
        },
      ],
    },
  });

  // UseFieldArray for managing extra addresses
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraAddresses",
  });

  // Handle form submission
  const onSubmit = async (values) => {
    console.log("Submitted values:", values);
    // Add your logic here
  };
  const handleSubmit = () => {
    // Close the Add Address tab (implement this logic as per your UI setup)
    console.log("Add Address tab closed");

    // Show a toaster notification
    toast({
      title: "Address Submitted",
      description: "Your selected address has been successfully submitted.",
    });
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card>
        <CardContent>
          <TableHeader></TableHeader>
          <TableBody></TableBody>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col"
            >
              {/* Main Address Fields */}
              <FormLabel>Main Address</FormLabel>
              <div className="space-y-4">
                {["address", "town", "postcode"].map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={`mainAddress.${field}`}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Enter your ${field}`}
                            {...formField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {/* Nationality Field as Select */}
                <FormField
                  control={form.control}
                  name="mainAddress.nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <span>
                              {field.value || "Select your nationality"}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {nationalities.map((nationality) => (
                              <SelectItem key={nationality} value={nationality}>
                                {nationality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Extra Address Fields */}
              <FormLabel>Extra Addresses (Optional)</FormLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="space-y-4 border p-4 rounded-md">
                  {["address", "town", "postcode"].map((field) => (
                    <FormField
                      key={field}
                      control={form.control}
                      name={`extraAddresses.${index}.${field}`}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter extra ${field}`}
                              {...formField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  {/* Nationality Field for Extra Addresses */}
                  <FormField
                    control={form.control}
                    name={`extraAddresses.${index}.nationality`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <span>
                                {field.value || "Select your nationality"}
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              {nationalities.map((nationality) => (
                                <SelectItem
                                  key={nationality}
                                  value={nationality}
                                >
                                  {nationality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}

              {/* Add Extra Address Button */}
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  append({
                    address: "",
                    town: "",
                    postcode: "",
                    nationality: "",
                  })
                }
              >
                Add Extra Address
              </Button>

              {/* Submit Button */}
              <DialogClose>
                <Button
                  type="submit"
                  className="place-self-end bg-gold hover:bg-goldhover text-white hover:text-white"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </DialogClose>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Use the form above to add and manage your addresses.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
