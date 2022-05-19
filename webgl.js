export default class WebGLUtil {
    static compileShader(gl, code, type) {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling ${this.shader[type]} shader:\n${gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    static async downloadShader(path) {
        const response = await fetch(path);
        return response.text();
    }

    static compileShader(gl, code, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`Error compiling ${type} shader:\n${gl.getShaderInfoLog(shader)}`);
        }

        return shader;
    }

    static async createShaderDescription(gl, vertex, fragment) {
        return [
            {
                code: await this.downloadShader(vertex),
                type: gl.VERTEX_SHADER,
            },
            {
                code: await this.downloadShader(fragment),
                type: gl.FRAGMENT_SHADER,
            },
        ];
    }

    static createProgram(gl, description) {
        const program = gl.createProgram();
        description.forEach(({ code, type }) => {
            const shader = this.compileShader(gl, code, type);
            if (shader) gl.attachShader(program, shader);
        });

        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(`Error linking shader program:\n${gl.getProgramInfoLog(program)}`);
        }

        return program;
    }

    static getUniformLocations(gl, program, description) {
        return Object.fromEntries(description.map(name => [
            name,
            gl.getUniformLocation(program, `u_${name}`),
        ]));
    }

    static getAttributeLocations(gl, program, description) {
        return Object.fromEntries(description.map(name => [
            name,
            gl.getAttribLocation(program, `a_${name}`),
        ]));
    }
}
