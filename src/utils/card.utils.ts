import type { BrawlerModel } from "../models/brawler.model.ts";
import type { CardModel } from "../models/card.model.ts";
import { getRandomInt } from "./random.utils.ts";
import type { DeckModel } from "../models/deck.model.ts";
import { useGameSettingCards } from "../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";

const MAX_STATISTIC = 10;
const MIN_STATISTIC = 1;

const getMaxStatistic = (rarity: number) =>
    MAX_STATISTIC - Math.max(0, 7 - rarity);

const minMax = (v: number, rarity: number) =>
    Math.min(getMaxStatistic(rarity), Math.max(MIN_STATISTIC, v));

const getStatisticsToSpread = (rarity: number) => {
    return Math.floor(Math.pow(rarity, 1.3) - 0.5 * rarity + 5);
};
export const getRandomAttackDefense = (rarity: number) => {
    const stats = getStatisticsToSpread(rarity);
    const randomAtk = minMax(1 + getRandomInt(stats), rarity);
    return {
        attack: randomAtk,
        defense: minMax(stats - randomAtk, rarity),
    };
};

export const transformBrawlerToCard = (
    brawlers: BrawlerModel[],
): CardModel[] => {
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

export const useGetIsDeckValid = () => {
    return (deck: DeckModel) => {
        const { maxCard, minCard } = useGameSettingCards();
        const cards = Object.keys(deck.cardIds).length;
        return minCard <= cards && cards <= maxCard;
    };
};

export const useIsDeckValid = (deck: DeckModel) => {
    const isDeckValid = useGetIsDeckValid();
    return isDeckValid(deck);
};
