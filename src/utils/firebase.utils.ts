import { type ListObject } from "../models/listObject.model.ts";
import type { WithId } from "../models/withId.model.ts";

export const fromObjectToList = <T extends object>(
    o: ListObject<T>,
): WithId<T>[] => {
    return Object.entries(o).map(([k, v]) => ({ ...v, _id: k }));
};
