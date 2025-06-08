import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500): T {
    const [ debouncedValue, setDebouncedValue ] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [ value, delay ]);

    return debouncedValue;
}

export function useDebounceLoad<T>(value: T, delay = 500) {
    const [ debouncedValue, setDebouncedValue ] = useState(value);
    const [ isLoading, setIsLoading ] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const handler = setTimeout(() => {
            setDebouncedValue(value);
            setIsLoading(false);
        }, delay);

        return () => clearTimeout(handler);
    }, [ value, delay ]);

    return { value: debouncedValue, isLoading }
}