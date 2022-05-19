export default class Keyboard {

    static #__INIT__ = this.init();

    static init() {

        // alhpabet
        for (let i = 0; i < 26; i++) {
            let char = String.fromCharCode(65 + i);
            this[`Key${char}`] = 0;
        }

        // number row and numpad
        for (let i = 0; i < 10; i++) {
            this[`Digit${i}`] = 0;
            this[`Numpad${i}`] = 0;
        }

        // function keys
        for (let i = 0; i < 12; i++) {
            this[`F${i + 1}`] = 0;
        }

        // special keys
        [
            "Escape",
            "Backquote",
            "Tab",
            "ShiftLeft",
            "ShiftRight",
            "ControlLeft",
            "ControlRight",
            "MetaLeft",
            "MetaRight",
            "AltLeft",
            "ContextMenu",
            "Enter",
            "Backspace",
            "Minus",
            "Equal",
            "BracketLeft",
            "BracketRIght",
            "Semicolon",
            "Quote",
            "Backslash",
            "Comma",
            "Period",
            "Slash",
            "Insert",
            "Delete",
            "Home",
            "End",
            "PageUp",
            "PageDown",
            "Scrollback",
            "Pause",
            "NumpadLock",
            "NumpadDivide",
            "NumpadMultiply",
            "NumpadSubtract",
            "NumpadAdd",
            "NumpadEnter",
            "NumpadDecimal",
        ].forEach(key => this[key] = 0);

        // arrow keys
        [
            "Left",
            "Up",
            "Right",
            "Down"
        ].forEach(key => this[`Arrow${key}`] = 0);
        

        document.addEventListener("keyup", event => this.keyUp(event));
        document.addEventListener("keydown", event => this.keyDown(event));
    }

    static keyUp(event) {
        this[event.code] = 0;
    }

    static keyDown(event) {
        this[event.code] = 1;
    }
}
