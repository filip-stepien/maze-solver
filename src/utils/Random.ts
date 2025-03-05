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
}
