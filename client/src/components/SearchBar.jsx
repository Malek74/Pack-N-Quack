import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
export default function SearchBar({ searchTerm, setSearchTerm, placeholder }) {
  return (
    <div className="absolute inset-x-0 top-[87.5%] w-full flex justify-center">
      <div className="w-[60%] bg-white rounded-lg p-4 shadow-lg flex justify-center items-center">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Handle changes in search term
          className="p-2 rounded-md w-full border-0"
        />
        <Button className="bg-gold hover:bg-goldhover flex gap-2 text-white px-6 py-3 rounded-md ml-4">
          <Search />
          <p>Search</p>
        </Button>
      </div>
    </div>
  );
}
