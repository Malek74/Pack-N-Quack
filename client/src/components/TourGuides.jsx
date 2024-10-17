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
  


export default function TourGuides() {



    const accounts = [
        { id: 1,  username: "mariam" },
        { id: 2,  username: "ramito" },
        { id: 3,  username: "manjp" },
        { id: 4,  username: "miro" }
    ]
    
    

    const tableRows = accounts.map((account) => {
        return (
            
            <TableRow key={account.id}>
                <TableCell className="font-medium">{account.id}</TableCell>
                <TableCell>{account.username}</TableCell>
                
                <TableCell className="text-right">
                <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Comment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add your comments on your tour guide</DialogTitle>
          <DialogDescription>
            Let us know ypur opinion about the tour guide that you completed our tour with. Click save when you are done.
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
                <TableCaption>A list of tour guides</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Username</TableHead>

                        
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