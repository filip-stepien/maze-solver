export class Sleep {
    static msleep = (n: number) => {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
    };
}
