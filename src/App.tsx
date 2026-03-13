import "./App.scss";
import { useFirebaseValues } from "./hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "./constants/firebasePaths.ts";
import type { CardModel } from "./models/card.model.ts";
import Card from "./components/Card/Card.tsx";
import { fromObjectToList } from "./utils/firebase.utils.ts";
import {
    CheckBox,
    RadioButtonChecked,
    Shield,
    ViewCompactAlt,
    Whatshot,
} from "@mui/icons-material";
import { FunctionComponent, useState } from "react";
import SortingButton from "./components/SortingButton/SortingButton.tsx";
import { IconButton } from "@mui/material";
import type { DeckModel } from "./models/deck.model.ts";
import { updateFirebaseValue } from "./services/firebase.service.ts";

type Sorting = "price" | "defense" | "attack";
const SortingIcons: Record<Sorting, FunctionComponent> = {
    price: RadioButtonChecked,
    defense: Shield,
    attack: Whatshot,
};
const SortingKeys: Record<Sorting, keyof CardModel> = {
    price: "basePrice",
    defense: "defense",
    attack: "attack",
};
const MAX_PRICE = 50;

const fakeDeck = "DCizenjenejKBezibc";
function App() {
    const [cards, areCardsLoading] = useFirebaseValues<CardModel[]>(
        FIREBASE_PATHS.cards,
        {},
    );
    const deckPath = `${FIREBASE_PATHS.decks}/${fakeDeck}`;
    const [decks, areDeckLoading] = useFirebaseValues<DeckModel>(deckPath, {});
    const [sorting, setSorting] = useState({ type: "price", desc: false });
    const [compact, setCompact] = useState(false);
    const [displayOnly, setDisplayOnly] = useState(false);

    const selectedCardIds = decks.cardIds ? Object.keys(decks.cardIds) : [];
    console.log("selectedCardIds", selectedCardIds);

    const setSelectedCardIds = (getValues: (p) => string[]) => {
        const newValues = getValues(selectedCardIds);
        console.log("newValues", newValues);
        updateFirebaseValue(
            `${deckPath}/cardIds`,
            newValues.reduce((o, id, index) => ({ ...o, [id]: index }), {}),
        );
    };

    const unselectAll = () => {
        updateFirebaseValue(`${deckPath}/cardIds`, "");
    };

    const arrayCards = fromObjectToList<CardModel>(cards);
    const selectedCards = selectedCardIds
        .map((id) => arrayCards.find((c) => c.id == id))
        .filter((c) => !!c);

    const displayedCards = displayOnly ? selectedCards : arrayCards;

    const selectedPrice = selectedCards.reduce((t, c) => t + c.basePrice, 0);

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
            <div className={"Header"}>
                {/*<button*/}
                {/*    onClick={() => {*/}
                {/*        generateCardsFromBrawlers();*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Generate cards*/}
                {/*</button>*/}
                <div className={"Header-filters"}>
                    <div className={"Sort"}>
                        Sorting
                        <Sorting type={"price"} />
                        <Sorting type={"attack"} />
                        <Sorting type={"defense"} />
                    </div>
                    <div>
                        Mode
                        <IconButton
                            color={compact ? "primary" : undefined}
                            onClick={() => setCompact((p) => !p)}
                        >
                            <ViewCompactAlt />
                        </IconButton>
                        <IconButton
                            color={displayOnly ? "primary" : undefined}
                            onClick={() => setDisplayOnly((p) => !p)}
                        >
                            <CheckBox />
                        </IconButton>
                    </div>
                </div>
                <div className={"Deck"}>
                    Deck
                    <input
                        value={decks?.name ?? ""}
                        onChange={(e) => {
                            updateFirebaseValue(
                                `${deckPath}/name`,
                                e.target.value,
                            );
                        }}
                    />
                    <div className={"Deck-list"}>
                        {selectedCards.map((d) => (
                            <div>{d.name}</div>
                        ))}
                    </div>
                    <div>
                        {selectedPrice}/{MAX_PRICE}
                    </div>
                    <button
                        onClick={() => {
                            unselectAll();
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
            <div className={"Cards"}>
                {displayedCards
                    .sort(
                        (a, b) =>
                            (sorting.desc ? -1 : 1) *
                            (a[SortingKeys[sorting.type]] -
                                b[SortingKeys[sorting.type]]),
                    )
                    .map((card) => (
                        <Card
                            active={selectedCardIds.some((i) => i == card.id)}
                            key={card.id}
                            card={card}
                            compact={compact}
                            onClick={() => {
                                setSelectedCardIds((p) => {
                                    if (p.some((i) => String(i) == card.id)) {
                                        return p.filter((i) => i != card.id);
                                    }
                                    return [...p, card.id];
                                });
                            }}
                        />
                    ))}
            </div>
        </>
    );
}

export default App;
