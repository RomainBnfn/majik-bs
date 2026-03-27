import { useEffect, useRef, useState } from "react";
import { getFirebaseRef } from "../services/firebase.service.ts";
import { onValue } from "firebase/database";

export const useFirebaseValues = <T, U = any>(
    path: string,
    defaultValue: T = undefined as T,
    transform = (v: U): T => v as T,
): [T, boolean] => {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState(false);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) {
            return;
        }
        let active = true;
        const dataRef = getFirebaseRef(path);
        setLoading(true);
        const unsubscribe = onValue(dataRef, (snapshot) => {
            if (active) {
                setLoading(false);
                const data = snapshot.val();
                initialized.current = true;
                if (data !== undefined) {
                    setData(transform(data));
                }
            }
        });
        return () => {
            unsubscribe();
            initialized.current = false;
            active = false;
        };
    }, [path]);

    return [data, loading];
};
