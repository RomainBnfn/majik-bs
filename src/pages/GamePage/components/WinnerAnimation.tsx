import { useGame } from "../contexts/gameContext.tsx";
import { getPlayer } from "../../../utils/game.utils.ts";
import { Zoom } from "@mui/material";

const CONFETTI_AMOUNT = 50;

const WinnerAnimation = () => {
    const { game, nonPlayedPreviousTurn } = useGame();
    const winner = game.winnerPlayerId
        ? getPlayer(game, game.winnerPlayerId)
        : undefined;
    if (!game.winnerPlayerId || nonPlayedPreviousTurn.length || !winner) {
        return null;
    }
    return (
        <div className={"WinnerAnimation"}>
            <div className="confetti">
                <div className="confetti__wrapper">
                    {[...new Array(CONFETTI_AMOUNT).keys()].map((_, i) => (
                        <>
                            <div className={`confetti-left-${i}`}></div>
                            <div className={`confetti-right-${i}`}></div>
                        </>
                    ))}
                </div>
                <div className="banner">
                    <div>The winner is...</div>
                    <Zoom
                        className={"WinnerAnimation-winner-animation"}
                        in={true}
                    >
                        <h2 className={"WinnerAnimation-winner"}>
                            {winner.displayName}
                        </h2>
                    </Zoom>
                </div>
            </div>
        </div>
    );
};

export default WinnerAnimation;
