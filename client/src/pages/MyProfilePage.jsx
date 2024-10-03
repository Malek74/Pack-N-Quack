
import MyFirstComponent from "@/components/MyFirstComponent";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { useState, useEffect } from "react";
  import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,SelectGroup,SelectLabel} from "@/components/ui/select"
  import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover"

export default function MyProfilePage() {
const usertype = "tourist"
const tour_guide = usertype==="tour_guide"
const advertiser = usertype==="advertiser"
const seller = usertype==="seller"
const tourist = usertype==="tourist"


       // General Profile Card for all users
const [username, setUsername] = useState("Mariam Maged");
const [email, setEmail] = useState("Marina@gmail.com");
const [password, setPassword] = useState("password123");
 // Editable states for each field
 const [isUsernameEditable, setIsUsernameEditable] = useState(false);
 const [isEmailEditable, setIsEmailEditable] = useState(false);
 const [isPasswordEditable, setIsPasswordEditable] = useState(false);
    // Error states for validation
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    // Validate and save username
    const handleSaveUsername = () => {
        if (!username) {
            setUsernameError("Username cannot be empty.");
        } else {
            setUsernameError(""); // Clear error if valid
            setIsUsernameEditable(false); // Make it non-editable after save
        }
    };
    // Validate and save email
    const handleSaveEmail = () => {
        if (!email) {
            setEmailError("Email cannot be empty.");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError(""); // Clear error if valid
            setIsEmailEditable(false); // Make it non-editable after save
        }
    };
    // Validate and save password
    const handleSavePassword = () => {
        if (!password) {
            setPasswordError("Password cannot be empty.");
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
        } else {
            setPasswordError(""); // Clear error if valid
            setIsPasswordEditable(false); // Make it non-editable after save
        }
    };




// Initial state: Get stored values from local storage if they exist, otherwise set blank
const [mobileNumber, setMobileNumber] = useState(() => localStorage.getItem('mobileNumber') || "");
const [yearsOfExperience, setYearsOfExperience] = useState(() => localStorage.getItem('yearsOfExperience') || "");
const [previousWork, setPreviousWork] = useState(() => localStorage.getItem('previousWork') || "");
// Editable states for each field
const [isMobileEditable, setIsMobileEditable] = useState(true);
const [isExperienceEditable, setIsExperienceEditable] = useState(true);
const [isPreviousWorkEditable, setIsPreviousWorkEditable] = useState(true);
// Validation state
const [mobileError, setMobileError] = useState("");
const [experienceError, setExperienceError] = useState("");
// Use effect to store values to local storage on change
useEffect(() => {
    localStorage.setItem('mobileNumber', mobileNumber);
    localStorage.setItem('yearsOfExperience', yearsOfExperience);
    localStorage.setItem('previousWork', previousWork);
}, [mobileNumber, yearsOfExperience, previousWork]);
// Save handler with validation
const handleSaveMobile = () => {
    if (!mobileNumber || mobileNumber.length !== 11) {
        setMobileError("Mobile number must be exactly 11 digits.");
    } else {
        setMobileError(""); // Clear error if valid
        setIsMobileEditable(false); // Save and make it non-editable
    }
};
const handleSaveExperience = () => {
    if (!yearsOfExperience) {
        setExperienceError("Years of experience is required.");
    } else {
        setExperienceError(""); // Clear error if valid
        setIsExperienceEditable(false); // Save and make it non-editable
    }
};






    //States for Advertiser fields
    const [website, setWebsite] = useState("");
    const [hotline, setHotline] = useState("");
    const [companyProfile, setCompanyProfile] = useState("");
    // Editable states for Advertiser fields
    const [isWebsiteEditable, setIsWebsiteEditable] = useState(false);
    const [isHotlineEditable, setIsHotlineEditable] = useState(false);
    const [isCompanyProfileEditable, setIsCompanyProfileEditable] = useState(false);
    // Error states for Advertiser fields
    const [websiteError, setWebsiteError] = useState("");
    const [hotlineError, setHotlineError] = useState("");
    const [companyProfileError, setCompanyProfileError] = useState("");
    // Validate and save website
    const handleSaveWebsite = () => {
        if (!website) {
            setWebsiteError("Website cannot be empty.");
        } else {
            setWebsiteError(""); // Clear error if valid
            setIsWebsiteEditable(false); // Make it non-editable after save
        }
    };
    // Validate and save hotline
    const handleSaveHotline = () => {
        if (!hotline) {
            setHotlineError("Hotline cannot be empty.");
        } else if (!/^\d{10}$/.test(hotline)) {
            setHotlineError("Hotline must be 10 digits.");
        } else {
            setHotlineError(""); // Clear error if valid
            setIsHotlineEditable(false); // Make it non-editable after save
        }
    };
    // Validate and save company profile
    const handleSaveCompanyProfile = () => {
        if (!companyProfile) {
            setCompanyProfileError("Company profile cannot be empty.");
        } else {
            setCompanyProfileError(""); // Clear error if valid
            setIsCompanyProfileEditable(false); // Make it non-editable after save
        }
    };





    //Initial state for Seller fields
    const [sellerName, setSellerName] = useState(() => localStorage.getItem('sellerName') || "");
    const [sellerDescription, setSellerDescription] = useState(() => localStorage.getItem('sellerDescription') || "");
    const [isSellerNameEditable, setIsSellerNameEditable] = useState(true);
    const [isSellerDescriptionEditable, setIsSellerDescriptionEditable] = useState(true);
    const [sellerNameError, setSellerNameError] = useState("");
    const [sellerDescriptionError, setSellerDescriptionError] = useState("");
    // Use effect to store values to local storage on change
    useEffect(() => {
        localStorage.setItem('sellerName', sellerName);
        localStorage.setItem('sellerDescription', sellerDescription);
    }, [sellerName, sellerDescription]);
    // Save handler with validation for Seller name
    const handleSaveSellerName = () => {
        if (!sellerName) {
            setSellerNameError("Seller name is required.");
        } else {
            setSellerNameError(""); // Clear error if valid
            setIsSellerNameEditable(false); // Save and make it non-editable
        }
    };
    // Save handler with validation for Seller description
    const handleSaveSellerDescription = () => {
        if (!sellerDescription) {
            setSellerDescriptionError("Seller description is required.");
        } else {
            setSellerDescriptionError(""); // Clear error if valid
            setIsSellerDescriptionEditable(false); // Save and make it non-editable
        }
    };
    






// Tourist Profile Fields
const [touristNumber, setTouristNumber] = useState(() => localStorage.getItem('touristNumber') || "01234567890"); // Example value
const [nationality, setNationality] = useState(() => localStorage.getItem('touristNationality') || "American"); // Example value
const [dob, setDob] = useState(() => localStorage.getItem('touristDOB') || "2000-01-01"); // Example value
const [jobOrStudent, setJobOrStudent] = useState(() => localStorage.getItem('touristJobOrStudent') || "Student"); // Example value
const [wallet, setWallet] = useState(() => localStorage.getItem('touristWallet') || ""); // Example value

// Editable states for each field
const [isTouristNumberEditable, setIsTouristNumberEditable] = useState(false);
const [isNationalityEditable, setIsNationalityEditable] = useState(false);
const [isDobEditable, setIsDobEditable] = useState(false);
const [isJobOrStudentEditable, setIsJobOrStudentEditable] = useState(false);
const [isWalletEditable, setIsWalletEditable] = useState(true); // Initially editable

// Validation states
const [touristNumberError, setTouristNumberError] = useState("");
const [nationalityError, setNationalityError] = useState("");
const [dobError, setDobError] = useState("");
const [jobOrStudentError, setJobOrStudentError] = useState("");
const [walletError, setWalletError] = useState("");

// Save handlers with validation
const handleSaveTouristNumber = () => {
    if (!touristNumber || touristNumber.length !== 11) {
        setTouristNumberError("Tourist number must be exactly 11 digits.");
    } else {
        setTouristNumberError(""); // Clear error if valid
        setIsTouristNumberEditable(false); // Save and make it non-editable
    }
};

const handleSaveNationality = () => {
    if (!nationality) {
        setNationalityError("Nationality is required.");
    } else {
        setNationalityError(""); // Clear error if valid
        setIsNationalityEditable(false); // Save and make it non-editable
    }
};

const handleSaveDob = () => {
    if (!dob) {
        setDobError("Date of birth is required.");
    } else {
        setDobError(""); // Clear error if valid
        setIsDobEditable(false); // Save and make it non-editable
    }
};

const handleSaveJobOrStudent = () => {
    if (!jobOrStudent) {
        setJobOrStudentError("Job/Student status is required.");
    } else {
        setJobOrStudentError(""); // Clear error if valid
        setIsJobOrStudentEditable(false); // Save and make it non-editable
    }
};

// Save handler for Wallet
const handleSaveWallet = () => {
    if (!wallet) {
        setWalletError("Wallet must be filled.");
    } else {
        setWalletError(""); // Clear error if valid
        setIsWalletEditable(false); // Make wallet non-editable
    }
};

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


 


// General Profile Card for all users with editable fields
const renderUserProfileFields = () => (
    <Card className="my-4">
        <CardHeader>
            <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Username Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        readOnly={!isUsernameEditable} // Field is read-only unless 'Edit' is clicked
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isUsernameEditable ? 'bg-gray-100' : 'bg-white'}`}
                    />
                    {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isUsernameEditable) {
                            handleSaveUsername(); // Validate and save
                        } else {
                            setIsUsernameEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isUsernameEditable ? "Save" : "Edit"}
                </Button>
            </div>
            
            {/* Email Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEmailEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isEmailEditable ? 'bg-gray-100' : 'bg-white'}`}
                    />
                    {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isEmailEditable) {
                            handleSaveEmail(); // Validate and save
                        } else {
                            setIsEmailEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isEmailEditable ? "Save" : "Edit"}
                </Button>
            </div>

            {/* Password Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        readOnly={!isPasswordEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isPasswordEditable ? 'bg-gray-100' : 'bg-white'}`}
                    />
                    {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isPasswordEditable) {
                            handleSavePassword(); // Validate and save
                        } else {
                            setIsPasswordEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isPasswordEditable ? "Save" : "Edit"}
                </Button>
            </div>
        </CardContent>
    </Card>
);

   

      // Function for rendering Tour Guide specific fields
      const renderTourGuideFields = () => (
        <Card className="my-4">
            <CardHeader>
                <CardTitle>Tour Guide Information</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Mobile Number Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            readOnly={!isMobileEditable}
                            maxLength="11"
                            placeholder="Enter your 11-digit mobile number"
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isMobileEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {mobileError && (
                            <p className="text-red-600 text-sm mt-1">
                                {mobileError}
                            </p>
                        )}
                    </div>
                    <Button 
                        onClick={() => {
                            if (isMobileEditable) {
                                handleSaveMobile(); // Validate and save
                            } else {
                                setIsMobileEditable(true); // Make it editable
                            }
                        }}
                        className="ml-4"
    
                    >
                        {isMobileEditable ? "Save" : "Edit"}
                    </Button>
                </div>

                {/* Years of Experience Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
                        <input
                            type="number"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            readOnly={!isExperienceEditable}
                            placeholder="Enter your years of experience"
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isExperienceEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {experienceError && (
                            <p className="text-red-600 text-sm mt-1">
                                {experienceError}
                            </p>
                        )}
                    </div>
                    <Button 
                    onClick={() => {
                        if (isExperienceEditable) {
                            handleSaveExperience(); // Validate and save
                        } else {
                            setIsExperienceEditable(true); // Make it editable
                        }
                    }}
                    className="ml-4"

                    >
                        {isExperienceEditable ? "Save" : "Edit"}
                    </Button>
                </div>

                {/* Previous Work Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Previous Work</label>
                        <textarea
                            value={previousWork}
                            onChange={(e) => setPreviousWork(e.target.value)}
                            readOnly={!isPreviousWorkEditable}
                            placeholder="Enter your previous work (if any)"
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isPreviousWorkEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                    </div>
                    <Button 
                        onClick={() => {
                            if (isPreviousWorkEditable) {
                                // Save logic for previous work can be added here if needed
                                setIsPreviousWorkEditable(false); // Save and make it non-editable
                            } else {
                                setIsPreviousWorkEditable(true); // Make it editable
                            }
                        }}
                        className="ml-4"
    
                    >
                        {isPreviousWorkEditable ? "Save" : "Edit"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );


    // Function for rendering Advertiser specific fields
    const renderAdvertiserFields = () => (
        <Card className="my-4">
            <CardHeader>
                <CardTitle>Advertiser Information</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Website Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            readOnly={!isWebsiteEditable}
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isWebsiteEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {websiteError && <p className="text-red-600 text-sm mt-1">{websiteError}</p>}
                    </div>
                    <Button 
                        onClick={() => {
                            if (isWebsiteEditable) {
                                handleSaveWebsite(); // Validate and save
                            } else {
                                setIsWebsiteEditable(true); // Make it editable
                            }
                        }} 
                        className="ml-4"
                    >
                        {isWebsiteEditable ? "Save" : "Edit"}
                    </Button>
                </div>

                {/* Hotline Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Hotline</label>
                        <input
                            type="text"
                            value={hotline}
                            onChange={(e) => setHotline(e.target.value)}
                            readOnly={!isHotlineEditable}
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isHotlineEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {hotlineError && <p className="text-red-600 text-sm mt-1">{hotlineError}</p>}
                    </div>
                    <Button 
                        onClick={() => {
                            if (isHotlineEditable) {
                                handleSaveHotline(); // Validate and save
                            } else {
                                setIsHotlineEditable(true); // Make it editable
                            }
                        }} 
                        className="ml-4"
                    >
                        {isHotlineEditable ? "Save" : "Edit"}
                    </Button>
                </div>

                {/* Company Profile Field */}
                <div className="mb-4 flex items-center">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">Company Profile</label>
                        <input
                            type="text"
                            value={companyProfile}
                            onChange={(e) => setCompanyProfile(e.target.value)}
                            readOnly={!isCompanyProfileEditable}
                            className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isCompanyProfileEditable ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {companyProfileError && <p className="text-red-600 text-sm mt-1">{companyProfileError}</p>}
                    </div>
                    <Button 
                        onClick={() => {
                            if (isCompanyProfileEditable) {
                                handleSaveCompanyProfile(); // Validate and save
                            } else {
                                setIsCompanyProfileEditable(true); // Make it editable
                            }
                        }} 
                        className="ml-4"
                    >
                        {isCompanyProfileEditable ? "Save" : "Edit"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );


