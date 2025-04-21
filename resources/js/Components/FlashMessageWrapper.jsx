import { FlashMessage } from "@/components/FlashMessage";

// Re-export FlashMessage as default export
export default function FlashMessageWrapper(props) {
  return <FlashMessage {...props} />;
}
