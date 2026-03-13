import "./App.css";
import { generateCardsFromBrawlers } from "./services/cards.service.ts";
import { useFirebaseValues } from "./hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "./constants/firebasePaths.ts";
import type { CardType } from "./models/card.model.ts";
import Card from "./components/Card/Card.tsx";

function App() {
    const [cards, areCardsLoading] = useFirebaseValues<CardType[]>(
        FIREBASE_PATHS.cards,
        [],
    );
    return (
        <>
            <button
                onClick={() => {
                    generateCardsFromBrawlers();
                }}
            >
                Generate cards
            </button>
            <div className={"Cards"}>
                {[...cards]
                    .sort((a, b) => b.rarity.id - a.rarity.id)
                    .map((card) => (
                        <Card card={card} />
                    ))}
            </div>
        </>
    );
}

export default App;
