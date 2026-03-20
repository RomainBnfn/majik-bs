import "./DeckPage.scss";
import { useFirebaseValues } from "../../hooks/useFirebaseValues.ts";
import { FIREBASE_PATHS } from "../../constants/firebasePaths.ts";
import type { CardModel } from "../../models/card.model.ts";
import Card from "../../components/Card/Card.tsx";
import {
    CheckBox,
    RadioButtonChecked,
    Shield,
    Stars,
    Style,
    ViewCompactAlt,
    Whatshot,
} from "@mui/icons-material";
import { type FunctionComponent, useState } from "react";
import { Link, useParams } from "react-router";
import SortingButton from "../../components/SortingButton/SortingButton.tsx";
import { Fab, IconButton, TextField } from "@mui/material";
import type { DeckModel } from "../../models/deck.model.ts";
import { setFirebaseValue } from "../../services/firebase.service.ts";
import DeckContent from "../../components/DeckContent/DeckContent.tsx";
import RoundStatistic from "../../components/RoundStatistic/RoundStatistic.tsx";
import classNames from "classnames";
import { useCards } from "../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import { useGameSettingCards } from "../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";

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

const DeckPage = () => {
    const { id } = useParams();
    const { cards } = useCards();
    const { maxPrice, maxCard, minCard } = useGameSettingCards();

    const deckPath = `${FIREBASE_PATHS.decks}/${id}`;
    const [decks] = useFirebaseValues<DeckModel>(deckPath, {});
    const [sorting, setSorting] = useState({ type: "price", desc: false });
    const [compact, setCompact] = useState(false);
    const [displayOnly, setDisplayOnly] = useState(false);
    const [filterPowers, setFilterPowers] = useState(false);

    const selectedCardIds = decks.cardIds ? Object.keys(decks.cardIds) : [];

    const [wrongId, setWrongId] = useState<string | undefined>(undefined);

    const setSelectedCardIds = (getValues: (p) => string[]) => {
        const newValues = getValues(selectedCardIds);
        setFirebaseValue(
            `${deckPath}/cardIds`,
            newValues.reduce((o, id, index) => ({ ...o, [id]: index }), {}),
        );
    };

    const unselectAll = () => {
        setFirebaseValue(`${deckPath}/cardIds`, "");
    };

    const selectedCards = selectedCardIds
        .map((id) => cards.find((c) => c.id == id))
        .filter((c) => !!c);

    const displayedCards = (
        displayOnly
            ? selectedCards
            : cards.filter((c) => c.canBePicked !== false)
    ).filter((c) => !filterPowers || c.powers?.length);
    //.filter((c) => !selectedCardIds.some((i) => i == c.id));

    const selectedPrice = selectedCards.reduce((t, c) => t + c.basePrice, 0);
    const isValid =
        minCard <= selectedCardIds.length &&
        selectedCardIds.length <= maxCard &&
        selectedPrice <= maxPrice;

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
        const isUnselecting = selectedCardIds.some((i) => i == card.id);
        if (
            !isUnselecting &&
            (selectedCardIds.length >= maxCard ||
                card.basePrice + selectedPrice > maxPrice)
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
        <div className={"DeckPage"}>
            <div className={"Header"}>
                <div className={"Deck"}>
                    <div className={"Deck-header"}>
                        <TextField
                            label="Name"
                            variant="filled"
                            value={decks?.name ?? ""}
                            onChange={(e) => {
                                setFirebaseValue(
                                    `${deckPath}/name`,
                                    e.target.value,
                                );
                            }}
                        />
                        <RoundStatistic
                            value={`${selectedPrice}/${maxPrice}`}
                            type={"price"}
                            icon={<RadioButtonChecked />}
                        />
                        <RoundStatistic
                            value={`${selectedCards.length}/${maxCard}`}
                            type={"card"}
                            icon={<Style />}
                        />
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
                    <IconButton
                        color={filterPowers ? "primary" : undefined}
                        onClick={() => setFilterPowers((p) => !p)}
                    >
                        <Stars />
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
            <Fab
                className={"Cards-validate"}
                variant="extended"
                color={isValid ? "success" : undefined}
                component={Link}
                to={"/decks"}
            >
                <CheckBox />
                Valider
            </Fab>
        </div>
    );
};

export default DeckPage;
