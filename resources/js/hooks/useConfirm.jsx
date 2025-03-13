import { useState, useCallback } from "react";

export function useConfirm() {
    const [promise, setPromise] = useState(null);

    const confirm = useCallback((message) => {
        const promise = new Promise((resolve) => {
            const confirmed = window.confirm(message);
            resolve(confirmed);
        });
        setPromise(promise);
        return promise;
    }, []);

    return { confirm, promise };
}
