import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function PhotoViewer({ 
  isOpen, 
  onClose, 
  imageSrc, 
  title = "Image Preview" 
}) {
  if (!imageSrc) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-2">
          <img 
            src={imageSrc} 
            alt="Full size preview" 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => window.open(imageSrc, '_blank')}
            className="mr-2"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
          <Button onClick={() => onClose(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
