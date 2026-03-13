import "./Card.scss";
import type { CardType } from "../../models/card.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";
import { RadioButtonChecked, Shield, Whatshot } from "@mui/icons-material";
import classNames from "classnames";

export type CardProps = {
    card: CardType;
    compact?: boolean;
};

const Card = ({ card, compact }: CardProps) => {
    return (
        <div
            className={classNames("Card", compact && "Card-compact")}
            style={{
                "--card-rarity-color": card.rarity.color,
                "--card-background-url": `url(${card.image})`,
            }}
        >
            <div className={"Card-header"}>
                <RoundStatistic
                    value={card.rarity.id}
                    type={"rarity"}
                    icon={<RadioButtonChecked />}
                />
                <span>{card.name}</span>
            </div>
            <div className={"Card-content"} />
            <div className={"Card-footer"}>
                <CardAttack value={card.attack} />
                <CardDefense value={card.defense} />
            </div>
        </div>
    );
};

const CardAttack = ({ value }: { value: number }) => {
    return <RoundStatistic value={value} type={"attack"} icon={<Whatshot />} />;
};

const CardDefense = ({ value }: { value: number }) => {
    return <RoundStatistic value={value} type={"defense"} icon={<Shield />} />;
};

export default Card;
