// use-scroll-behavior.tsx
import { useEffect } from "react";

function useScrollBehavior(isOpen) {
    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.scrollBehavior = "auto";
        } else {
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = "smooth";
            }, 1000);
        }
    }, [isOpen]);
}

export default useScrollBehavior;
