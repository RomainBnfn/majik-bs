import type { GameModel } from "../models/game.model.ts";
import type { CardModel } from "../models/card.model.ts";
import {
    getOpponent,
    getPlayer,
    getRandomAvailableCardIds,
} from "../utils/game.utils.ts";
import {
    getFirebaseRef,
    getFirebaseValue,
    pushFirebaseValue,
    updateFirebaseValue,
} from "./firebase.service.ts";
import { FIREBASE_PATHS } from "../constants/firebasePaths.ts";
import { TurnPhaseTypes } from "../enums/TurnPhaseType.enum.ts";
import { transformGameResponse } from "../pages/GamePage/contexts/GameContextProvider.tsx";
import { getRandomInt, getRandomStringCode } from "../utils/random.utils.ts";
import type { UserModel } from "../models/user.model.ts";
import { equalTo, get, orderByChild, query } from "firebase/database";
import { fromObjectToList } from "../utils/firebase.utils.ts";
import { getDeckFromId } from "./cards.service.ts";

const INVITATION_CODE_LENGTH = 6;

export const getGameById = (id: string) => {
    return getFirebaseValue(`${FIREBASE_PATHS.games}/${id}`);
};

export const attackWithCard = (game: GameModel, card: CardModel) => {
    const updates = {};
    updates["currentPhase"] = TurnPhaseTypes.Defense;
    updates["currentSelectedCardId"] = card._id;
    return updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}`, updates);
};

export const defense = async (
    game: GameModel,
    card: CardModel | undefined,
    attackingCard: CardModel,
) => {
    const defendingPlayer = getOpponent(game, game.currentPlayerId);
    if (!defendingPlayer) {
        return;
    }
    const defId = defendingPlayer._id;
    const atkId = game.currentPlayerId;

    let isTerminated = false;
    const updates = {
        [`players/${atkId}/discardCardIds/${attackingCard._id}`]:
            attackingCard._id,

        [`players/${atkId}/inHandCardIds/${attackingCard._id}`]: null,
    };
    if (card) {
        updates[`players/${defId}/discardCardIds/${card._id}`] = card._id;
        updates[`players/${defId}/inHandCardIds/${card._id}`] = null;
    }
    if (!card || attackingCard.attack > card.defense) {
        updates[`players/${defId}/health`] = defendingPlayer.health - 1;

        if (defendingPlayer.health - 1 <= 0) {
            updates["winnerPlayerId"] = atkId;
            isTerminated = true;
        }
    }

    await updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}/`, updates);
    await pushFirebaseValue(
        `${FIREBASE_PATHS.games}/${game._id}/previousTurns`,
        {
            attackerCardId: attackingCard._id,
            attackerPlayerId: atkId,
            defenderCardId: card?._id ?? null,
            defenderPlayerId: defId,
            turn: game.currentTurn,
        },
    );
    const updatedGame = await getFirebaseValue(
        `${FIREBASE_PATHS.games}/${game._id}`,
    );
    if (isTerminated) {
        return;
    }
    await startPlayerTurn(
        transformGameResponse(updatedGame.val(), game._id),
        defId,
        !!card,
    );
};

export const startPlayerTurn = (
    game: GameModel,
    playerId: string,
    hasUsedCard: boolean,
    defaultCardId = "e6c645e4-7882-4186-a003-9de8cee27e12",
) => {
    const player = getPlayer(game, playerId);
    if (!player) {
        return;
    }
    const availableCardIds = getRandomAvailableCardIds(
        player,
        3,
        hasUsedCard ? 1 : 2,
        defaultCardId,
    );
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

export const getFreeInvitationCode = async () => {
    return getRandomStringCode(INVITATION_CODE_LENGTH);
};

export const createGame = async (
    user: UserModel,
    deckId: string,
    maxHealth: number,
) => {
    const deck = await getDeckFromId(deckId);
    if (!deck) {
        return;
    }
    const cardIds = Object.keys(deck.cardIds);
    const invitationCode = await getFreeInvitationCode();
    return pushFirebaseValue(FIREBASE_PATHS.games, {
        players: {
            [user.uid]: {
                exists: true,
                deckCardIds: cardIds.reduce((o, c) => ({ ...o, [c]: c }), {}),
                discardCardIds: "",
                inHandCardIds: "",
                health: maxHealth,
                displayName: user.displayName,
            },
        },
        currentPlayerId: "",
        currentTurn: 1,
        currentPhase: TurnPhaseTypes.Attack,
        currentSelectedCardId: null,
        isStarted: false,
        invitationCode,
    });
};

export const joinGame = async (
    user: UserModel,
    invitationCode: string,
    deckId: string,
    maxHealth: number,
) => {
    const firebaseGame = await get(
        query(
            getFirebaseRef(FIREBASE_PATHS.games),
            orderByChild("invitationCode"),
            equalTo(invitationCode),
        ),
    );
    if (!firebaseGame.exists()) {
        return;
    }
    const game = fromObjectToList<GameModel>(firebaseGame.val())
        .map((v) => transformGameResponse(v, v._id))
        .find((g) => !g.isStarted && !g.players.some((p) => p._id == user.uid));
    if (!game) {
        console.log("No game found");
        return;
    }
    const deck = await getDeckFromId(deckId);
    if (!deck) {
        return;
    }
    const cardIds = Object.keys(deck.cardIds);
    await updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}`, {
        [`players/${user.uid}`]: {
            exists: true,
            deckCardIds: cardIds.reduce((o, c) => ({ ...o, [c]: c }), {}),
            discardCardIds: "",
            inHandCardIds: "",
            health: maxHealth,
            displayName: user.displayName,
        },
        isStarted: true,
    });
    await startGame(game._id);
    return game;
};

export const startGame = async (gameId: string) => {
    const firebaseGame = await getGameById(gameId);
    if (!firebaseGame.exists()) {
        return;
    }
    const game = transformGameResponse(firebaseGame.val(), gameId);
    const startingPlayer = game.players[getRandomInt(game.players.length)];

    const updates = {
        currentPlayerId: startingPlayer._id,
    };
    // Pick cards
    game.players.forEach((p) => {
        const toPickCardIds = getRandomAvailableCardIds(p, 3);
        toPickCardIds.forEach((i) => {
            updates[`players/${p._id}/inHandCardIds/${i}`] = i;
        });
    });
    return updateFirebaseValue(`${FIREBASE_PATHS.games}/${gameId}/`, updates);
};

export const getAllPlayerGames = (playerId: string) => {
    return query(
        getFirebaseRef(FIREBASE_PATHS.games),
        orderByChild(`players/${playerId}/exists`),
        equalTo(true),
    );
};
