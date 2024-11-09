import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import MultiselectDropdown from "../shared/MultiselectDropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import MultiDatePicker from "../shared/MultiDatePicker";
import format from "date-fns/format";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import ImageUploader from "../shared/ImageUploader";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Please enter a description"),
  language: z.string().min(1, "Language is required"),
  price: z.coerce.number().min(1, "Price is required"),
  pickUpLocation: z.object({
    name: z.string().min(1, "Pick-up location is required"),
    googleMapLink: z.string().url("Invalid URL"),
  }),
  dropOffLocation: z.object({
    name: z.string().min(1, "Drop-off location is required"),
    googleMapLink: z.string().url("Invalid URL"),
  }),
  accessibility: z.string().min(1, "Accessibility is required"),
  available_dates: z
    .array(z.string().min(1, "Date is required"))
    .min(1, "At least one date is required"),
  tags: z
    .array(z.string().min(1, "Tag is required"))
    .min(1, "At least one tag is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  images: z.array(z.string().min(1, "Image is required")),
  days: z
    .array(
      z.object({
        day: z.number().int().positive("Day must be a positive integer"),
        activities: z
          .array(
            z.object({
              name: z.string().min(1, "Activity name is required"),
              location: z.string().min(1, "Activity location is required"),
              googleMapLink: z.string().url("Invalid URL"),
              duration: z.object({
                startTime: z.string().min(1, "Start time is required"),
                endTime: z.string().min(1, "End time is required"),
              }),
              description: z.string().min(1, "Description is required"),
              image: z.array(z.string().min(1, "Image is required")),
            })
          )
          .min(1, "Each day must have at least one activity"),
      })
    )
    .min(1, "At least one day is required"),
});

