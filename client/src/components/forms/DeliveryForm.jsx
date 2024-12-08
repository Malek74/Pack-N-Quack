import { useToast } from "@/hooks/use-toast";
import { countries } from "../shared/countries";
import { TableBody, TableHeader } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
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
import PropTypes from "prop-types";

// Define zod schema for main and extra addresses
const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().min(1, "Country is required"),
});

const schema = z.object({
  mainAddress: addressSchema,
  extraAddresses: z.array(addressSchema.optional()),
});

DeliveryForm.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default function DeliveryForm({ onRefresh }) {
  const { toast } = useToast();

  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mainAddress: {
        address: "",
        town: "",
        postcode: "",
        country: "",
      },
      extraAddresses: [],
    },
  });

  // UseFieldArray for managing extra addresses
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraAddresses",
  });
  const handleAddAddress = async (values) => {
    try {
      const response = await axios.post("/api/tourist/addAddress", {
        address: values,
      });
      console.log(response.data);
      onRefresh();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  // Handle form submission
  const onSubmit = async (values) => {
    console.log("Submitted values:", values);
    handleAddAddress(values);
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
              className="space-y-4 flex flex-col pt-4"
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
                  name="mainAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <span>{field.value || "Select your country"}</span>
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((nationality) => (
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
                    name={`extraAddresses.${index}.country`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <span>
                                {field.value || "Select your country"}
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((nationality) => (
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
                    country: "",
                  })
                }
              >
                Add Extra Address
              </Button>

              {/* Submit Button */}
              <DialogClose className="place-self-end self-end">
                <Button
                  type="submit"
                  className=" bg-gold hover:bg-goldhover text-white hover:text-white"
                  onClick={handleSubmit}
                >
                  Create
                </Button>
              </DialogClose>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
