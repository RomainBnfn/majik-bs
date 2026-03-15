import "./GamePage.scss";
import { Link, Navigate } from "react-router";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { useGame } from "./contexts/gameContext.tsx";
import GameBoard from "./components/GameBoard.tsx";
import { Button } from "@mui/material";

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
            <Link className={"GamePage-navigate"} to={"/"}>
                <Button>Back</Button>
                Invitation code: {game.invitationCode}
            </Link>
            <GameBoard />
        </div>
    );
};

export default GamePage;
