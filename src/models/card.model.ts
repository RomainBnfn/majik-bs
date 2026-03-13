export type Card = {
    id: string,
    name: string,
    image: string,
    defense: number,
    attack: number,
    rarity: {
        id: string,
        name: string,
        color: string
    },
    description: string
}