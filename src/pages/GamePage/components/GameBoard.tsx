import { useGame } from "../contexts/gameContext.tsx";
import GameHand from "./GameHand.tsx";
import GamePlayerStatistic from "./GamePlayerStatistic.tsx";
import CardDrawn from "./CardDraw.tsx";
import { getAvailableCardIds } from "../../../utils/game.utils.ts";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import GameCurrentPhase from "./GameCurrentPhase.tsx";
import { Adjust } from "@mui/icons-material";
import { Button } from "@mui/material";
import { TurnPhaseTypes } from "../../../enums/TurnPhaseType.enum.ts";
import GameHandMessage from "./GameHandMessage.tsx";

const GameBoard = () => {
    const { game, shouldSelectCard, onSkipDefense, hasStarted } = useGame();
    const { user } = useAuth();
    return (
        <div className={"GameBoard"}>
            <div className={"GameBoard-content"}>
                <div className={"GameBoard-content-background"}>
                    <Adjust />
                </div>
                <div className={"GameBoard-content-cards"}>
                    {[...new Array(2).keys()].map((_, i) => (
                        <GameHand
                            key={game.players?.[i]?._id ?? i}
                            player={game.players?.[i]}
                            message={
                                <GameHandMessage player={game.players?.[i]} />
                            }
                        />
                    ))}
                </div>
                {[...new Array(2).keys()].map((_, i) => (
                    <CardDrawn
                        cardIds={
                            game.players?.[i]
                                ? getAvailableCardIds(game.players[i])
                                : []
                        }
                        isSelf={game.players?.[i]?._id == user?.uid}
                    />
                ))}
                <GameCurrentPhase />
            </div>
            {hasStarted &&
                game.players?.map((p) => (
                    <>
                        <GamePlayerStatistic player={p} />
                    </>
                ))}
            {game.currentPhase === TurnPhaseTypes.Defense &&
                shouldSelectCard && (
                    <Button onClick={() => onSkipDefense()} variant="outlined">
                        Skip
                    </Button>
                )}
        </div>
    );
};

export default GameBoard;
