import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

const formSchema = z.object({
  phoneNumber: z.string().regex(/^\d{11}$/, {
    message: "Phone number must be exactly 11 digits",
  })

})

export default function TourGuideProfile(){
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          phoneNumber: "",
        },
      });
      
      // Define a submit handler
      function onSubmit(values) {

        console.log(values);
      }
      
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="0122 000 1000" {...field} />
                  </FormControl>
                  <FormDescription>
                    This your phone number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }