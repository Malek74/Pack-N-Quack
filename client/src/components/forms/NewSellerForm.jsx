import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import DialogTerms from "../shared/DialogTerms";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function NewSellerForm(props) {
  const formSchema2 = z.object({
    username: z
      .string()
      .min(3, "Must be at least 2 characters")
      .max(50, "Must be less then 50 characters"),
    email: z.string().email(),
    password: z.string().min(8).max(100), // Password validation with min 8 characters
    status: z.enum(
      ["Advertiser", "Seller", "Tour guide"],
      "Please select a status."
    ),
    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept terms and conditions.",
    }),
  });
  // 1.2 Define your form for seller , tour guide and advertisor signup.
  const form2 = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      username: "", // Default value for username
      email: "", // Default value for email
      password: "", // Default value for password
      status: undefined,
      terms: false,
    },
  });

  // 2.1 Define a submit handler for the Tourist form.
  function onSubmit2(values) {
    console.log(values); // Simulate account creation
    props.submitFunction(values);
  }

  return (
    <Form {...form2}>
      <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-8">
        {/* Username Field */}
        <FormField
          control={form2.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="e.g John Smith" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form2.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@address.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form2.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password must be at least (8) characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Dropdown */}
        <FormField
          control={form2.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Advertiser" />
                    </FormControl>
                    <FormLabel className="font-normal">Advertiser</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Seller" />
                    </FormControl>
                    <FormLabel className="font-normal">Seller</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Tour guide" />
                    </FormControl>
                    <FormLabel className="font-normal">Tour guide</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0"></FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms and Conditions */}
        <FormField
          control={form2.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  {...field}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept terms and conditions</FormLabel>
                <FormDescription>
                  You agree to our <DialogTerms></DialogTerms>
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button variant="secondary" type="submit">
          Create account
        </Button>
      </form>
    </Form>
  );
}
