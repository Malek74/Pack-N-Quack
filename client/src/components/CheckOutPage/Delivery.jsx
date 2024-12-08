/* eslint-disable react/prop-types */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateDialog from "../shared/CreateDialog";
import DeliveryForm from "../forms/DeliveryForm";
import axios from "axios";
import { useEffect, useState } from "react";
export default function AddressFormWithLayout({ addresses, setAddresses }) {
  //const [addresses, setAddresses] = useState([]);
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

  const handleSetDefaultAddress = async (a) => {
    const addressToSend = addresses.find((address) => address.address === a);
    try {
      const response = await axios.post("/api/tourist/setdefault", {
        defaultAddress: addressToSend,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  useEffect(() => {
    handleViewAddress();
  }, []);

  return (
    <Card x-chunk="dashboard-06-chunk-0 " className="flex flex-col flex-1">
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Addresses</CardTitle>
          <CardDescription>Manage all addresses.</CardDescription>
        </div>
        <div className="place-self-end">
          <CreateDialog
            title="Address"
            form={<DeliveryForm onRefresh={handleViewAddress} />}
          />
        </div>
      </CardHeader>
      <CardContent>
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
                  <input
                    type="radio"
                    name="address"
                    value={address.address}
                    onChange={(e) => {
                      handleSetDefaultAddress(e.target.value);
                    }}
                    defaultChecked={address.address === defaultAddress.address}
                  />
                </TableCell>

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
        </CardContent>
      </Card>
    </div>
  );
}
