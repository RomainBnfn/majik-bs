import type { GameModel } from "../models/game.model.ts";
import type { CardModel } from "../models/card.model.ts";
import {
    getCurrentPlayer,
    getOpponent,
    getPlayer,
    getRandomAvailableCardIds,
} from "../utils/game.utils.ts";
import {
    getFirebaseRef,
    getFirebaseValue,
    pushFirebaseValue,
    removeFirebaseElement,
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
import {
    applyPowers,
    type PowerContext,
    type PowerResults,
} from "./cardPower.service.ts";
import { GamePhaseTypes } from "../enums/GamePhaseType.enum.ts";
import type { GameSettingGlobalValue } from "../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import type { PlayerGameModel } from "../models/playerGame.model.ts";

const INVITATION_CODE_LENGTH = 3;

export const getGameById = (id: string) => {
    return getFirebaseValue(`${FIREBASE_PATHS.games}/${id}`);
};

export const attackWithCard = (
    game: GameModel,
    card: CardModel,
    context: PowerContext,
) => {
    let updates = {};
    updates["currentPhase"] = TurnPhaseTypes.Defense;
    updates["currentSelectedCardId"] = card._id;
    updates = {
        ...updates,
        ...applyPowers(card.powers, GamePhaseTypes.AfterAttack, context)
            .updates,
    };
    return updateFirebaseValue(`${FIREBASE_PATHS.games}/${game._id}`, updates);
};

export const deleteGame = (id: string) => {
    return removeFirebaseElement(`${FIREBASE_PATHS.games}/${id}`);
};

export const defense = async (
    game: GameModel,
    card: CardModel | undefined,
    attackingCard: CardModel,
    settings: GameSettingGlobalValue,
) => {
    const defendingPlayer = getOpponent(game, game.currentPlayerId);
    const attackerPlayer = getCurrentPlayer(game);
    if (!defendingPlayer || !attackerPlayer) {
        return;
    }
    const defId = defendingPlayer._id;
    const atkId = game.currentPlayerId;

    let isTerminated = false;
    let updates = {
        [`players/${atkId}/discardCardIds/${attackingCard._id}`]:
            attackingCard._id,

        [`players/${atkId}/inHandCardIds/${attackingCard._id}`]: null,
    };
    if (card) {
        updates[`players/${defId}/discardCardIds/${card._id}`] = card._id;
        updates[`players/${defId}/inHandCardIds/${card._id}`] = null;
    }
    const hasAttackerWin = !card || attackingCard.attack > card.defense;
    if (hasAttackerWin) {
        updates[`players/${defId}/health`] = defendingPlayer.health - 1;

        if (defendingPlayer.health - 1 <= 0) {
            updates["winnerPlayerId"] = atkId;
            isTerminated = true;
        }
    }
    // #############################
    // ### After defense effects ###
    // #############################
    if (card) {
        const { updates: a, results: rr } = applyPowers(
            card.powers,
            GamePhaseTypes.AfterDefense,
            { game, player: defendingPlayer, settings, hasAttackerWin },
        );
        const aa = rr.reduce((p, r) => p + r.toDamageAttacker, 0);
        if (aa && !isTerminated) {
            updates[`players/${atkId}/health`] = attackerPlayer.health - aa;
            if (attackerPlayer.health - aa <= 0) {
                updates["winnerPlayerId"] = defId;
                isTerminated = true;
            }
        }
    }

    const defPowerResults: PowerResults[] = [];
    if (card) {
        const { updates: u, results: r } = applyPowers(
            card.powers,
            GamePhaseTypes.OnEndTurn,
            {
                game: game,
                player: defendingPlayer,
                settings,
            },
        );
        updates = { ...updates, ...u };
        defPowerResults.push(...r);
        console.log("defPowerResults", defPowerResults);
    }
    const { updates: au, results: atkPowerResults } = applyPowers(
        attackingCard.powers,
        GamePhaseTypes.OnEndTurn,
        {
            game: game,
            player: defendingPlayer,
            settings,
        },
    );
    updates = { ...updates, ...au };
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
    const toDrawAttacker = atkPowerResults.reduce((p, r) => p + r.toDraw, 0);
    if (toDrawAttacker) {
        await makePlayerDraw(game._id, attackerPlayer, toDrawAttacker, {
            maxCards: 3,
            defaultCardId: "e6c645e4-7882-4186-a003-9de8cee27e12",
        });
    }
    await startPlayerTurn(
        transformGameResponse(updatedGame.val(), game._id),
        defId,
        (card ? 1 : 2) +
            defPowerResults.reduce((p, r) => p + (r.toDraw ?? 0), 0),
    );
};

export const makePlayerDraw = (
    gameId: string,
    player: PlayerGameModel,
    toDrawCards: number,
    { maxCards, defaultCardId }: { maxCards: number; defaultCardId: string },
) => {
    const availableCardIds = getRandomAvailableCardIds(
        player,
        maxCards,
        toDrawCards,
        defaultCardId,
    );
    const updates = {
        ...availableCardIds.reduce((o, i) => ({ ...o, [`${i}`]: i }), {}),
    };
    return updateFirebaseValue(
        `${FIREBASE_PATHS.games}/${gameId}/players/${player._id}/inHandCardIds/`,
        updates,
    );
};

export const startPlayerTurn = async (
    game: GameModel,
    playerId: string,
    cardToPick: number,
    defaultCardId = "e6c645e4-7882-4186-a003-9de8cee27e12",
) => {
    const player = getPlayer(game, playerId);
    if (!player) {
        return;
    }
    await makePlayerDraw(game._id, player, cardToPick, {
        maxCards: 3,
        defaultCardId,
    });
    const updates = {
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
            equalTo(invitationCode.toLocaleUpperCase()),
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
