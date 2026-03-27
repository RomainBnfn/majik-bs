import { type Dispatch, type SetStateAction, useState } from "react";

const BASE_LOCAL_STORAGE_PATH = "localStorageState";

const getLocalStoragePath = (path: string) =>
    `${BASE_LOCAL_STORAGE_PATH}.${path}`;

export const useLocalStorageState = <T>(
    path: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] => {
    const storedValue = localStorage.getItem(getLocalStoragePath(path));
    const [value, setValue] = useState<T>(storedValue ?? initialValue);

    const updateValue = (action: SetStateAction<T>) => {
        const newVal = action instanceof Function ? action(value) : action;
        localStorage.setItem(getLocalStoragePath(path), newVal);
        setValue(newVal);
    };

    return [value, updateValue];
};
