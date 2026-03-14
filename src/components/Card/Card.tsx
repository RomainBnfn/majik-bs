import "./Card.scss";
import type { CardModel } from "../../models/card.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { RadioButtonChecked, Shield, Whatshot } from "@mui/icons-material";
import classNames from "classnames";

export type CardProps = {
    card: CardModel;
    compact?: boolean;
    active?: boolean;
    onClick?(): void;
};

const Card = ({ card, compact, onClick, active }: CardProps) => {
    return (
        <div
            className={classNames(
                "Card",
                compact && "Card-compact",
                active && "Card-active",
            )}
            style={{
                "--card-rarity-color": card.rarity.color,
                "--card-background-url": `url(${card.image})`,
            }}
            onClick={() => onClick?.()}
        >
            <div className={"Card-header"}>
                <RoundStatistic
                    value={card.rarity.id}
                    type={"price"}
                    icon={<RadioButtonChecked />}
                />
                <span>{card.name}</span>
            </div>
            <div className={"Card-content"} />
            <div className={"Card-footer"}>
                <RoundStatistic
                    className={"Card-footer-statistic"}
                    value={card.attack}
                    type={"attack"}
                    icon={<Whatshot />}
                />
                <RoundStatistic
                    className={"Card-footer-statistic"}
                    value={card.defense}
                    type={"defense"}
                    icon={<Shield />}
                />
            </div>
        </div>
    );
};

export default Card;
