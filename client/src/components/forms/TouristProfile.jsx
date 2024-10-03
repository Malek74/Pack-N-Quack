import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,SelectGroup,SelectLabel} from "@/components/ui/select"



const nationalities = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
  "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
  "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
  "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan",
  "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", 
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"];
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().regex(/^\d{11}$/, {
    message: "Phone number must be exactly 11 digits",
  }),
  nationality: z.string().nonempty("Nationality is required"),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  jobStudent: z.enum(["job", "student"], {
    required_error: "You must select either Job or Student",
  }),

});

export default function TouristProfile() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName:"Rooma",
      email:"",
      phoneNumber: "",
      nationality:"",
      dob: "",
      jobStudent:"",
      Wallet: "00000",
      

    },
  });

  // Define a submit handler
  function onSubmit(values) {
    console.log(values);
  }

  return (

    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Username (uneditable) */}
                <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input readOnly {...field} className="bg-gray-200 cursor-not-allowed" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* phone number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="0122 000 1000" {...field} />
              </FormControl>
              <FormDescription>This your phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
                {/* Nationality (Select) */}
                <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
            <FormLabel>Nationality</FormLabel>
            <Select onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a nationality" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Nationalities</SelectLabel>
                    {nationalities.map((nation, index) => (
                        <SelectItem key={index} value={nation}>{nation}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
        </FormItem>

          )}
        />

          {/*DOB*/}
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
          />

        {/* Job/Student (Radio Buttons) */}
        <FormField
          control={form.control}
          name="jobStudent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you a job holder or a student?</FormLabel>
              <FormControl>
                <RadioGroup {...field} className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="job" {...field} />
                    <span>Job</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" value="student" {...field} />
                    <span>Student</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}

        />
        {/* Wallet (uneditable) */}
        <FormField
          control={form.control}
          name="wallet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet</FormLabel>
              <FormControl>
                <Input readOnly {...field} className="bg-gray-200 cursor-not-allowed" />
              </FormControl>
            </FormItem>
          )}
        />



        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
