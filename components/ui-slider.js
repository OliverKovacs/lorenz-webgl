import style from "./ui-slider.css.js";

const template = document.createElement("template");
template.innerHTML = `
    <style>
        ${style}
    </style>
    <div>
        <dl>
            <dt>
                <slot>
            </dt>
            <dd></dd>
        </dl>
        <input type="range" min=0 max=100>
    </div>
`;

class UISlider extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.callback = n => n;
    }

    connectedCallback() {
        const dd = this.shadowRoot.querySelector("dd");
        const input = this.shadowRoot.querySelector("input");
        input.setAttribute("max", this.getAttribute("max") ?? 100);
        input.setAttribute("min", this.getAttribute("min") ?? 0);
        const id = this.getAttribute("id");
        const value = localStorage.getItem(id) ?? +this.getAttribute("default") ?? 50;
        input.value = value;
        localStorage.setItem(id, value);
        input.oninput = ({ target }) => {
            const value = +target.value;
            const result = this.callback(value)?.toFixed(2) ?? value;
            dd.innerHTML = result;
            localStorage.setItem(id, value);    // TODO debounce
        }
    }

    setCallback(callback) {
        this.callback = callback;
        const value = +this.shadowRoot.querySelector("input").value;
        const result = this.callback(value)?.toFixed(2) ?? value;
        const dd = this.shadowRoot.querySelector("dd");
        dd.innerHTML = result;
    }
}

window.customElements.define("ui-slider", UISlider);
