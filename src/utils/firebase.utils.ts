import { type ListObject } from "../models/listObject.model.ts";

export const fromObjectToList = <T extends object>(o: ListObject<T>): T[] => {
    return Object.entries(o).map(([k, v]) => ({ ...v, _id: k }));
};
