export default class Line {
    static from(length, start) {
        return {
            points: Array.from({ length }, (_, i) => [ ...start, i ]),
            sigma: 10,
            beta: 8 / 3,
            rho: 28,
        };
    }
};
