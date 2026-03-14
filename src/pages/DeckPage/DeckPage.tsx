import "./DeckPage.scss";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { CardModel } from "../../models/card.model.ts";
import Card from "../../components/Card/Card.tsx";
import { fromObjectToList } from "../../utils/firebase.utils.ts";
import {
    CheckBox,
    DeleteForever,
    RadioButtonChecked,
    Shield,
    Style,
    ViewCompactAlt,
    Whatshot,
} from "@mui/icons-material";
import { FunctionComponent, useState } from "react";
import SortingButton from "../../components/SortingButton/SortingButton.tsx";
import { IconButton, TextField } from "@mui/material";
import type { DeckModel } from "../../models/deck.model.ts";
import { updateFirebaseValue } from "../../services/firebase.service.ts";
import DeckContent from "../../components/DeckContent/DeckContent.tsx";
import RoundStatistic from "../../components/RoundStatistic/RoundStatistic.tsx";
import { Link, useParams } from "react-router";
import classNames from "classnames";

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
const MAX_PRICE = 30;
const MAX_CARDS = 10;

const DeckPage = () => {
    const { id } = useParams();
    const [cards, areCardsLoading] = useFirebaseValues<CardModel[]>(
        FIREBASE_PATHS.cards,
        {},
    );
    const deckPath = `${FIREBASE_PATHS.decks}/${id}`;
    const [decks, areDeckLoading] = useFirebaseValues<DeckModel>(deckPath, {});
    const [sorting, setSorting] = useState({ type: "price", desc: false });
    const [compact, setCompact] = useState(false);
    const [displayOnly, setDisplayOnly] = useState(false);

    const selectedCardIds = decks.cardIds ? Object.keys(decks.cardIds) : [];

    const [wrongId, setWrongId] = useState<string | undefined>(undefined);

    const setSelectedCardIds = (getValues: (p) => string[]) => {
        const newValues = getValues(selectedCardIds);
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
    //.filter((c) => !selectedCardIds.some((i) => i == c.id));

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
                        return { type: type, desc: true };
                    });
                }}
            />
        );
    };

    const onClickOnCard = (card: CardModel) => {
        if (
            selectedCardIds.length >= MAX_CARDS &&
            !selectedCardIds.some((i) => i == card.id)
        ) {
            setWrongId(card.id);
            return;
        }
        setSelectedCardIds((p) => {
            if (p.some((i) => String(i) == card.id)) {
                return p.filter((i) => i != card.id);
            }
            return [card.id, ...p];
        });
    };

    return (
        <>
            <Link to={"/decks"}>Back</Link>
            <div className={"Header"}>
                <div className={"Deck"}>
                    <div className={"Deck-header"}>
                        <TextField
                            label="Name"
                            variant="filled"
                            value={decks?.name ?? ""}
                            onChange={(e) => {
                                updateFirebaseValue(
                                    `${deckPath}/name`,
                                    e.target.value,
                                );
                            }}
                        />
                        <RoundStatistic
                            value={`${selectedPrice}/${MAX_PRICE}`}
                            type={"price"}
                            icon={<RadioButtonChecked />}
                        />
                        <RoundStatistic
                            value={`${selectedCards.length}/${MAX_CARDS}`}
                            type={"card"}
                            icon={<Style />}
                        />
                        <IconButton
                            onClick={() => {
                                unselectAll();
                            }}
                        >
                            <DeleteForever />
                        </IconButton>
                    </div>
                    <DeckContent
                        selectedCards={selectedCards}
                        onClick={onClickOnCard}
                    />
                </div>
            </div>
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
                            className={classNames(
                                wrongId == card.id && "Cards-wrong-item",
                            )}
                            onAnimationEnd={() => {
                                setWrongId(undefined);
                            }}
                            reverse={selectedCardIds.some((i) => i == card.id)}
                            key={card.id}
                            card={card}
                            compact={compact}
                            onClick={() => {
                                onClickOnCard(card);
                            }}
                        />
                    ))}
            </div>
        </>
    );
};

export default DeckPage;
