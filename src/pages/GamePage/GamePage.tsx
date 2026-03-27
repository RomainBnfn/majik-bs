import "./GamePage.scss";
import { Navigate } from "react-router";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useGame } from "./contexts/gameContext.tsx";
import GameBoard from "./components/GameBoard.tsx";
import PreviousTurnAnimation from "./components/PreviousTurnAnimation.tsx";
import WinnerAnimation from "./components/WinnerAnimation.tsx";

const GamePage = () => {
    const { user } = useAuth();
    const { game, shouldSelectCard } = useGame();
    if (!game) {
        return null;
    }
    if (!user) {
        return <Navigate to={"/"} />;
    }
    return (
        <div className={"GamePage"}>
            <GameBoard />
            <PreviousTurnAnimation />
            <WinnerAnimation />
        </div>
    );
};

export default GamePage;
