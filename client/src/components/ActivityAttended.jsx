import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  


export default function ActivityAttended() {



    const accounts = [
        { name: "Entertainment" },
        { name: "Theatre" },
        { name: "Concert" },
        { name: "Playful" }
    ]
    
    

    const tableRows = accounts.map((account) => {
        return (
            
            <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="text-right">
                    
                <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Comment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add your comments on the activities or events attended</DialogTitle>
          <DialogDescription>
            Let us know ypur opinion about the activities or events that you attended . Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Comment
            </Label>
            <Input
              id="name"
              defaultValue=""
              className="col-span-3"
            />
          </div>
          
        </div>
        <DialogFooter>
          <Button type="submit">Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
                </TableCell>
            </TableRow>)
    })
    return (
        <div>
            
  
            <Table>
                <TableCaption>A list of activities or events attended</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        

                        
                        <TableHead className="text-right"></TableHead>
                    </TableRow>
                </TableHeader>
                
                <TableBody>
                    
                    {tableRows}
                    
                </TableBody>
            </Table>

        </div>

    )
}