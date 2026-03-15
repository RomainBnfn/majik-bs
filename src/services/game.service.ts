import type { GameModel } from "../models/game.model.ts";
import type { CardModel } from "../models/card.model.ts";
import {
    getOpponent,
    getPlayer,
    getRandomAvailableCardIds,
} from "../utils/game.utils.ts";
import { getFirebaseValue, updateFirebaseValue } from "./firebase.service.ts";
import { FIREBASE_PATHS } from "../constants/firebasePaths.ts";
import { TurnPhaseTypes } from "../enums/TurnPhaseType.enum.ts";
import { transformGameResponse } from "../pages/GamePage/contexts/GameContextProvider.tsx";

export const attackWithCard = (game: GameModel, card: CardModel) => {
    // if opponent has no card
    const opponent = getOpponent(game, game.currentPlayerId);
    if (!opponent.inHandCardIds?.length) {
        // take damage and skip defense phase
    }
    const updates = {};
    updates["currentPhase"] = TurnPhaseTypes.Defense;
    updates["currentSelectedCardId"] = card._id;
    return updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}`, updates);
};

export const defenseWithCard = async (
    game: GameModel,
    card: CardModel,
    attackingCard: CardModel,
) => {
    const defendingPlayer = getOpponent(game, game.currentPlayerId);

    const defId = defendingPlayer._id;
    const atkId = game.currentPlayerId;

    const updates = {
        [`players/${defId}/discardCardIds/${card._id}`]: card._id,
        [`players/${atkId}/discardCardIds/${attackingCard._id}`]:
            attackingCard._id,
        [`players/${defId}/inHandCardIds/${card._id}`]: null,
        [`players/${atkId}/inHandCardIds/${attackingCard._id}`]: null,
    };
    if (attackingCard.attack > card.defense) {
        updates[`players/${defId}/health`] = defendingPlayer.health - 1;
    }
    await updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}/`, updates);
    const updatedGame = await getFirebaseValue(
        `${FIREBASE_PATHS.games}/${game._id}`,
    );
    await startPlayerTurn(
        transformGameResponse(updatedGame.val(), game._id),
        defId,
    );
};

export const startPlayerTurn = (game: GameModel, playerId: string) => {
    const player = getPlayer(game, playerId);
    const availableCardIds = getRandomAvailableCardIds(player, 3);
    const updates = {
        ...availableCardIds.reduce(
            (o, i) => ({ ...o, [`players/${playerId}/inHandCardIds/${i}`]: i }),
            {},
        ),
        currentPlayerId: playerId,
        currentTurn: game.currentTurn + 1,
        currentPhase: TurnPhaseTypes.Attack,
        currentSelectedCardId: null,
    };
    return updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}/`, updates);
};
