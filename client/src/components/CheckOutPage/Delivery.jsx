import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CreateDialog from "../shared/CreateDialog";
import DeliveryForm from "../forms/DeliveryForm";

// Define zod schema for main and extra addresses
const addressSchema = z.object({
  address: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town is required"),
  postcode: z.string().min(1, "Postcode is required"),
  nationality: z.string().min(1, "Nationality is required"),
});

const schema = z.object({
  mainAddress: addressSchema,
  extraAddresses: z.array(addressSchema.optional()),
});

export default function AddressFormWithLayout() {
  // Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mainAddress: {
        address: "",
        town: "",
        postcode: "",
        nationality: "",
      },
      extraAddresses: [
        {
          address: "",
          town: "",
          postcode: "",
          nationality: "",
        },
      ],
    },
  });

  // UseFieldArray for managing extra addresses
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraAddresses",
  });

  // Handle form submission
  const onSubmit = async (values) => {
    console.log("Submitted values:", values);
    // Add your logic here
  };
  const CreateButton = () => {
    return <CreateDialog title="Delivery" form={<DeliveryForm />} />;
  };

  return (
    <>
      <CreateDialog title="Delivery" form={<DeliveryForm />} />
      <Table>
        <TableCaption>A list of addresses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>123 Maple Street</TableCell>
            <TableCell>New York, NY</TableCell>
            <TableCell>
              <input type="radio" name="address" value="John Doe" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>456 Oak Avenue</TableCell>
            <TableCell>Los Angeles, CA</TableCell>
            <TableCell>
              <input type="radio" name="address" value="Jane Smith" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Emily Johnson</TableCell>
            <TableCell>789 Pine Lane</TableCell>
            <TableCell>Chicago, IL</TableCell>
            <TableCell>
              <input type="radio" name="address" value="Emily Johnson" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Michael Brown</TableCell>
            <TableCell>321 Birch Road</TableCell>
            <TableCell>Houston, TX</TableCell>
            <TableCell>
              <input type="radio" name="address" value="Michael Brown" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
