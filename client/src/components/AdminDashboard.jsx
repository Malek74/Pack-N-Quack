import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState } from "react"


export default function AdminDashboard() {



    const accounts = [
        { id: 1, email: "mariam@gmail.com", username: "maria" },
        { id: 2, email: "ramnito@gmail.com", username: "ramito" },
        { id: 3, email: "manjo@gmail.com", username: "manjp" },
        { id: 4, email: "amir@gmail.com", username: "miro" }
    ]
    const deleteClicked = (id) => {
        console.log(id)
    }

    const tableRows = accounts.map((account) => {
        return (
            <TableRow key={account.id}>
                <TableCell className="font-medium">{account.id}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell className="text-right">
                    <Button onClick={() => deleteClicked(account.id)} variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                    </Button>
                </TableCell>
            </TableRow>)
    })
    return (
        <div>
            <Table>
                <TableCaption>A list of accounts</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Username</TableHead>

                        <TableHead>Email</TableHead>
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableRows}
                </TableBody>
            </Table>

        </div>

    )
    const [selectedCategory,setSelectedCategory]=useState(null)
}