import "./GamePreview.scss";
import { type MouseEvent } from "react";
import type { GameModel } from "../../models/game.model.ts";
import { Link } from "react-router";
import { Button, Card } from "@mui/material";
import { useAuth } from "../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import { getOpponent, getPlayer } from "../../utils/game.utils.ts";
import { deleteGame } from "../../services/game.service.ts";
import { TurnPhaseTypes } from "../../enums/TurnPhaseType.enum.ts";

type GamePreviewProps = {
    game: GameModel;
};

const GamePreview = ({ game }: GamePreviewProps) => {
    const { user } = useAuth();
    if (!user) {
        return null;
    }
    const otherPlayer = getOpponent(game, user.uid);
    const currentPlayer = game.currentPlayerId
        ? getPlayer(game, game.currentPlayerId)
        : undefined;

    const onDelete = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        deleteGame(game._id);
    };
    return (
        <Link to={`/game/${game._id}`}>
            <Card className="GamePreview" variant="outlined">
                <b>Game {game.invitationCode}</b>
                {otherPlayer && (
                    <div className={"GamePreview-opponent"}>
                        <div>• Oponnent:</div>
                        <div className={"GamePreview-value"}>
                            {otherPlayer.displayName}
                        </div>
                    </div>
                )}
                <div className={"GamePreview-current"}>
                    {currentPlayer ? (
                        <>
                            <div>• Current player: </div>
                            <div className={"GamePreview-value"}>
                                {(
                                    currentPlayer._id == user.uid
                                        ? game.currentPhase ===
                                          TurnPhaseTypes.Attack
                                        : game.currentPhase ===
                                          TurnPhaseTypes.Defense
                                )
                                    ? "Your turn!"
                                    : "Opponent turn..."}
                            </div>
                        </>
                    ) : (
                        <>En attente ...</>
                    )}
                </div>
                {!otherPlayer && <Button onClick={onDelete}>Leave</Button>}
            </Card>
        </Link>
    );
};

export default GamePreview;
