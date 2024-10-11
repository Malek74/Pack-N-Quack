/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
    DialogClose,
    DialogTitle
} from "@/components/ui/dialog"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useState } from "react";
import { Input } from "../ui/input";

export default function TicketPriceEditor({ initialTickets = [], onTicketsChange }) {
    const [tickets, setTickets] = useState(initialTickets);
    const [newTicketType, setNewTicketType] = useState("");
    const [newTicketPrice, setNewTicketPrice] = useState("");

    // Function to handle adding a new ticket
    const handleAddTicket = () => {

        if (newTicketType && newTicketPrice && !isNaN(newTicketPrice)) {
            const existingTicket = tickets.find(ticket => ticket.type === newTicketType);
            if (!existingTicket) {
                const updatedTickets = [
                    ...tickets,
                    { type: newTicketType, price: Number(newTicketPrice) }
                ];
                setTickets(updatedTickets);
                onTicketsChange(updatedTickets);
                setNewTicketType("");
                setNewTicketPrice("");
            } else {
                alert("Ticket type already exists!");
            }
        } else {
            alert("Please enter a valid ticket type and price.");
        }
    };

    // Function to handle price changes
    const handlePriceChange = (index, newPrice) => {
        const updatedTickets = tickets.map((ticket, i) =>
            i === index ? { ...ticket, price: Number(newPrice) } : ticket
        );
        setTickets(updatedTickets);
        onTicketsChange(updatedTickets); // Update the parent
    };

    // Function to remove a ticket
    const handleRemoveTicket = (index) => {
        const updatedTickets = tickets.filter((_, i) => i !== index);
        setTickets(updatedTickets);
        onTicketsChange(updatedTickets); // Update the parent
    };

    return (
        <Dialog>
            <DialogTrigger><Label className="w-min text-black hover:text-gray-500 underline">Edit Tickets Price</Label></DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Tickets Price</DialogTitle>
                <div>
                    <h3 className="text-xl font-bold mb-4">Ticket Prices</h3>
                    <div className="flex flex-col space-y-4 mb-6">
                        {tickets && tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    {/* Debugging Log */}
                                    <span className="w-32">{ticket?.type || "Unknown Type"}</span>
                                    <Input
                                        type="number"
                                        value={ticket?.price || 0}
                                        onChange={(e) => handlePriceChange(index, e.target.value)}
                                        className="w-32"
                                    />
                                    <Button onClick={() => handleRemoveTicket(index)} variant="destructive">
                                        Remove
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>No tickets available</p>
                        )}
                    </div>

                    <h4 className="text-lg font-bold mb-2">Add New Ticket Type</h4>
                    <div className="flex items-center space-x-4 mb-4">
                        <Input
                            placeholder="Type"
                            value={newTicketType}
                            onChange={(e) => setNewTicketType(e.target.value)}
                            className="w-32"
                        />
                        <Input
                            type="number"
                            placeholder="Price"
                            value={newTicketPrice}
                            onChange={(e) => setNewTicketPrice(e.target.value)}
                            className="w-32"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose>
                        <Button onClick={handleAddTicket}>Add Ticket</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}