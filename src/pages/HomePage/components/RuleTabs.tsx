import { useGameSettingCards } from "../../../globalContexts/GameSettingGlobalContext/GameSettingGlobalContext.tsx";
import { useCards } from "../../../globalContexts/CardGlobalContext/CardGlobalContext.tsx";
import Card from "../../../components/Card/Card.tsx";
import {
    Favorite,
    RadioButtonChecked,
    Shield,
    Whatshot,
} from "@mui/icons-material";

const ShellyCard = "16000000";
export const Rule1 = () => {
    const { minCard, maxCard, maxPrice } = useGameSettingCards();
    const { getCardById } = useCards();
    const exampleCard = getCardById(ShellyCard);
    if (!exampleCard) {
        return null;
    }
    return (
        <>
            <h2>Règles</h2>
            <p>
                Majik-BS est un jeu de carte en tour par tour dans lequel deux
                joueurs s'affrontent avec leur deck.
            </p>
            <h2>Exemple de carte</h2>
            <Card className={"GameRules-card-example"} card={exampleCard} />
            <p>
                Chaque carte possède une statistique d'attaque <Whatshot />, de
                défense <Shield />, un cout <RadioButtonChecked /> et
                potentielement un effet
            </p>

            <p>
                Un deck peut avoir entre {minCard} et {maxCard} cartes, avec un
                coût maximal de {maxPrice}.
            </p>
        </>
    );
};

export const Rule2 = () => {
    const { minCard, maxCard, maxPrice } = useGameSettingCards();
    const { getCardById } = useCards();
    const exampleCard = getCardById(ShellyCard);
    if (!exampleCard) {
        return null;
    }
    return (
        <>
            <h2>Déroulement de la partie</h2>
            <p>
                Chaque joueur commencent avec 5 point de vie. Le joueur qui
                commence est aléatoire.
            </p>
            <h2>Phase attaque</h2>
            <Card
                className={"GameRules-card-example"}
                card={exampleCard}
                highlightMode={"attack"}
            />
            <p>
                <ul>
                    <li>Le joueur pioche 1 carte, max {3}</li>
                    <li>
                        Le joueur choisi une carte avec laquelle il attaque
                        <Whatshot />
                    </li>
                </ul>
            </p>
        </>
    );
};

export const Rule3 = () => {
    const { minCard, maxCard, maxPrice } = useGameSettingCards();
    const { getCardById } = useCards();
    const exampleCard = getCardById(ShellyCard);
    if (!exampleCard) {
        return null;
    }
    return (
        <>
            <h2>Phase Défense</h2>
            <Card
                className={"GameRules-card-example"}
                card={exampleCard}
                highlightMode={"defense"}
            />
            <ul>
                <li>
                    L'opposant <b>peut</b> choisir une de ses cartes pour
                    défendre, ou encaisser le coup <Shield />
                </li>
                <li>
                    Si l'opposant encaisse le coup, il perd 1HP <Favorite /> et
                    pioche {1} carte
                </li>
                <li>
                    Sauf contre indication, les cartes jouées en attaque et en
                    défense sont défaussées
                </li>
            </ul>
        </>
    );
};

export const Rule4 = () => {
    const { minCard, maxCard, maxPrice } = useGameSettingCards();
    const { getCardById } = useCards();
    const exampleCard = getCardById(ShellyCard);
    if (!exampleCard) {
        return null;
    }
    return (
        <>
            <h2>Fin de la partie</h2>

            <ul>
                <li>
                    Si un joueur tombe à 0, l'autre joueur gagne, sinon c'est à
                    l'autre joueur d'attaquer
                </li>
                <li>
                    Lorsqu'un joueur n'a plus de carte dans sa pioche à son
                    tour, il pioche un robot (1/0)
                </li>
            </ul>
        </>
    );
};
