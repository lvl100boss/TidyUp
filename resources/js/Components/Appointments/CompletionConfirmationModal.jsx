import React from 'react';
import { useForm } from "@inertiajs/react";
import { CheckCircle, XCircle, Receipt } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

export default function CompletionConfirmationModal({ appointment, open, onOpenChange }) {
  const { post, processing } = useForm({
    appointment_id: appointment?.id,
  });

  const handleConfirm = () => {
    post(route('appointments.confirm-completion'), {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  // Use fallback values if the properties aren't available
  const shopName = appointment?.shop?.shop_name || 'The shop';
  const serviceName = appointment?.appointmentServices?.[0]?.shopService?.service_name || 'your service';
  const staffName = appointment?.completed_by_staff?.staff?.name || 'A staff member';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appointment Completion Verification</DialogTitle>
          <DialogDescription>
            {staffName} from {shopName} has marked your {serviceName} appointment as completed.
            Please confirm if this service was actually completed to your satisfaction.
          </DialogDescription>
        </DialogHeader>
        
        <div>
          <Link href={route('appointment.view', { id: appointment?.id, skipModal: true })}>
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              View Appointment Details
            </Button>
          </Link>
        </div>
        
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => window.location.href = route('user.feedback')}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
          
          <Button 
            variant="default"
            disabled={processing}
            onClick={handleConfirm}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirm Completion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}