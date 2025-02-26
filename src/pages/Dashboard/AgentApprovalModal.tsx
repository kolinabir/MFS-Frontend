import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Agent {
  _id: string;
  name: string;
  mobileNumber: string;
  email: string;
  role: string;
  nid: string;
  // ...other properties
}

interface AgentApprovalModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (agent: Agent) => Promise<void>;
  isLoading: boolean;
}

const AgentApprovalModal = ({
  agent,
  isOpen,
  onClose,
  onApprove,
  isLoading,
}: AgentApprovalModalProps) => {
  if (!agent) return null;

  const handleApprove = async () => {
    try {
      await onApprove(agent);
      onClose();
    } catch (error) {
      // Error is handled in the parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Agent</DialogTitle>
          <DialogDescription>
            You are about to approve {agent.name} as an agent. This will:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm">
          <p className="flex items-center">
            <span className="mr-2">•</span>
            <span>Verify the agent's account</span>
          </p>
          <p className="flex items-center">
            <span className="mr-2">•</span>
            <span>Provide an initial balance of 100,000</span>
          </p>
          <p className="flex items-center">
            <span className="mr-2">•</span>
            <span>Enable cash in/cash out capabilities</span>
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Approving..." : "Approve Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentApprovalModal;
