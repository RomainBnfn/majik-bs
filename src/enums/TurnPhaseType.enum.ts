export const TurnPhaseTypes = {
    Attack: "Attack",
    Defense: "Defense",
} as const;

export type TurnPhaseType =
    (typeof TurnPhaseTypes)[keyof typeof TurnPhaseTypes];
