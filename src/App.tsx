import './App.css'
import {generateCardsFromBrawlers} from "./services/cards.service.ts";
import {useFirebaseValues} from "./hooks/useFirebaseValues.ts";
import {FIREBASE_PATHS} from "./constants/firebasePaths.ts";
import type {Card} from "./models/card.model.ts";

function App() {
    const [cards, areCardsLoading] = useFirebaseValues<Card[]>(FIREBASE_PATHS.cards, [])
    return (
        <>
            {cards.map((card) => <div>{card.name} {card.attack} {card.defense}</div>)}
            <button onClick={() => {
                generateCardsFromBrawlers()
            }}>Generate cards
            </button>
        </>
    )
}

export default App
