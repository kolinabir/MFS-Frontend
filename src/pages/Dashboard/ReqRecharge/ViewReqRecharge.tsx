// Import statements...

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BounceLoader } from "react-spinners";

interface RechargeRequest {
  _id: string;
  amount: number;
  agentId: {
    _id: string;
    name: string;
    email: string;
  };
  isApproved: boolean;
  __v: number;
}

const ViewReqRecharge = () => {
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const {
    data: rechargeRequests,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["rechargeRequests"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:5000/recharge", {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        });

        return response.data.data;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
  });

  const handleApproveButtonClick = async (request: string) => {
    console.log(request);
    // http://localhost:5000/recharge/65db8cfa8ab52e247830bc00/approve
    try {
      await axios.patch(
        `http://localhost:5000/recharge/${request}/approve`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );

      refetch();
      toast({
        title: `Recharge request approved`,
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
      });
    }
  };

  if (isLoading) {
    return <BounceLoader color="#36d7b7" />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="mt-20">
      <Table className="p-4 mt-14 scroll-auto">
        <TableCaption>Recharge requests</TableCaption>
        <TableHeader className="text-black">
          <TableRow className="text-black font-bold">
            <TableHead className="text-black">Amount</TableHead>
            <TableHead className="text-black">Agent Name</TableHead>
            <TableHead className="text-black">Agent Email</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rechargeRequests?.map((request: RechargeRequest) => (
            <TableRow key={request._id}>
              <TableCell>{request.amount}</TableCell>
              <TableCell>{request.agentId.name}</TableCell>
              <TableCell>{request.agentId.email}</TableCell>
              <TableCell>
                {request.isApproved ? "Approved" : "Pending"}
              </TableCell>
              <TableCell>
                {!request.isApproved && (
                  <Button
                    className=""
                    onClick={() =>
                      handleApproveButtonClick(request.agentId._id)
                    }
                  >
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViewReqRecharge;
