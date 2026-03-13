import "./Card.css"
import type {CardType} from "../../models/card.model.ts";
import RoundStatistic from "../RoundStatistic/RoundStatistic.tsx";

export type CardProps = {
    card: CardType
}

const Card = ({card}: CardProps) => {
    return <div className={"Card"}
                style={{"--card-rarity-color": card.rarity.color, "--card-background-url": `url(${card.image})`}}>
        <div className={"Card-header"}>
            <RoundStatistic value={card.rarity.id} type={"rarity"}/>
            <span>
                {card.name}
            </span>
        </div>
        <div className={"Card-content"}/>
        <div className={"Card-footer"}>
            <CardAttack value={card.attack}/>
            <CardDefense value={card.defense}/>
        </div>
    </div>
}

const CardAttack = ({value}: { value: number }) => {
    return <RoundStatistic value={value} type={"attack"}/>
}

const CardDefense = ({value}: { value: number }) => {
    return <RoundStatistic value={value} type={"defense"}/>
}

export default Card;