import "./DeckContent.scss";
import Card from "../Card/Card.tsx";
import type { CardModel } from "../../models/card.model.ts";

type DeckContentProps = {
    selectedCards: CardModel[];
    onClick(c: CardModel): void;
};
const DeckContent = ({ selectedCards, onClick }: DeckContentProps) => {
    return (
        <div className={"DeckContent"}>
            {selectedCards.map((card) => (
                <Card
                    active={true}
                    key={card._id}
                    card={card}
                    compact={true}
                    onClick={() => {
                        onClick(card);
                    }}
                />
            ))}
            {!selectedCards?.length && <span>No selected card</span>}
        </div>
    );
};

export default DeckContent;
