export type DeckModel = {
    ownerId: string;
    name: string;
    cardIds: Record<string, number>;
};
