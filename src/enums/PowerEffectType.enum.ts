export const PowerEffectTypes = {
    Heal: "Heal",
    Draw: "Draw",
    AddCardToDeck: "AddCardToDeck",
    GainAttack: "GainAttack",
    GainDefense: "GainDefense",
    GainTemporaryAttack: "GainTemporaryAttack",
    GainTemporaryDefense: "GainTemporaryDefense",
    RandomAttack: "RandomAttack",
    RandomDefense: "RandomDefense",
    AttackOpponent: "AttackOpponent",
};

export type PowerEffectType =
    (typeof PowerEffectTypes)[keyof typeof PowerEffectTypes];