export default function CreateItineraryForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      language: "",
      price: "",
      pickUpLocation: { name: "", googleMapLink: "" },
      dropOffLocation: { name: "", googleMapLink: "" },
      accessibility: "",
      available_dates: [],
      tags: [],
      days: [
        {
          day: 1,
          activities: [
            {
              name: "",
              location: "",
              googleMapLink: "",
              duration: { startTime: "", endTime: "" },
              description: "",
              image: [],
            },
          ],
        },
      ],
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [itineraryImages, setItineraryImages] = useState([]);
  const [coverImage, setCoverImage] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [dates, setDates] = useState([]);
  const [days, setDays] = useState([
    {
      day: 1,
      activities: [
        {
          name: "",
          location: "",
          googleMapLink: "",
          duration: { startTime: "", endTime: "" },
          description: "",
          image: [],
        },
      ],
    },
  ]);
  const removeDay = (index) => {
    const updatedDays = [...days];
    updatedDays.splice(index, 1);
    setDays(updatedDays);
  };
  // Update a specific activity field
  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex][field] = value; // Update the specific field
    setDays(updatedDays);
  };

  const handleDurationChange = (dayIndex, activityIndex, field, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities[activityIndex].duration[field] = value;
    setDays(updatedDays);
  };

  const addActivity = (dayIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.push({
      name: "",
      location: "",
      googleMapLink: "",
      duration: { startTime: "", endTime: "" },
      description: "",
      image: [],
    });
    setDays(updatedDays);
  };

  const removeActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...days]; // Clone the existing `days` array
    updatedDays[dayIndex].activities.splice(activityIndex, 1); // Remove the activity
    setDays(updatedDays); // Update the state
  };

  const addDay = () => {
    const newDay = {
      day: days.length + 1, // Increment the day count
      activities: [
        {
          name: "",
          location: "",
          googleMapLink: "",
          duration: { startTime: "", endTime: "" },
          description: "",
          image: [],
        },
      ], // Start with one default activity
    };
    setDays([...days, newDay]); // Append the new day to the existing `days` array
  };

  useEffect(() => {
    const fetchItineraryTags = async () => {
      try {
        const response = await axios.get("/api/itiernaryTags");
        setTagsOptions(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItineraryTags();
    setIsLoading(false);
  }, []);

  // Sync the selectedTags state with the form value
  useEffect(() => {
    form.setValue(
      "tags",
      selectedTags.map((tag) => tag.tag) // Map to the tag strings
    );
    form.setValue(
      "available_dates",
      dates.map((date) => format(date, "yyyy-MM-dd"))
    ); // Map to the date strings)

    form.setValue("days", days);

    form.setValue("coverImage", coverImage[0]);

    form.setValue("images", itineraryImages);
  }, [selectedTags, form, dates, days, coverImage, itineraryImages]);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", values.coverImage);
      for (let index = 0; index < itineraryImages.length; index++) {
        formData.append("images", itineraryImages[index]);
      }
      days.forEach((day) => {
        day.activities.forEach((activity) => {
          formData.append("activityImages", activity.image[0]);
        });
      });
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append(
        "dropOffLocation",
        JSON.stringify(values.dropOffLocation)
      );
      formData.append("accessibility", values.accessibility);
      values.available_dates.map((date) =>
        formData.append("available_dates", date)
      );
      values.tags.map((tag) => formData.append("tags", tag));
      formData.append("days", JSON.stringify(values.days));
      formData.append("language", values.language);
      formData.append("price", values.price);
      formData.append("pickUpLocation", JSON.stringify(values.pickUpLocation));
      formData.append("tourGuideID", "66fb241366ea8f57d59ec6db");
      const response = await axios.post("/api/itinerary/", formData);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    !isLoading && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Itinerary Cover Image</Label>
                <ImageUploader
                  single
                  imagesUploaded={coverImage}
                  setImagesUploaded={setCoverImage}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Itinerary Images</Label>
                <ImageUploader
                  imagesUploaded={itineraryImages}
                  setImagesUploaded={setItineraryImages}
                />
              </div>

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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickUpLocation.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick-Up Location Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Pick-Up location name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pickUpLocation.googleMapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pick-Up Google Map Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Pick-Up Google Map link"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dropOffLocation.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop-Off Location Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Drop-Off location name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dropOffLocation.googleMapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop-Off Google Map Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the Drop-Off Google Map link"
                        {...field}
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
                      <Input placeholder="Enter the accessibility" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Enter the price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiselectDropdown
                        options={tagsOptions}
                        selectedOptions={selectedTags} // Ensure it's an array
                        setSelectedOptions={setSelectedTags} // Correctly pass the onChange function
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available_dates"
                render={() => (
                  <FormItem>
                    <FormLabel>Available Dates</FormLabel>
                    <MultiDatePicker dates={dates} setDates={setDates} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the language" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {days.map((day, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Day {index + 1}</CardTitle>
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={() => removeDay(index)}
                      disabled={days.length === 1}
                    >
                      Remove Day
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {day.activities.map((activity, activityIndex) => (
                      <div
                        key={activityIndex}
                        className="flex flex-col gap-2 border p-2 rounded-md mb-2"
                      >
                        <div className="flex justify-between">
                          <Label>Activity {activityIndex + 1}</Label>
                          <Button
                            disabled={day.activities.length === 1}
                            variant="destructive"
                            type="button"
                            onClick={() => removeActivity(index, activityIndex)} // Call the `removeActivity` function
                          >
                            Remove Activity
                          </Button>
                        </div>
                        <Label>Name</Label>
                        <Input
                          placeholder="Enter the activity name"
                          value={activity.name}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              activityIndex,
                              "name",
                              e.target.value
                            )
                          }
                        />

                        <Label>Description</Label>
                        <Textarea
                          placeholder="Enter the activity description"
                          value={activity.description}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              activityIndex,
                              "description",
                              e.target.value
                            )
                          }
                        />

                        <Label>Location</Label>
                        <Input
                          placeholder="Enter the activity location"
                          value={activity.location}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              activityIndex,
                              "location",
                              e.target.value
                            )
                          }
                        />

                        <Label>Google Map Link</Label>
                        <Input
                          placeholder="Enter the activity google map link"
                          value={activity.googleMapLink}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              activityIndex,
                              "googleMapLink",
                              e.target.value
                            )
                          }
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start Time</Label>
                            <Input
                              type="time"
                              value={activity.duration.startTime}
                              onChange={(e) =>
                                handleDurationChange(
                                  index,
                                  activityIndex,
                                  "startTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>End Time</Label>
                            <Input
                              type="time"
                              value={activity.duration.endTime}
                              onChange={(e) =>
                                handleDurationChange(
                                  index,
                                  activityIndex,
                                  "endTime",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <Label>Activity Image</Label>
                          <ImageUploader
                            single
                            imagesUploaded={activity.image}
                            setImagesUploaded={(images) => {
                              handleActivityChange(
                                index,
                                activityIndex,
                                "image",
                                images
                              );
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={() => addActivity(index)}
                      >
                        Add Activity
                      </Button>
                      <Button
                        variant="secondary"
                        type="button"
                        onClick={addDay} // Call the `addDay` function
                      >
                        Add Day
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              className="place-self-end"
              type="submit"
              onClick={() => onSubmit(form.getValues())}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    )
  );
}
