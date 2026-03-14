import { firebaseApp } from "../main.jsx";
import { get, getDatabase, push, ref, remove, set } from "firebase/database";

export function getFirebaseRef(path: string) {
    const db = getDatabase(firebaseApp);
    return ref(db, path);
}

export function getFirebaseValue<T>(path: string) {
    return get(getFirebaseRef(path));
}

export function updateFirebaseValue<T>(path: string, value: T) {
    return set(getFirebaseRef(path), value);
}

export async function pushFirebaseValue<T>(path: string, value: T) {
    return push(getFirebaseRef(path), value);
}

export async function removeFirebaseElement(path: string) {
    return remove(getFirebaseRef(path));
}
