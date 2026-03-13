export type CardModel = {
    id: string;
    name: string;
    image: string;
    defense: number;
    attack: number;
    rarity: {
        id: number;
        name: string;
        color: string;
    };
    description: string;
    basePrice: number;
};
