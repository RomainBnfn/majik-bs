export type DeckModel = {
    id: string;
    ownerId: string;
    name: string;
    cardIds: Record<string, number>;
};
