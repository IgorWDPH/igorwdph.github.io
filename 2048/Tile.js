export default class Tile {
    #tileElement;
    #x;
    #y;
    #value;

    constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
        this.#tileElement = document.createElement('div');
        this.#tileElement.classList.add('tile');
        tileContainer.append(this.#tileElement);
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        this.#tileElement.textContent = v;
        const power = Math.log2(v);
        const backgroundLightness = 100 - power * 9;
        this.#tileElement.style.setProperty('--background-lightness', `${backgroundLightness}%`);
        this.#tileElement.style.setProperty('--text-lightness', `${backgroundLightness <= 50 ? 90 : 10}%`);
        this.setTileFontSize();
    }

    get x() {
        return this.#x;
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty('--x', value);
    }

    get y() {
        return this.#y;
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty('--y', value);
    }

    setTileFontSize() {
        this.#tileElement.style.setProperty('--tile-font-size', `${this.#tileElement.offsetWidth / this.#value.toString().length}px`);
    }

    remove() {
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? 'animationend' : 'transitionend', resolve, { once: true });
        });
    }
}