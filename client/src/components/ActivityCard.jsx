// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTrigger,
//     DialogFooter,
//     DialogClose
// } from "@/components/ui/dialog"
// import Button from "./ui/button"

export default function activityCard(props) {
    return (
        <div className="container rounded-lg w-[25rem] h-[22rem] shadow-md">
            <img className=" w-[25rem] rounded-lg mb-4" src={props.img} alt={props.alt} />
            <div className="flex flex-col gap-2">
                <h1 className=" flex"> <span className="font-semibold text-xl mr-auto">{props.name} </span><span className="text-primary drop-shadow">{props.category}</span></h1>
                <h4 className="text-base">{props.time}</h4>
                <h4 className="text-base">{props.location} <br />
                    {/* <Dialog>
                        <DialogTrigger>Open in Maps</DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogDescription>
                                    MAPS POPUP SHOULD BE HERE!
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> */}
                </h4>
                <h4 className="flex"> <span className="text-base text-secondary drop-shadow mr-auto">{props.price} </span><span className="text-gray-500 ml-auto">{props.tags}</span></h4>
            </div>
        </div>
    )
}