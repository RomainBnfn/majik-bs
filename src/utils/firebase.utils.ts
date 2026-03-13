export const fromObjectToList = <T extends object>(o: object): T[] => {
    return Object.entries(o).map(([k, v]) => ({ ...v, _id: k }));
};
