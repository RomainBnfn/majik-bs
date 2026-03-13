import { firebaseApp } from "../main.jsx";
import { getDatabase, ref, set } from "firebase/database";

export function getFirebaseRef(path: string) {
    const db = getDatabase(firebaseApp);
    return ref(db, path);
}

export function updateFirebaseValue<T>(path: string, value: T) {
    return set(getFirebaseRef(path), value);
}
