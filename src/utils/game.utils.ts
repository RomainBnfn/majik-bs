import { type GameModel } from "../models/game.model.ts";
import { getRandomInt } from "./random.utils.ts";
import type { PlayerGameModel } from "../models/playerGame.model.ts";
import {
    type TurnPhaseType,
    TurnPhaseTypes,
} from "../enums/TurnPhaseType.enum.ts";

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
    cardToPick = maxCards,
    defaultCardId = "e6c645e4-7882-4186-a003-9de8cee27e12",
): string[] => {
    const availableCards = getAvailableCardIds(p);
    const _cardToPick =
        cardToPick + p.inHandCardIds.length > maxCards
            ? maxCards - p.inHandCardIds.length
            : cardToPick;
    const cards: string[] = [];
    while (cards.length < _cardToPick) {
        const remainingAvailable = filterCardNotIn(availableCards, cards);
        if (!remainingAvailable.length) {
            cards.push(defaultCardId);
            console.log("pick default");
        } else {
            cards.push(
                remainingAvailable[getRandomInt(remainingAvailable.length)],
            );
            console.log("pick random");
        }
    }
    return cards;
};

export const getOppositeTurnPhase = (p: TurnPhaseType): TurnPhaseType => {
    return p === TurnPhaseTypes.Attack
        ? TurnPhaseTypes.Defense
        : TurnPhaseTypes.Attack;
};
