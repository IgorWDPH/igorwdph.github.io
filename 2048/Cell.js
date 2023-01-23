export default class Cell {
    #cellElement; //private variable
    #x; //private variable
    #y; //private variable
    #tile; //private variable
    #mergeTile; //private variable

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    set tile(value) {
        this.#tile = value;
        if(value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
         
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if(value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value));
    }

    mergeTiles() {
        if(this.tile == null || this.mergeTile == null) return 0;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
        return this.tile.value;
    }
}