import LocalStorage from './LocalStorage.js';
import Cell from './Cell.js';
import Tile from './Tile.js';

const GRID_SIZE = 4;
const CELL_GAP = 1.5;
const TARGET = 2048;

export default class Grid {
    #cells; //private variable
    #localStorage;
    #gridSize;
    #cellSize;
    #gridElement;
    #target;
    #score;
    #bestScore;

    constructor(gridElement, settings) {
        this.#gridElement = gridElement;
        this.#init(settings);
    }

    #init(settings) {
        this.#localStorage = new LocalStorage();
        if(Array.isArray(this.#localStorage.data.tiles) && this.#localStorage.data.tiles.length) {
            this.#gridSize = this.#localStorage.data.gridSize;
        }
        else {
            this.#gridSize = (!isNaN(Number(settings.gridSize))) ? Number(settings.gridSize) : GRID_SIZE;
        }
        if(this.#localStorage.data.target) {
            this.#target = this.#localStorage.data.target;
        }
        else if(settings.target) {
            this.#target = settings.target;
        }
        else {
            this.#target = TARGET;
        }
        if(this.#localStorage.data.score) {
            this.#score = this.#localStorage.data.score;
        }
        else {
            this.#score = 0;
        }
        if(this.#localStorage.data.bestScore) {
            this.#bestScore = this.#localStorage.data.bestScore;
        }
        else if(settings.bestScore) {
            this.#bestScore = settings.bestScore;
        }
        else {
            this.#bestScore = 0;
        }

        this.#localStorage.data = { ...this.#localStorage.data, gridSize: this.#gridSize };
        this.#cellSize = 100 / this.#gridSize - 4;

        this.#gridElement.innerHTML = '';
        this.#gridElement.style.setProperty('--grid-size', this.#gridSize);
        this.#gridElement.style.setProperty('--cell-size', `${this.#cellSize}vmin`);
        this.#gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`);

        this.#cells = this.#createCellElements(this.#gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % this.#gridSize, Math.floor(index / this.#gridSize));
        });
        if(Array.isArray(this.#localStorage.data.tiles) && this.#localStorage.data.tiles.length) {
            this.#cells.forEach(cell => {
                this.#localStorage.data.tiles.forEach(tile => {
                    if(cell.x == tile.x && cell.y == tile.y) {
                        const newTile = new Tile(this.#gridElement, tile.value);
                        newTile.x = tile.x;
                        newTile.y = tile.y;
                        cell.tile = newTile;
                    }
                });
            });            
        }
        else {
            this.randomEmptyCell().tile = new Tile(this.#gridElement);
            this.randomEmptyCell().tile = new Tile(this.#gridElement);
        }
        this.saveGridToLocalStorage();
    }

    get cells() {
        return this.#cells;
    }

    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || [];
            cellGrid[cell.x][cell.y] = cell;
            return cellGrid;
        }, []);
    }

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || [];
            cellGrid[cell.y][cell.x] = cell;
            return cellGrid;
        }, []);
    }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null);
    }

    get score() {
        return this.#score;
    }

    set score(s) {
        this.#score = s;
    }

    get bestScore() {
        return this.#bestScore;
    }

    set bestScore(s) {
        this.#bestScore = s;
    }
    
    #createCellElements(gridElement) {
        const cells = [];
        for(let i = 0; i < this.#gridSize * this.#gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cells.push(cell);
            gridElement.append(cell);
        }
        return cells;   
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
    
    resetGrid(settigns) {
        this.#localStorage.clear();
        this.#init({ ...settigns, bestScore: settigns.bestScore });
    }

    saveGridToLocalStorage() {
        console.log(this.bestScore);
        this.#localStorage.data = {...this.#localStorage.data, score: this.score, bestScore: this.bestScore, target: this.#target, gridSize: Math.sqrt(this.#cells.length), tiles: this.#cells.filter((cellElement) => {
            if(cellElement.tile) return true;
            return false;
        }).map(function(cellElement) {
            return { value: cellElement.tile.value, x: cellElement.tile.x, y: cellElement.tile.y }
        })};
    }
}