import { useGame } from "../contexts/gameContext.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import Card from "../../../components/Card/Card.tsx";
import type { PreviousTurn } from "../../../models/previousTurn.model.ts";
import { Shield, Whatshot } from "@mui/icons-material";
import { useState } from "react";
import classNames from "classnames";

const HIDING_TRANSITION_MS = 1500;

const PreviousTurnAnimation = () => {
    const { nonPlayedPreviousTurn } = useGame();
    if (!nonPlayedPreviousTurn.length) {
        return null;
    }
    return <TurnAnimation turn={nonPlayedPreviousTurn[0]} />;
};

const TurnAnimation = ({ turn }: { turn: PreviousTurn }) => {
    const { seenPlayedTurn } = useGame();
    const [showDefense, setShowDefense] = useState(false);
    const [hide, setHide] = useState(false);
    const { getCardById } = useCards();
    const attackerCard = getCardById(turn.attackerCardId);
    const defenderCard = turn.defenderCardId
        ? getCardById(turn.defenderCardId)
        : undefined;
    const attackerWin =
        !defenderCard || attackerCard?.attack > defenderCard?.defense;

    const markAsSeen = () => {
        setHide(true);
    };
    return (
        <div
            className={classNames(
                "PreviousTurnAnimation",
                hide && "PreviousTurnAnimation-hiding",
            )}
            onTransitionEnd={() => {
                setTimeout(() => {
                    seenPlayedTurn(turn);
                }, HIDING_TRANSITION_MS);
            }}
        >
            <div className={"PreviousTurnAnimation-cards"}>
                <div className={"PreviousTurnAnimation-cards-card"}>
                    {attackerCard && (
                        <Card
                            className={"PreviousTurnAnimation-attacker"}
                            onAnimationEnd={() => {
                                setShowDefense(!showDefense);
                            }}
                            card={attackerCard}
                            highlightMode={"attack"}
                        />
                    )}
                    <span
                        className={classNames(
                            "PreviousTurnAnimation-icon",
                            showDefense &&
                                (attackerWin
                                    ? "PreviousTurnAnimation-icon-winner"
                                    : "PreviousTurnAnimation-icon-loser"),
                        )}
                        onAnimationEnd={() => {
                            markAsSeen();
                        }}
                    >
                        <Whatshot />
                    </span>
                </div>

                <div className={"PreviousTurnAnimation-cards-card"}>
                    {defenderCard ? (
                        <Card
                            className={"PreviousTurnAnimation-defender"}
                            reverse={!showDefense}
                            card={defenderCard}
                            highlightMode={"defense"}
                        />
                    ) : (
                        <div
                            className={"PreviousTurnAnimation-defender-empty"}
                        />
                    )}
                    <span
                        className={classNames(
                            "PreviousTurnAnimation-icon",
                            showDefense &&
                                (!attackerWin
                                    ? "PreviousTurnAnimation-icon-winner"
                                    : "PreviousTurnAnimation-icon-loser"),
                        )}
                        onAnimationEnd={() => {
                            markAsSeen();
                        }}
                    >
                        <Shield />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PreviousTurnAnimation;