// Function for rendering Seller specific fields
const renderSellerFields = () => (
    <Card className="my-4">
        <CardHeader>
            <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Seller Name Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Seller Name</label>
                    <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        readOnly={!isSellerNameEditable}
                        placeholder="Enter seller name"
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isSellerNameEditable ? 'bg-gray-100' : 'bg-white'}`}
                    />
                    {sellerNameError && (
                        <p className="text-red-600 text-sm mt-1">
                            {sellerNameError}
                        </p>
                    )}
                </div>
                <Button 
                    onClick={() => {
                        if (isSellerNameEditable) {
                            handleSaveSellerName(); // Validate and save
                        } else {
                            setIsSellerNameEditable(true); // Make it editable
                        }
                    }}
                    className="ml-4"
                >
                    {isSellerNameEditable ? "Save" : "Edit"}
                </Button>
            </div>

            {/* Seller Description Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Seller Description</label>
                    <textarea
                        value={sellerDescription}
                        onChange={(e) => setSellerDescription(e.target.value)}
                        readOnly={!isSellerDescriptionEditable}
                        placeholder="Enter seller description"
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${!isSellerDescriptionEditable ? 'bg-gray-100' : 'bg-white'}`}
                    />
                    {sellerDescriptionError && (
                        <p className="text-red-600 text-sm mt-1">
                            {sellerDescriptionError}
                        </p>
                    )}
                </div>
                <Button 
                    onClick={() => {
                        if (isSellerDescriptionEditable) {
                            handleSaveSellerDescription(); // Validate and save
                        } else {
                            setIsSellerDescriptionEditable(true); // Make it editable
                        }
                    }}
                    className="ml-4"
                >
                    {isSellerDescriptionEditable ? "Save" : "Edit"}
                </Button>
            </div>
        </CardContent>
    </Card>
);





