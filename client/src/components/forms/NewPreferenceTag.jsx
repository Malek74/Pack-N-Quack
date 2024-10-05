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

export default function NewPreferenceForm({type}){

    const NewPreferenceFormSchema = z.object({
        tag: z.string().min(2, { message: "Tag must be at least 2 characters long." }).max(20, { message: "Username must be 20 characters or less." }),
      });
      const form = useForm({
        resolver: zodResolver(NewPreferenceFormSchema),
        defaultValues: {
          tag: "",
        },
      });
      
      // 2. Define a submit handler.
      function onSubmit(values) {
       
        console.log(values);
      }
      
    return(<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col">
          <FormField
            control={form.control}
            name="Tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <FormControl>
                  <Input placeholder="Standup comedy, concert, party, etc.." {...field} />
                </FormControl>
                <FormDescription>
                  Enter activity tag.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button className="place-self-end" type="submit">Submit</Button>
        </form>
      </Form>
  )
}