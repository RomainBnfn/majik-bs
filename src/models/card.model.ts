import type { WithId } from "./withId.model.ts";

export type CardModel = WithId<{
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
    canBePicked?: boolean;
}>;
