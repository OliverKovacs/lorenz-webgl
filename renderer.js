import WebGLUtil from "./webgl.js";
import Matrix4 from "./util/matrix.js";
import Keyboard from "./util/keyboard.js";
import Vector3 from "./util/vector.js";

export default class RendererSystem {
    time_speed = 50;
    offset_speed = 50;
    shader_frequency = 10;
    shader_phase = 0;

    translation = [ 0, 0, 0 ];
    rotation = [ 0, 0, 0, ];
    scale = Vector3.from(10);
    rotate_speed = 5;

    async init() {
        this.canvas = document.querySelector("#canvas");
        this.gl = this.canvas.getContext("webgl");

        const description = await WebGLUtil.createShaderDescription(
            this.gl,
            "./shader/vertex.glsl",
            "./shader/fragment.glsl",
        );

        this.program = WebGLUtil.createProgram(this.gl, description);
        this.uniforms = WebGLUtil.getUniformLocations(
            this.gl,
            this.program,
            [
                "resolution",
                "list",
                "config",
                "color",
                "offset",
                "matrix",
            ],
        );

        this.attributes = WebGLUtil.getAttributeLocations(
            this.gl,
            this.program,
            [
                "position",
            ],
        );

        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.useProgram(this.program);
        this.gl.enableVertexAttribArray(this.attributes.position);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

        this.update_canvas_size();
        window.onresize = this.update_canvas_size;

        const info = this.gl.getExtension('WEBGL_debug_renderer_info');
        const vendor = this.gl.getParameter(info.UNMASKED_VENDOR_WEBGL);
        const renderer = this.gl.getParameter(info.UNMASKED_RENDERER_WEBGL);
        const shader = this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION);
        const webgl = this.gl.getParameter(this.gl.VERSION);
        
        document.getElementById("vendor").textContent = vendor;
        document.getElementById("renderer").textContent = renderer;
        document.getElementById("shader").textContent = shader;
        document.getElementById("webgl").textContent = webgl;


        document
            .querySelector("#rotate")
            .setCallback(value => this.rotate_speed = value);

        document.querySelector("#size").setCallback(value => {
            this.scale = Vector3.from(value / 5);
            return value;
        });
        document.querySelector("#time-speed").setCallback(value => {
            this.time_speed = value;
            this.update_shader_uniform();
        });
        document.querySelector("#offset-speed").setCallback(value => {
            this.offset_speed = value;
            this.update_shader_uniform();
        });
        document.querySelector("#shader-frequency").setCallback(value => {
            this.shader_frequency = value;
            this.update_shader_uniform();
        });
        document.querySelector("#shader-phase").setCallback(value => {
            this.shader_phase = value;
            this.update_shader_uniform();
            return value / 50;
        });
    }

    render(engine) {
        this.rotation = Vector3.add(
            this.rotation,
            Vector3.scalar([ 0.0003, 0.002, 0.005 ], this.rotate_speed / 5),
        );
        this.rotation = Vector3.add(
            this.rotation,
            Vector3.scalar(
                [ Keyboard.Digit1, Keyboard.Digit2, Keyboard.Digit3 ],
                (2 * Keyboard.ShiftLeft - 1) * 0.04,
            ),
        );

        let matrix = Matrix4.identity();
        matrix = Matrix4.translate(matrix, this.translation[0], this.translation[2], this.translation[1]);
        matrix = Matrix4.rotate_x(matrix, this.rotation[0]);
        matrix = Matrix4.rotate_y(matrix, this.rotation[1]);
        matrix = Matrix4.rotate_z(matrix, this.rotation[2]);
        matrix = Matrix4.scale(matrix, ...this.scale);
                
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform2f(
            this.uniforms.resolution,
            this.gl.canvas.width,
            this.gl.canvas.height,
        );
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

        const size = 4;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        this.gl.vertexAttribPointer(
            this.attributes.position,
            size,
            type,
            normalize,
            stride,
            offset
        );

        this.gl.uniformMatrix4fv(this.uniforms.matrix, false, matrix);
        this.gl.uniform3f(
            this.uniforms.list,
            engine.index,
            engine.lines[0].points.length,
            engine.time
        );

        const mode = this.gl.LINE_STRIP;
        const count = engine.lines[0].points.length - 1;
        for (let i = 0; i < engine.lines.length; i++) {
            const first = i * engine.lines[0].points.length;
            this.gl.uniform1f(this.uniforms.offset, i);
            this.gl.drawArrays(mode, first, count);
        }
    }

    update_canvas_size() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update_shader_uniform() {
        this.gl.uniform4f(
            this.uniforms.config,
            this.time_speed,
            this.offset_speed,
            this.shader_frequency,
            this.shader_phase,
        );
    }
}
