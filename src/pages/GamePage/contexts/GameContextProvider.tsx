import { GameContext } from "./gameContext.tsx";
import {
    type FirebaseGameModel,
    type GameModel,
} from "../../../models/game.model.ts";
import { fromObjectToList } from "../../../utils/firebase.utils.ts";
import { useParams } from "react-router";
import { useFirebaseValues } from "../../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../../constants/firebasePaths.ts";
import { type CardModel } from "../../../models/card.model.ts";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";
import { attackWithCard, defense } from "../../../services/game.service.ts";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";

export const transformGameResponse = (v: FirebaseGameModel, id: string) => ({
    ...v,
    _id: id,
    players: fromObjectToList(v.players).map(
        (p): GameModel => ({
            ...p,
            deckCardIds: valuesIfExists(p?.deckCardIds),
            discardCardIds: valuesIfExists(p?.discardCardIds),
            inHandCardIds: valuesIfExists(p?.inHandCardIds),
        }),
    ),
});

const valuesIfExists = (o): string[] => (o ? Object.values(o).map(String) : []);

const GameContextProvider = ({ children }) => {
    const { id } = useParams();
    const { getCardById } = useCards();
    const { user } = useAuth();
    const [gameState] = useFirebaseValues<GameModel, FirebaseGameModel>(
        `${FIREBASE_PATHS.games}/${id}`,
        {} as GameModel,
        (v) => transformGameResponse(v, id),
    );
    const isLoggedPlayerTurn = gameState.currentPlayerId == user?.uid;

    const shouldSelectCard =
        (isLoggedPlayerTurn &&
            gameState.currentPhase === TurnPhaseTypes.Attack) ||
        (!isLoggedPlayerTurn &&
            gameState.currentPhase === TurnPhaseTypes.Defense);

    const onClickOnCard = (c: CardModel) => {
        if (!shouldSelectCard) {
            return;
        }
        if (isLoggedPlayerTurn) {
            return attackWithCard(gameState, c);
        }
        const attackingCard = gameState.currentSelectedCardId
            ? getCardById(gameState.currentSelectedCardId)
            : undefined;
        if (!attackingCard) {
            return;
        }
        return defense(gameState, c, attackingCard);
    };

    const onSkipDefense = () => {
        if (
            !shouldSelectCard ||
            gameState.currentPhase !== TurnPhaseTypes.Defense
        ) {
            return;
        }
        const attackingCard = gameState.currentSelectedCardId
            ? getCardById(gameState.currentSelectedCardId)
            : undefined;
        if (!attackingCard) {
            return;
        }
        return defense(gameState, undefined, attackingCard);
    };

    return (
        <GameContext.Provider
            value={{
                game: gameState,
                onClickOnCard,
                onSkipDefense,
                isLoggedPlayerTurn,
                shouldSelectCard,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export default GameContextProvider;
