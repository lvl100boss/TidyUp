import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

const FlashMessage = ({ message, success }) => {
    return (
        message &&
        <Alert className="mb-6" variant={success ? "success" : "destructive"} float="true">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    );
}

// Export as both named and default export for compatibility
export { FlashMessage };
export default FlashMessage;