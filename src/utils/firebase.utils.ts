export const fromObjectToList = (o: object) => {
    return Object.entries(o).map(([k, v]) => ({ ...v, _id: k }));
};
