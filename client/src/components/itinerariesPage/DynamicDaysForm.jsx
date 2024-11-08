import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  days: z.array(
    z.object({
      day: z.number().int().positive("Day must be a positive integer"),
      activities: z.array(
        z.object({
          name: z.string().min(1, "Activity name is required"),
          location: z.string().min(1, "Activity location is required"),
          googleMapLink: z.string().url("Invalid URL"),
          duration: z.object({
            startTime: z.string().min(1, "Start time is required"),
            endTime: z.string().min(1, "End time is required"),
          }),
          description: z.string().min(1, "Description is required"),
        })
      ),
    })
  ),
});

export default function DynamicDaysForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
            },
          ],
        },
      ],
    },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {dayFields.map((dayField, dayIndex) => (
          <div key={dayField.id} className="border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <FormLabel>Day {dayIndex + 1}</FormLabel>
              <Button
                variant="destructive"
                onClick={() => removeDay(dayIndex)}
                disabled={dayFields.length === 1} // Prevent removing the last day
              >
                Remove Day
              </Button>
            </div>

            <FormItem>
              <FormLabel>Activities</FormLabel>
              <div>
                {dayField.activities.map((_, activityIndex) => (
                  <div
                    key={activityIndex}
                    className="border p-4 rounded-md mb-4"
                  >
                    <FormItem>
                      <FormLabel>Activity Name</FormLabel>
                      <FormControl>
                        <Input
                          {...form.register(
                            `days.${dayIndex}.activities.${activityIndex}.name`
                          )}
                          placeholder="Activity Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...form.register(
                            `days.${dayIndex}.activities.${activityIndex}.location`
                          )}
                          placeholder="Location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Google Map Link</FormLabel>
                      <FormControl>
                        <Input
                          {...form.register(
                            `days.${dayIndex}.activities.${activityIndex}.googleMapLink`
                          )}
                          placeholder="Google Map Link"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <div className="grid grid-cols-2 gap-4">
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...form.register(
                              `days.${dayIndex}.activities.${activityIndex}.duration.startTime`
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...form.register(
                              `days.${dayIndex}.activities.${activityIndex}.duration.endTime`
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...form.register(
                            `days.${dayIndex}.activities.${activityIndex}.description`
                          )}
                          placeholder="Description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                ))}
              </div>
            </FormItem>

            <Button
              variant="secondary"
              onClick={() =>
                form.setValue(`days.${dayIndex}.activities`, [
                  ...form.getValues(`days.${dayIndex}.activities`),
                  {
                    name: "",
                    location: "",
                    googleMapLink: "",
                    duration: { startTime: "", endTime: "" },
                    description: "",
                  },
                ])
              }
            >
              Add Activity
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            appendDay({
              day: dayFields.length + 1,
              activities: [
                {
                  name: "",
                  location: "",
                  googleMapLink: "",
                  duration: { startTime: "", endTime: "" },
                  description: "",
                },
              ],
            })
          }
        >
          Add Day
        </Button>

        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
