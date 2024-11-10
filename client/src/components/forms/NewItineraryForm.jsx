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
import { Language } from "@mui/icons-material";
import Multiselect from "multiselect-react-dropdown";
import { useState } from "react";
import DateInput from "../shared/DateInput";
import NewItineraryActivityForm from "./NewItineraryActivityForm";
import CreateDialog from "../shared/CreateDialog";


export default function NewItineraryForm({ onRefresh, adderId }) {
  const [tags, setTags] = useState(["mark","john","safwat"]);
  const [dates,setDates] = useState([]);
//   const [selectedTags, setSelectedTags] = useState([]);
  const [activitiesByDay, setActivitiesByDay] = useState([]);
 

 

  const handleAddActivity = (dayNumber, newActivity) => {
    // Find if the day already exists
    const dayIndex = activitiesByDay.findIndex(
      (daySearchIndex) => daySearchIndex.day === parseInt(dayNumber)
    );

    if (dayIndex !== -1) {
      // If the day exists, append the new activity
      const updatedActivities = activitiesByDay;
      updatedActivities[dayIndex].activities.push(newActivity);
      setActivitiesByDay(updatedActivities);
    } else {
      // If the day doesn't exist, create a new day object
      const newDay = {
        day: parseInt(dayNumber),
        activities: [newActivity],
      };
      setActivitiesByDay([...activitiesByDay, newDay]);
    }
    console.log(activitiesByDay);
    toast({
      title: "Activity Added",
    });

  };

  const { toast } = useToast();
  // Define schema for validation
  const newItineraryFormSchema = z.object({
    title: z.string().min(1, { message: "Name is required." }),
    price: z.coerce
      .number()
      .min(0, { message: "Price must be a positive number." }),
    quantity: z.coerce
      .number()
      .min(1, { message: "Quantity must be at least 1." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters." }),
    Language: z.string().min(1, { message: "Tour Language is required." }),  
    tags: z.array(z.string()).nonempty({ message: "At least one tag is required" }),
    dates: z.array(z.date()).nonempty({ message: "At least one date is required" }),
  });

  // Initialize form
  const form = useForm({
    resolver: zodResolver(newItineraryFormSchema),
    defaultValues: {
        title: "",
        description: "",
        price: "",
        language: "",
        accessibility: "",
        pickUpLocation: "",
        dropOffLocation: "",
        tags: [],
        days: [],
        dates: [],
        activities: [],
        tourGuideID: "66fb241366ea8f57d59ec6db",
    },
  });


  // Handle form submission
  function onSubmit(values) {
    console.log("Values -> ",values); 
    console.log("Form -> ",form); 
    axios
      .post("/api/itinerary/", form) // Pass formData directly as the second argument
      .then((response) => {
        console.log("Itinerary added:", response.data); // Handle successful response
        // setItineraryCreated(response.data); "rerender"
        console.log("Product created successfully:", response.data);
        toast({
          title: "Product created succesfully!",
        });
        onRefresh();
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Product could not be created",
          description: error.response.data.message,
        });
        console.error(error);
        console.log(error);
      });
  }

  return (
    <>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col"
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter the name" {...field} />
              </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
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
              {/* <FormDescription>Provide a brief description of the product.</FormDescription> */}
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
                <Input
                  placeholder="Enter the price"
                  type="number"
                  {...field}
                  valueAsNumber
                />
              </FormControl>
              {/* <FormDescription>Price of the product in EGP.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        

        {/* language Field */}
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour Language</FormLabel>
              <FormControl>
                <Input placeholder="Enter the language" {...field} />
              </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

<FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Multiselect
                                    className="w-max"
                                    isObject={false}
                                    options={tags.map(tag => tag)}  // Populate options with tag names
                                    onSelect={(selectedList) => {
                                        field.onChange(selectedList);
                                    }}
                                    onRemove={(selectedList) => {
                                        field.onChange(selectedList);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

        <FormField
          control={form.control}
          name="accessibility"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility</FormLabel>
              <FormControl>
                <Input placeholder="Enter the accessibilities" {...field} />
              </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />




        <FormField
          control={form.control}
          name="pickUpLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick up location</FormLabel>
              <FormControl>
                <Input placeholder="Enter the pick up loction" {...field} />
              </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="dropUpLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drop up location</FormLabel>
              <FormControl>
                <Input placeholder="Enter the drop up loction" {...field} />
              </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Dates</FormLabel>
              <FormControl>
                {/* <Input placeholder="Enter the available Dates" {...field} /> */}
                <DateInput dates={dates} setDates={setDates} multiple={true} value={field.value || []} onChange={field.onChange}/>
                </FormControl>
              {/* <FormDescription>Name of the product being sold.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        

       
        <DialogClose className="place-self-end">
          <Button className="place-self-end" type="submit">
            Submit
          </Button>
        </DialogClose>
      </form>
      
    </Form>
    {/* <CreateDialog
            title= "Activity"
            form= { <NewItineraryActivityForm activityOnSubmit={handleAddActivity} />} 
    /> */}
       
</>
  );
}
