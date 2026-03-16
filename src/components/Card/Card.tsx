import "./Card.scss";
import type { CardModel } from "../../models/card.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import {
    Adjust,
    RadioButtonChecked,
    Shield,
    Whatshot,
} from "@mui/icons-material";
import classNames from "classnames";

export type CardProps = {
    card: CardModel;
    compact?: boolean;
    active?: boolean;
    reverse?: boolean;
    onClick?(): void;
    className?: string;
    onAnimationEnd?(): void;
    highlightMode?: "attack" | "defense";
};

const Card = ({
    card,
    compact,
    onClick,
    active,
    reverse,
    className,
    onAnimationEnd,
    highlightMode,
}: CardProps) => {
    return (
        <div
            className={classNames(
                "Card",
                compact && "Card-compact",
                active && "Card-active",
                reverse && "Card-reverse",
                className,
            )}
            style={{
                "--card-rarity-color": card.rarity.color,
                "--card-background-url": `url(${card.image})`,
            }}
            onClick={() => onClick?.()}
            onAnimationEnd={() => onAnimationEnd?.()}
        >
            <div className={"Card-inner"}>
                <div className={"Card-front"}>
                    <div className={"Card-header"}>
                        <RoundStatistic
                            value={card.basePrice}
                            type={"price"}
                            icon={<RadioButtonChecked />}
                        />
                        <span>{card.name}</span>
                    </div>
                    <div className={"Card-content"} />
                    <div className={"Card-footer"}>
                        <RoundStatistic
                            className={classNames(
                                "Card-footer-statistic",
                                highlightMode === "attack" &&
                                    "Card-footer-statistic-highlighted",
                            )}
                            value={card.attack}
                            type={"attack"}
                            icon={<Whatshot />}
                        />
                        <RoundStatistic
                            className={classNames(
                                "Card-footer-statistic",
                                highlightMode === "defense" &&
                                    "Card-footer-statistic-highlighted",
                            )}
                            value={card.defense}
                            type={"defense"}
                            icon={<Shield />}
                        />
                    </div>
                </div>
                <div className={"Card-back"}>
                    <Adjust />
                </div>
            </div>
        </div>
    );
};

export default Card;
