import "./App.css";
import { generateCardsFromBrawlers } from "./services/cards.service.ts";
import { useFirebaseValues } from "./hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "./constants/firebasePaths.ts";
import type { CardType } from "./models/card.model.ts";
import Card from "./components/Card/Card.tsx";
import { fromObjectToList } from "./utils/firebase.utils.ts";
import { RadioButtonChecked, Shield, Whatshot } from "@mui/icons-material";
import { FunctionComponent, useState } from "react";
import SortingButton from "./components/SortingButton/SortingButton.tsx";

type Sorting = "price" | "defense" | "attack";
const SortingIcons: Record<Sorting, FunctionComponent> = {
    price: RadioButtonChecked,
    defense: Shield,
    attack: Whatshot,
};
const SortingKeys: Record<Sorting, keyof CardType> = {
    price: "basePrice",
    defense: "defense",
    attack: "attack",
};

function App() {
    const [cards, areCardsLoading] = useFirebaseValues<CardType[]>(
        FIREBASE_PATHS.cards,
        {},
    );
    const [sorting, setSorting] = useState({ type: "price", desc: false });

    const Sorting = ({ type }: { type: Sorting }) => {
        return (
            <SortingButton
                Icon={SortingIcons[type]}
                active={sorting.type === type}
                isDesc={sorting.desc}
                onClick={() => {
                    setSorting((p) => {
                        if (p.type === type) {
                            return { ...p, desc: !p.desc };
                        }
                        return { type: type, desc: false };
                    });
                }}
            />
        );
    };

    return (
        <>
            <button
                onClick={() => {
                    generateCardsFromBrawlers();
                }}
            >
                Generate cards
            </button>
            <div className={"Sort"}>
                Sorting
                <Sorting type={"price"} />
                <Sorting type={"attack"} />
                <Sorting type={"defense"} />
            </div>
            <div className={"Cards"}>
                {[...fromObjectToList<CardType>(cards)]
                    .sort(
                        (a, b) =>
                            (sorting.desc ? -1 : 1) *
                            (a[SortingKeys[sorting.type]] -
                                b[SortingKeys[sorting.type]]),
                    )
                    .map((card) => (
                        <Card card={card} />
                    ))}
            </div>
        </>
    );
}

export default App;
