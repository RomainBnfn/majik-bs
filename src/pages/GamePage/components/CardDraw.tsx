import Card from "../../../components/Card/Card.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useAuth } from "../../../globalContexts/AuthGlobalContext/AuthGlobalContext.tsx";
import classNames from "classnames";

type CardDrawnProps = {
    cardIds: string[];
    isSelf: boolean;
};
const CardDrawn = ({ cardIds, isSelf }: CardDrawnProps) => {
    const { getCardById } = useCards();
    const { user } = useAuth();
    return (
        <div className={classNames("CardDrawn", isSelf && "CardDrawn-self")}>
            {cardIds.map((c) => {
                const card = getCardById(c);
                if (card) {
                    return (
                        <div className={"CardDrawn-card-wrapper"}>
                            <Card
                                card={card}
                                reverse={true}
                                className={"CardDrawn-card"}
                            />
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default CardDrawn;
