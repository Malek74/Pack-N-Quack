import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateDialog from "../shared/CreateDialog";
import DeliveryForm from "../forms/DeliveryForm";
import axios from "axios";
import { useEffect, useState } from "react";
export default function AddressFormWithLayout() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  // Initialize React Hook Form
  const handleViewAddress = async () => {
    try {
      const response = await axios.get("/api/tourist/viewAddress");
      setAddresses(response.data.allAddresses);
      setDefaultAddress(response.data.defaultAddress);
      console.log(response.data);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  useEffect(() => {
    handleViewAddress();
  }, []);

  return (
    <>
      <CreateDialog
        title="Delivery"
        form={<DeliveryForm onRefresh={handleViewAddress} />}
      />
      <Table>
        <TableCaption>A list of addresses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Postal Code</TableHead>
            <TableHead>Town</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Default</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>{address.address}</TableCell>
              <TableCell>{address.postcode}</TableCell>
              <TableCell>{address.town}</TableCell>
              <TableCell>{address.country}</TableCell>
              <TableCell>
                <input type="radio" name="address" value={address.address} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
