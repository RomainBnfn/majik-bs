import { type GameModel } from "../models/game.model.ts";
import { getRandomInt } from "./random.utils.ts";
import type { PlayerGameModel } from "../models/playerGame.model.ts";

export const getPlayer = (game: GameModel, playerId: string) => {
    return game.players.find((p) => p._id == playerId);
};

export const getCurrentPlayer = (game: GameModel) => {
    return getPlayer(game, game.currentPlayerId);
};

export const getOpponent = (game: GameModel, playerId: string) => {
    return game.players.find((p) => p._id != playerId);
};

export const getAvailableCardIds = (p: PlayerGameModel) => {
    return filterCardNotIn(p.deckCardIds, [
        ...p.inHandCardIds,
        ...p.discardCardIds,
    ]);
};

export const filterCardNotIn = (deckCardIds: string[], excludes: string[]) => {
    return deckCardIds.filter((c) => !excludes.includes(c));
};

export const getRandomAvailableCardIds = (
    p: PlayerGameModel,
    maxCards: number,
): string[] => {
    const availableCards = getAvailableCardIds(p);
    if (!availableCards.length) {
        return [];
    }
    const toPickCards =
        Math.min(maxCards, availableCards.length) - p.inHandCardIds.length;
    const cards: string[] = [];
    while (cards.length < toPickCards) {
        const remainingAvailable = filterCardNotIn(availableCards, cards);
        cards.push(
            remainingAvailable[getRandomInt(remainingAvailable.length - 1)],
        );
    }
    return cards;
};