// Method to render Tourist Fields
const renderTouristFields = () => (
    <Card className="my-4">
        <CardHeader>
            <CardTitle>Tourist Information</CardTitle>
        </CardHeader>
        <CardContent>

            {/* Tourist Number Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Tourist Number</label>
                    <input
                        type="text"
                        value={touristNumber}
                        onChange={(e) => setTouristNumber(e.target.value)}
                        readOnly={!isTouristNumberEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${touristNumberError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touristNumberError && <p className="text-red-600 text-sm mt-1">{touristNumberError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isTouristNumberEditable) {
                            handleSaveTouristNumber(); // Validate and save
                        } else {
                            setIsTouristNumberEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isTouristNumberEditable ? "Save" : "Edit"}
                </Button>
            </div>

            {/* Nationality Field (Select Dropdown) */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Nationality</label>
                    <Select onValueChange={(value) => setNationality(value)}>
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
                    {nationalityError && <p className="text-red-600 text-sm mt-1">{nationalityError}</p>}
                </div>
            </div>

            {/* Date of Birth Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        readOnly={!isDobEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${dobError ? 'border-red-500' : 'border-gray-300'}`}

                    />
                    {dobError && <p className="text-red-600 text-sm mt-1">{dobError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isDobEditable) {
                            handleSaveDob(); // Validate and save
                        } else {
                            setIsDobEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isDobEditable ? "Save" : "Edit"}
                </Button>
            </div>

            {/* Job/Student Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Job/Student</label>
                    <input
                        type="text"
                        value={jobOrStudent}
                        onChange={(e) => setJobOrStudent(e.target.value)}
                        readOnly={!isJobOrStudentEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${jobOrStudentError ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {jobOrStudentError && <p className="text-red-600 text-sm mt-1">{jobOrStudentError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isJobOrStudentEditable) {
                            handleSaveJobOrStudent(); // Validate and save
                        } else {
                            setIsJobOrStudentEditable(true); // Make it editable
                        }
                    }} 
                    className="ml-4"
                >
                    {isJobOrStudentEditable ? "Save" : "Edit"}
                </Button>
            </div>

            {/* Wallet Field */}
            <div className="mb-4 flex items-center">
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">Wallet</label>
                    <input
                        type="text"
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)} // Allow wallet to be set only once
                        readOnly={!isWalletEditable}
                        className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${walletError ? 'border-red-500' : 'border-gray-300'}`}

                    />
                    {walletError && <p className="text-red-600 text-sm mt-1">{walletError}</p>}
                </div>
                <Button 
                    onClick={() => {
                        if (isWalletEditable) {
                            handleSaveWallet(); // Validate and save
                        } else {
                            // Wallet already filled, cannot be edited
                        }
                    }} 
                    className="ml-4"
                >
                    {isWalletEditable ? "Save" : "Filled"}
                </Button>
            </div>
        </CardContent>
    </Card>
);    



    return (
        <>
            <MyFirstComponent pageName="MyProfile" />
            <h1>This is my profile</h1>

            {renderUserProfileFields()}
            {tour_guide && renderTourGuideFields()}
            {advertiser && renderAdvertiserFields()}
            {seller && renderSellerFields()}
            {tourist && renderTouristFields()}
        </>
    );
}



