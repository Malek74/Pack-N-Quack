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
  import { useNavigate } from "react-router-dom";
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import PendingAndResolved from "../shared/PendingAndResolved";
  import FilterButtons from "../shared/FilterButtons";
  export default function SalesReport() {
    return (
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Revenue Stats.</CardDescription>
            {/* <FilterButtons
              buttons={buttons}
              onFilterChange={handleFilterChange}
            /> */}
          </CardHeader>
          <CardContent>
            {" "}
            <Table>
              <TableCaption>A list of complaints.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints?.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell onClick={() => openComplaint(complaint)}>
                      {complaint.title}
                    </TableCell>
                    <TableCell onClick={() => openComplaint(complaint)}>
                      {formatDate(complaint.date)}
                    </TableCell>
                    <TableCell>
                      <PendingAndResolved
                        status={complaint.status}
                        id={complaint._id}
                        onRefresh={fetchComplaints}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{complaints && complaints.length}</strong>{" "}
              complaints
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  