export class Random {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive).
     */
    public static randomInt(min: number, max: number) {
        if (min > max) throw new Error('No numbers in the given range.');

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static randomIndex<T>(arr: T[]): number {
        return Math.floor(Math.random() * arr.length);
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    public static shuffle<T>(array: T[]) {
        let currentIndex = array.length;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
    }
}
