import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PdfViewerDialog from "../shared/PdfViewerDialog";
import { Check, X } from "lucide-react";
export default function DocumentReview() {
  const { toast } = useToast();
  const [advertisers, setAdvertisers] = useState();
  const [sellers, setSellers] = useState();
  const [tourGuides, setTourGuides] = useState();
  const fetchAdvertisers = () => {
    axios
      .post("/api/upload/fetchAllDocuments", { userType: "advertisers" })
      .then((response) => {
        setAdvertisers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSellers = () => {
    axios
      .post("/api/upload/fetchAllDocuments", { userType: "seller" })
      .then((response) => {
        setSellers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const fetchTourGuides = () => {
    axios
      .post("/api/upload/fetchAllDocuments", { userType: "tourGuide" })
      .then((response) => {
        setTourGuides(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    fetchTourGuides();
    fetchAdvertisers(); // Initial fetch when component mounts
    fetchSellers();
  }, []);
  const handleReject = async (userId, userType) => {
    try {
      const response = await axios.put(`/api/admins/isAccepted`, {
        userId: userId,
        userType: userType,
        flag: false,
      });
      console.log(response.data);
      toast({
        variant: "default",
        title: "",
        description: "User Rejected and Deleted from System!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    }
    fetchTourGuides();
    fetchAdvertisers(); // Initial fetch when component mounts
    fetchSellers();
  };
  const handleAccept = async (userId, userType) => {
    try {
      const response = await axios.put(`/api/admins/isAccepted`, {
        userId: userId,
        userType: userType,
        flag: true,
      });
      console.log(response.data);
      toast({
        variant: "default",
        title: "",
        description: "User Accepted into System!",
      });
      fetchTourGuides();
      fetchAdvertisers(); // Initial fetch when component mounts
      fetchSellers();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: error.response.data.message,
      });
    }
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Advertisers</CardTitle>
          <CardDescription>View Advertiser documents</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of advertisers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Taxation Registry Card</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advertisers &&
                advertisers.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[0]}
                      />
                    </TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[1]}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <Check
                          size={24}
                          className="text-green-500"
                          onClick={() =>
                            handleAccept(account._id, "Advertiser")
                          }
                        />
                        <X
                          size={24}
                          className="text-red-500"
                          onClick={() =>
                            handleReject(account._id, "Advertiser")
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{advertisers && advertisers.length}</strong>{" "}
            accounts
          </div>
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Sellers</CardTitle>
          <CardDescription>View Seller documents</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of sellers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Taxation Registry Card</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers &&
                sellers.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[0]}
                      />
                    </TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[1]}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <Check
                          size={24}
                          className="text-green-500"
                          onClick={() => handleAccept(account._id, "Seller")}
                        />
                        <X
                          size={24}
                          className="text-red-500"
                          onClick={() => handleReject(account._id, "Seller")}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{sellers && sellers.length}</strong> accounts
          </div>
        </CardFooter>
      </Card>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Tour Guides</CardTitle>
          <CardDescription>View Tour Guides documents</CardDescription>
        </CardHeader>
        <CardContent>
          {" "}
          <Table>
            <TableCaption>A list of tour guides.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Certificate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tourGuides &&
                tourGuides.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[0]}
                      />
                    </TableCell>
                    <TableCell>
                      <PdfViewerDialog
                        src={account.uploadedFiles.documents[1]}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <Check
                          size={24}
                          className="text-green-500"
                          onClick={() =>
                            handleAccept(account._id, "Tour Guide")
                          }
                        />
                        <X
                          size={24}
                          className="text-red-500"
                          onClick={() =>
                            handleReject(account._id, "Tour Guide")
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{tourGuides && tourGuides.length}</strong> accounts
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
