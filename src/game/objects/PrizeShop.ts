export type PrizeItem = {
    name: string,
    balls: number,
}

export class PrizeShop {
    #potentialPrizes: PrizeItem[];

    constructor(prizeCount = 5) {
        const ballCounts = new Set([...crypto.getRandomValues(new Uint8Array(prizeCount)).map((randomNumber) => {
            return (randomNumber % 10) + 1
        })].toSorted());
        const prizeNames = new Map([[2,"barely any balls"],  [4,
            "some balls"], [6,"a good amount of balls"],[8, "a lot of balls"], [10,"a heavy sack filled with balls"]]);
        this.#potentialPrizes = [...ballCounts.values()].map((ballCount) => {
            const nameKey = [...prizeNames.keys()].toSorted((a,b) => a-b).find((prizeKey) => (ballCount <= prizeKey)) ?? 2;
            console.debug("prize created", {nameKey, ballCount, keys: [...prizeNames.keys()].toSorted((a,b) => a-b)});
            return {
                name: prizeNames.get(nameKey) ?? "An unknown amount of",
                balls: ballCount,
            };
        });
        console.debug("Initialized prize shop", {potentialPrizes: this.#potentialPrizes});
    }

    getPotentialPrizes(): PrizeItem[] {
        return this.#potentialPrizes;
    }

    rollPrize(): PrizeItem {
        const [randomNumber] = crypto.getRandomValues(new Uint8Array(1));
        const prizeIndex = randomNumber % this.#potentialPrizes.length;
        const rolledPrize = this.#potentialPrizes[prizeIndex];
        console.debug("rolled prize", {rolledPrize});
        return rolledPrize;
    }
}