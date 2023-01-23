const STORAGE_KEY = 'wdph_2048';

export default class LocalStorage {
    #data

    constructor() {
        this.#data = JSON.parse((window.localStorage.getItem(STORAGE_KEY)) ? window.localStorage.getItem(STORAGE_KEY) : '{}');
    }

    get data() {
        return this.#data;
    }

    set data(d) {
        this.#data = d;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    }

    clear() {
        window.localStorage.clear();
    }
}