import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { CheckIcon } from 'lucide-react';

 import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PhoneInput } from '@/components/PhoneInput';
import { SampleDatePicker } from '@/components/datepicker';

export default function RegistrationPage() {
  const [buttonClicked, setButtonClicked] = useState(null); // Manage which form to display
  const [submitted, setSubmitted] = useState(false); // State to track submission

  const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100), // Password validation with min 8 characters
    mobileNumber: z.string().min(1 ,"Mobile number is required."), // Make mobile number required
    nationality: z.string().min(1, "Nationality is required."), // Make nationality required
    status: z.enum(['job', 'student'], "Please select a status." ), // Radio group validation

    dob: z
        .union([z.date(), z.null()]) // Allow both date or null
        .refine((date) => date === null || !isNaN(date.getTime()), {
          message: "Date of birth is missing or invalid",
        })
        .transform((date) => (date ? date.toISOString() : null)), // Convert to ISO string or keep null
    })

    

  // 1.1 Define your form for tourist signup.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",      // Default value for username
      email: "",         // Default value for email
      password: "",      // Default value for password
      mobileNumber: "",  // Default value for mobile number
      nationality: "",   // Default value for nationality
      status: undefined,     // Default value for status dropdown
      dob: "",           // Default value for date of birth
    },
  });


  // 2.1 Define a submit handler for the Tourist form.
  function onSubmit(values) {
    console.log(values); // Simulate account creation
    // Reset form state and show success message
    form.reset();
    setSubmitted(true); // Optional: Indicate submission was successful
    setTimeout(() => {
      setButtonClicked(null); // Return to the initial two buttons
    }, 500); // Redirect after 0.5 second (you can adjust this delay)
  }

  // Handle button click for initial form selection
  const handleButtonClick = (userType) => {
    setButtonClicked(userType); // Set form to display based on userType
  };
  const nationalities = [
    "Afghan",
    "Albanian",
    "Algerian",
    "American",
    "Angolan",
    "Argentine",
    "Armenian",
    "Australian",
    "Austrian",
    "Azerbaijani",
    "Bahraini",
    "Bangladeshi",
    "Belgian",
    "Belizean",
    "Beninese",
    "Bhutanese",
    "Bolivian",
    "Bosnian",
    "Botswanan",
    "Brazilian",
    "British",
    "Bulgarian",
    "Burkinabe",
    "Burmese",
    "Burundian",
    "Cambodian",
    "Cameroonian",
    "Canadian",
    "Cape Verdean",
    "Central African",
    "Chadian",
    "Chilean",
    "Chinese",
    "Colombian",
    "Comorian",
    "Congolese (Congo)",
    "Congolese (DRC)",
    "Costa Rican",
    "Croatian",
    "Cuban",
    "Cypriot",
    "Czech",
    "Danish",
    "Djiboutian",
    "Dominican",
    "Dutch",
    "Ecuadorian",
    "Egyptian",
    "Emirati",
    "Equatorial Guinean",
    "Eritrean",
    "Estonian",
    "Ethiopian",
    "Fijian",
    "Finnish",
    "French",
    "Gabonese",
    "Gambian",
    "Georgian",
    "German",
    "Ghanaian",
    "Greek",
    "Grenadian",
    "Guatemalan",
    "Guinean",
    "Guinean (Bissau)",
    "Guyanese",
    "Haitian",
    "Honduran",
    "Hungarian",
    "Icelandic",
    "Indian",
    "Indonesian",
    "Iranian",
    "Iraqi",
    "Irish",
    "Israeli",
    "Italian",
    "Ivorian",
    "Jamaican",
    "Japanese",
    "Jordanian",
    "Kazakh",
    "Kenyan",
    "Kuwaiti",
    "Kyrgyz",
    "Laotian",
    "Latvian",
    "Lebanese",
    "Liberian",
    "Libyan",
    "Liechtenstein",
    "Lithuanian",
    "Luxembourgish",
    "Macedonian",
    "Malagasy",
    "Malawian",
    "Malaysian",
    "Maldivian",
    "Malian",
    "Maltese",
    "Mauritanian",
    "Mauritian",
    "Mexican",
    "Moldovan",
    "Monacan",
    "Mongolian",
    "Montenegrin",
    "Moroccan",
    "Mozambican",
    "Namibian",
    "Nepalese",
    "New Zealander",
    "Nicaraguan",
    "Nigerian",
    "Norwegian",
    "Omani",
    "Pakistani",
    "Palestinian",
    "Panamanian",
    "Paraguayan",
    "Peruvian",
    "Philippine",
    "Polish",
    "Portuguese",
    "Qatari",
    "Romanian",
    "Russian",
    "Rwandan",
    "Saint Lucian",
    "Salvadoran",
    "Samoan",
    "Saudi Arabian",
    "Senegalese",
    "Serbian",
    "Seychellois",
    "Singaporean",
    "Slovak",
    "Slovenian",
    "Somali",
    "South African",
    "South Korean",
    "Spanish",
    "Sri Lankan",
    "Sudanese",
    "Swedish",
    "Swiss",
    "Syrian",
    "Taiwanese",
    "Tajik",
    "Tanzanian",
    "Thai",
    "Togolese",
    "Tunisian",
    "Turkish",
    "Turkmen",
    "Ugandan",
    "Ukrainian",
    "Emirate",
    "Uruguayan",
    "Uzbek",
    "Venezuelan",
    "Vietnamese",
    "Welsh",
    "Zambian",
    "Zimbabwean",
  ];
  
  const formSchema2 = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(100), // Password validation with min 8 characters
    status: z.enum(['Advertiser','Seller', 'Tour guide'], "Please select a status." ), // Radio group validation
  });
  // 1.2 Define your form for seller , tour guide and advertisor signup.
  const form2 = useForm({
    resolver: zodResolver(formSchema2),
    defaultValues: {
      username: "",      // Default value for username
      email: "",         // Default value for email
      password: "",      // Default value for password
      status: undefined,     // Default value for status dropdown
    
    },
  }); 

  // 2.1 Define a submit handler for the Tourist form.
  function onSubmit2(values) {
    console.log(values); // Simulate account creation
    // Reset form state and show success message
    form2.reset();
    setSubmitted(true); // Optional: Indicate submission was successful
    setTimeout(() => {
      setButtonClicked(null); // Return to the initial two buttons
    }, 500); // Redirect after 0.5 second (you can adjust this delay)
  }

  const buttonStyle = {
    backgroundColor: '#555',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  };

  return (
    <div>
      {buttonClicked === null ? (
        // Display the two buttons when no option is selected
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
          <button style={buttonStyle} onClick={() => handleButtonClick('Tourist')}>
            Sign up as Tourist
          </button>
          <button style={buttonStyle} onClick={() => handleButtonClick('TourguideAdvertiserSeller')}>
            Sign up as Tour Guide / Advertiser / Seller
          </button>
        </div>
      ) : buttonClicked === 'Tourist' ? (
        // Display the Tourist registration form
        <div>
          {submitted && <p style={{ color: 'green' }}>Account created successfully!</p>} {/* Optional success message */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Username Field */}
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password must be at least (8) characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
<FormField
  control={form.control}
  name="mobileNumber"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Mobile Number</FormLabel>
      <FormControl>
        <PhoneInput
          id="phone"
          name="mobileNumber" // Match the form name for consistency
          onChange={(value) => {
            // Update the mobile number and trigger validation immediately
            form.setValue('mobileNumber', value, { shouldValidate: true });

            // Trigger validation for the mobileNumber field to update it instantly
            form.trigger("mobileNumber");
          }}
          placeholder="Enter your mobile number"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>



              {/* Nationality Field */}
              <FormField
  control={form.control}
  name="nationality"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Nationality</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? nationalities.find(
                    (nationality) => nationality === field.value
                  )
                : "Select nationality"}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search nationality..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No nationality found.</CommandEmpty>
              <CommandGroup>
                {nationalities.map((nationality) => (
                  <CommandItem
                    value={nationality}
                    key={nationality}
                    onSelect={() => {
                      // Update the nationality field immediately
                      form.setValue("nationality", nationality, { shouldValidate: true });

                      // Trigger validation on the nationality field to update it instantly
                      form.trigger("nationality");
                    }}
                  >
                    {nationality}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        nationality === field.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        This is the nationality that will be used in the dashboard.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>


<FormField
  control={form.control}
  name="dob"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Date of birth</FormLabel>
      <SampleDatePicker value={field.value} onChange={field.onChange} />
      <FormDescription>
        Your date of birth is used to calculate your age.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>




              {/* Status Dropdown */}
              <FormField
          control={form.control}
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
                      <RadioGroupItem value="job" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Job
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Student
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


              <Button type="submit">Create account</Button>
            </form>
          </Form>
        </div>
      ) : buttonClicked === 'TourguideAdvertiserSeller' ? (
        // Display the second form (Tour Guide / Advertiser / Seller)
        <div>
          <h2>Tour Guide / Advertiser / Seller Registration</h2>
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
                      <Input type="password" placeholder="Password must be at least (8) characters" {...field} />
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
                    <FormLabel className="font-normal">
                    Advertiser
                    </FormLabel>
                  </FormItem>
                 
                 
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Seller" />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Seller
                    </FormLabel>
                     </FormItem>


                  <FormItem className="flex items-center space-x-3 space-y-0">
                     <FormControl>
                      <RadioGroupItem value="Tour guide" />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Tour guide
                    </FormLabel>
                    </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">

                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      <Button type="submit">Create account</Button>
        </form>
        </Form>
        </div>
      ) : null}
    </div>
  );
}
