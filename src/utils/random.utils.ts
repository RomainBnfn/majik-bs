export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const getRandomStringCode = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(getRandomInt(charactersLength));
    }
    return result;
};
