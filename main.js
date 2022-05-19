// Oliver Kovacs 2022 - lorenz-webgl - MIT

import Engine from "./engine.js";

const amount = 500;
const length = 10;

window.onload = async () => {   
    const engine = new Engine(amount, length);
    await engine.renderer.init();
    engine.start();

    document
        .querySelector("#speed")
        .setCallback(value => engine.speed = value);

    document
        .querySelector("#amount")
        .setCallback(value => engine.setAmount(value));

    document
        .querySelector("#length")
        .setCallback(value => engine.setLength(value));
};
