import style from "./ui-overlay.css.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        ${style}
    </style>
    <div id="overlay">
        <slot>
    </div>
`;

class UIOverlay extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.on = (this.getAttribute("on") ?? "true ") === "true";
        this.render();

        document.addEventListener("keydown", ({ code }) => {
            if (code != "KeyS") return;
            this.toggle();
        });
    }

    toggle() {
        this.on = !this.on;
        this.render();
    }

    render() {
        this.style.display = this.on
            ? "block"
            : "none";
    }
}

window.customElements.define("ui-overlay", UIOverlay);
