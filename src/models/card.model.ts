import type { WithId } from "./withId.model.ts";
import { type ListObject } from "./listObject.model.ts";
import type { FirebasePowerModel, PowerModel } from "./power.model.ts";

export type CardModel = WithId<{
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
    powers: PowerModel[];
}>;

export type FirebaseCardModel = {
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
    powers: ListObject<FirebasePowerModel>;
};
