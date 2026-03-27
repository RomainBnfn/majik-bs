export type WithId<T extends object> = T & {
    _id: string;
};
