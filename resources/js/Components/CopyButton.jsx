import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust based on your setup
import { Copy, CopyCheck } from "lucide-react";

const CopyButton = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000); // Revert back after 3 seconds
        });
    };

    return (
        <Button onClick={handleCopy} size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            {copied ? <CopyCheck /> : <Copy />}
        </Button>
    );
};

export default CopyButton;
