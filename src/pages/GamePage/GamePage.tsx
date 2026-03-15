import "./GamePage.scss";
import { Navigate } from "react-router";
import type { FirebaseGameModel } from "../../models/game.model.ts";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useGame } from "./contexts/gameContext.tsx";
import GameBoard from "./components/GameBoard.tsx";

const transformGameResponse = (v: FirebaseGameModel) => ({
    ...v,
    players: fromObjectToList(v.players).map((p) => ({
        ...p,
        deckCardIds: Object.values(p.deckCardIds),
        discardCardIds: Object.values(p.discardCardIds),
        inHandCardIds: Object.values(p.inHandCardIds),
    })),
});

const GamePage = () => {
    const { user } = useAuth();
    const { game, shouldSelectCard } = useGame();
    const isAA = game.currentPlayerId === user?.uid;
    if (!game) {
        return null;
    }
    if (!user) {
        return <Navigate to={"/"} />;
    }
    return (
        <div>
            GAME PAGE
            <div>Tour {game.currentTurn}</div>
            <div>
                Phase {game.currentPhase}:
                {shouldSelectCard && "Action attendue"}
            </div>
            <GameBoard />
        </div>
    );
};

export default GamePage;
