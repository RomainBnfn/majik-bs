export const GamePhaseTypes = {
    OnStartGame: "OnStartGame",
    OnStartTurn: "OnStartTurn",
    BeforeAttack: "BeforeAttack",
    AfterAttack: "AfterAttack",
    BeforeDefense: "BeforeDefense",
    AfterDefense: "AfterDefense",
    OnEndTurn: "OnEndTurn",
} as const;

export type GamePhaseType =
    (typeof GamePhaseTypes)[keyof typeof GamePhaseTypes];
