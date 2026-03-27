export const PowerConditionTypes = {
    MaxHeal: "MaxHeal",
    MinHeal: "MinHeal",
    MaxCardInHand: "MaxCardInHand",
    DefenderWin: "DefenderWin",
    AttackerWin: "AttackerWin",
};

export type PowerConditionType =
    (typeof PowerConditionTypes)[keyof typeof PowerConditionTypes];
