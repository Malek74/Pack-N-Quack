import { Button } from "./ui/button"
import { Trash2 } from 'lucide-react';
import { EditProductDialog } from "./EditProduct";
import { Rating } from "./Rating";

export default function ProductCard(props) {
    return (
        <div className="rounded-xl w-[20rem] shadow-md relative overflow-hidden">
            {/* Image Section */}
            <img className="w-full h-[11rem] object-cover rounded-t-lg" src={props.img} alt={props.alt} />
            
            {/* Button Section */}
            <div className="absolute top-4 right-4 flex gap-2">
                {/* Trash Button */}
                <Button className="w-8 h-8 p-1 flex justify-center items-center bg-red-500 text-white rounded-full">
                    <Trash2 />
                </Button>

                {/* Edit Product Dialog Button */}
                <EditProductDialog 
                    product={{
                        name: props.name,
                        price: props.price,
                        description: props.description, // Assuming description is part of props
                        quantity: props.quantity // Assuming quantity is part of props
                    }}
                >
                    <Button className="w-8 h-8 p-1 flex justify-center items-center bg-blue-500 text-white rounded-full">
                        Edit
                    </Button>
                </EditProductDialog>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col gap-2 p-5">
                <div>
                    <h1 className="flex">
                        <span className="font-semibold text-xl mr-auto mb-0">{props.name}</span>
                    </h1>
                    <h2 className="text-gray-500">{props.seller}</h2>

                </div>
                <Rating rating={props.rating} size="medium" numberOfReviews={props.reviewsCount}/>

                <h4 className="text-base line-clamp-2">{props.description}</h4>
                <h4 className="flex">
                    <span className="text-xl text-[#71BCD6] drop-shadow mr-auto">${props.price}</span>
                </h4>
            </div>
        </div>
    );
}
