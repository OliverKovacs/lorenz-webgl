import Line from "./line.js";
import RendererSystem from "./renderer.js";
import Vector3 from "./util/vector.js";

export default class Engine {
    time = 0;
    speed = 1;
    speed_factor = 0.00004;

    constructor(lines, length) {
        this.line_length = length;
        this.lines = Array.from({ length: lines }, () => Line.from(this.line_length, [ -4, -9, 35 ]));
        this.lines.forEach((line, i) => line.points[0][0] += i * 0.05)
        this.index = 0;

        this.renderer = new RendererSystem();
    }

    start() {
        this.loop();
    }

    loop(time) {
        this.time = time;
        window.requestAnimationFrame(this.loop.bind(this));
        this.update();
        this.fill();
        this.render();
    }

    update() {
        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            const point = line.points[this.index];
            for (let j = 0; j < 3; j++) {
                const x = line.sigma * (point[1] - point[0]);
                const y = point[0] * (line.rho - point[2]) - point[1];
                const z = point[0] * point[1] - line.beta * point[2];
                point[0] += x * this.speed * this.speed_factor;
                point[1] += y * this.speed * this.speed_factor;
                point[2] += z * this.speed * this.speed_factor;
            }
            const x = line.sigma * (point[1] - point[0]);
            const y = point[0] * (line.rho - point[2]) - point[1];
            const z = point[0] * point[1] - line.beta * point[2];
            const next = (this.index + 1) % this.lines[0].points.length;
            line.points[next][0] = point[0] + x * this.speed * this.speed_factor;
            line.points[next][1] = point[1] + y * this.speed * this.speed_factor;
            line.points[next][2] = point[2] + z * this.speed * this.speed_factor;
        }
        this.index++;
        this.index %= this.lines[0].points.length;
    }

    render() {
        this.renderer.render(this);
    }

    fill() {
        let buffer = [];
        for (let i = 0; i < this.lines.length; i++) {
            buffer = buffer.concat([
                ...this.lines[i].points.slice(this.index + 1).flat(),
                ...this.lines[i].points.slice(0, this.index + 1).flat(),
            ]);
        }
        const { gl } = this.renderer;
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(buffer),
            gl.STATIC_DRAW,
        );
    }

    setAmount(n) {
        if (n < this.lines.length) {
            this.lines = this.lines.slice(0, n);
        }
        while (this.lines.length < n) {
            this.addLine();
        }
    }

    addLine() {
        this.lines.push(Line.from(this.lines[0].points.length, Vector3.add(this.lines[this.lines.length - 1].points[this.index].slice(0, 3), [ 0, 0.2, 0 ])))
    }

    setLength(n) {
        if (n < this.line_length) {
            for (let i = 0; i < this.lines.length; i++) {
                const delete_count = this.lines[i].points.length - n;
                const delete_begin = Math.max(this.index + 1 - n, 0);
                this.lines[i].points.splice(this.index + 1, delete_count);
                this.lines[i].points.splice(0, delete_begin);
                this.index -= delete_begin;
            }
        }
        for (let i = 0; i < this.lines.length; i++) {
            const last_point = this.lines[i].points[(this.index + 1) % this.lines[i].points.length];
            while (this.lines[i].points.length < n) {
                this.lines[i].points.splice(this.index + 1, 0, [ ...last_point ]);
            }
        }
        for (let i = 0; i < this.lines.length; i++) {
            for (let j = 0; j < this.lines[i].points.length; j++) {
                this.lines[i].points[j][3] = j;
            }
        }
        this.line_length = n;
        this.index %= this.lines[0].points.length;
    }
}
