import type {Brawler} from "../models/brawler.model.ts";
import type {Card} from "../models/card.model.ts";
import {getRandomInt} from "./random.utils.ts";

const MAX_ATTACK = 10;
const MAX_DEFENSE = 10;

export const transformBrawlerToCard = (brawlers: Brawler[]): Card[] => {
    return brawlers.map(b => {
        const attack = 1 + getRandomInt(MAX_ATTACK - 1);
        const defense = 1 + MAX_DEFENSE - attack + getRandomInt(attack - 1); // Make defense lower if attacker is higher
        return {
            id: b.id,
            name: b.name,
            image: b.imageUrl,
            rarity: {
                id: String(b.rarity.id),
                name: b.rarity.name,
                color: b.rarity.color
            },
            description: b.description,
            attack: attack,
            defense: defense,
        }
    })
}