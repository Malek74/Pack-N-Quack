/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Input } from "./ui/input";

export default function EditOpeningHours({ onOpeningHoursChange }) {

    const [openingHours, setOpeningHours] = useState({
        Monday: { open: false, openingTime: "", closingTime: "" },
        Tuesday: { open: false, openingTime: "", closingTime: "" },
        Wednesday: { open: false, openingTime: "", closingTime: "" },
        Thursday: { open: false, openingTime: "", closingTime: "" },
        Friday: { open: false, openingTime: "", closingTime: "" },
        Saturday: { open: false, openingTime: "", closingTime: "" },
        Sunday: { open: false, openingTime: "", closingTime: "" },
    });

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [selectedDay, setSelectedDay] = useState("Monday");

    const handleToggle = (day) => {
        setOpeningHours((prev) => ({
            ...prev,
            [day]: { ...prev[day], open: !prev[day].open }
        }));
    };

    const handleTimeChange = (day, type, value) => {
        setOpeningHours((prev) => ({
            ...prev,
            [day]: { ...prev[day], [type]: value }
        }));
    };

    const handleDayChange = (day) => {
        setSelectedDay(day);
    };

    // useEffect(() => {
    //     if (onOpeningHoursChange) {
    //         onOpeningHoursChange(openingHours); // Call the callback whenever the opening hours change
    //     }
    // }, [openingHours, onOpeningHoursChange]);

    const handleSave = () => {
        if (onOpeningHoursChange) {
            onOpeningHoursChange(openingHours); // Call the callback whenever the opening hours change
        }
    };



    return (
        <Dialog>
            <DialogTrigger><Label className="w-min text-black hover:text-gray-500 underline">Edit Opening Hours</Label></DialogTrigger>
            <DialogContent>
                <div className="p-6">
                    <h2 className="text-2xl mb-4">Edit Opening Hours</h2>

                    {/* Show updated opening hours */}
                    <div className="mb-6">
                        <h3 className="text-xl mb-2">Current Opening Hours:</h3>
                        {daysOfWeek.map((day) => (
                            <div key={day} className="flex justify-between mb-2">
                                <span className="font-semibold">{day}:</span>
                                {openingHours[day]?.open ? (
                                    <span>
                                        {openingHours[day].openingTime} - {openingHours[day].closingTime}
                                    </span>
                                ) : (
                                    <span>Closed</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Day Selector */}
                    <Select onValueChange={handleDayChange} value={selectedDay}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                        <SelectContent>
                            {daysOfWeek.map((day, idx) => (
                                <SelectItem key={idx} value={day}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Open/Closed Toggle */}
                    <div className="flex items-center mt-4">
                        <label className="mr-4">Open:</label>
                        <Switch
                            checked={openingHours[selectedDay]?.open}
                            onCheckedChange={() => handleToggle(selectedDay)}
                        />
                    </div>

                    {/* If open, show the opening and closing time inputs */}
                    {openingHours[selectedDay]?.open && (
                        <div className="mt-4 space-y-4">
                            <div>
                                <label>Opening Time:</label>
                                <Input
                                    type="time"
                                    value={openingHours[selectedDay].openingTime}
                                    onChange={(e) => handleTimeChange(selectedDay, "openingTime", e.target.value)}
                                    className="w-full mt-2"
                                />
                            </div>
                            <div>
                                <label>Closing Time:</label>
                                <Input
                                    type="time"
                                    value={openingHours[selectedDay].closingTime}
                                    onChange={(e) => handleTimeChange(selectedDay, "closingTime", e.target.value)}
                                    className="w-full mt-2"
                                />
                            </div>
                        </div>
                    )}

                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button onClick={handleSave} className="mt-6">Save Changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}