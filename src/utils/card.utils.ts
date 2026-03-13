import type { BrawlerModel } from "../models/brawler.model.ts";
import type { CardType } from "../models/card.model.ts";
import { getRandomInt } from "./random.utils.ts";

const MAX_STATISTIC = 10;

export const getRandomAttackDefense = (rarity: number) => {
    const randomAtk = 1 + getRandomInt(rarity * 10 - 1); // 1 to 60
    return {
        attack: Math.ceil(rarity / 1.5 + randomAtk / 15),
        defense: MAX_STATISTIC - Math.floor(randomAtk / 10 + rarity / 1.5),
    };
};

export const transformBrawlerToCard = (
    brawlers: BrawlerModel[],
): CardType[] => {
    return brawlers.map((b) => {
        return {
            id: b.id,
            name: b.name,
            image: b.imageUrl,
            rarity: {
                id: b.rarity.id,
                name: b.rarity.name,
                color: b.rarity.color,
            },
            description: b.description,
            basePrice: b.rarity.id,
            ...getRandomAttackDefense(b.rarity.id),
        };
    });
};
