import Grid from './Grid.js';
import Tile from './Tile.js';
import LocalStorage from './LocalStorage.js';

const locStorage = new LocalStorage();
const gameBoard = document.getElementById('game-board');
let target = locStorage.data.target ? locStorage.data.target : document.getElementById('target').value;
const score = locStorage.data.score ? locStorage.data.score : 0;
const bestScore = locStorage.data.bestScore ? locStorage.data.bestScore : 0;
let settigns = { gridSize : document.getElementById('grid-size').value, bestScore: bestScore, target: target }

const grid = new Grid(gameBoard, settigns);
updateScore();
if(locStorage.data.gridSize && locStorage.data.gridSize === parseInt(locStorage.data.gridSize, 10)) {
    document.getElementById('grid-size').value = locStorage.data.gridSize;
}
if(target) {
    document.getElementById('target').value = target;
}

if(isWin()) {
    showWin();
}
else if(isLose()) {
    showLose();
}
else setupInput();

document.getElementById('settings-reset-button').addEventListener('click', (e) => {    
    reset(e);
    document.getElementById('messages').classList.remove('win', 'lose');
});
document.getElementById('messages-reset-button').addEventListener('click', (e) => {
    reset(e);
    document.getElementById('messages').classList.remove('win', 'lose');
});

window.addEventListener('resize', function(event) {
    if(!grid || !grid.cells) return;
    grid.cells.forEach(cell => {
        if(!cell.tile) return;
        cell.tile.setTileFontSize();
    });
}, true);

function reset(e) {
    if(!grid) return;    
    target = document.getElementById('target').value;
    settigns = { ...settigns, bestScore: grid.bestScore, target: document.getElementById('target').value, gridSize : document.getElementById('grid-size').value }    
    grid.resetGrid(settigns);
    updateScore();
    setupInput();
}

function setupInput() {
    window.addEventListener('keydown', handleInput, { once : true });
}

async function handleInput(e) {
    switch(e.key) {
        case 'ArrowUp':
            if(!canMoveUp()) {
                setupInput();
                return;
            }
            await moveUp();
            break;
        case 'ArrowDown':
            if(!canMoveDown()) {
                setupInput();
                return;
            }
            await moveDown();
            break;
        case 'ArrowLeft':
            if(!canMoveLeft()) {
                setupInput();
                return;
            }
            await moveLeft();
            break;
        case 'ArrowRight':
            if(!canMoveRight()) {
                setupInput();
                return;
            }
            await moveRight();
            break;
        default:
            setupInput();
            return;
    }
    grid.cells.forEach(cell => grid.score += cell.mergeTiles());
    if(grid.score > grid.bestScore) grid.bestScore = grid.score;
    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;
    grid.saveGridToLocalStorage();
    updateScore();
    if(isWin()) {
        newTile.waitForTransition(true).then(() => {
            showWin();
        });
        return;
    }
    else if(isLose()) {
        newTile.waitForTransition(true).then(() => {
            showLose();
        });
    }
    else {
        setupInput();
    }    
}

function isLose(newTile) {
    return !canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight();
}

function isWin(newTile) {
    return grid.cells.some((cell) => cell.tile instanceof Tile && cell.tile.value >= target);
}

function showWin() {
    document.getElementById('messages').classList.add('win');
}

function showLose() {
    document.getElementById('messages').classList.add('lose');
}

function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(group => {
        const promises = [];
        for(let i = 1; i < group.length; i++) {            
            const cell = group[i];
            if(cell.tile == null) continue;
            let lastValidCell;
            for(let j = i - 1; j >= 0; j--) {
                const moveToCell = group[j];
                if(!moveToCell.canAccept(cell.tile)) {
                    break;
                }
                lastValidCell = moveToCell;
            }
            if(lastValidCell != null) {
                promises.push(cell.tile.waitForTransition());
                if(lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile;
                }
                else {
                    lastValidCell.tile = cell.tile;
                }
                cell.tile = null;
            }
        }
        return promises;
    }));
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if(index === 0) return false;
            if(cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile);
        });
    })
}

function updateScore() {
    document.getElementById('score').innerHTML = grid.score;
    document.getElementById('best-score').innerHTML = grid.bestScore;
}

function canMoveUp() {
    return canMove(grid.cellsByColumn);
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
}

function canMoveLeft() {
    return canMove(grid.cellsByRow);
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(column => [...column].reverse()));
}

function moveUp() {
    return slideTiles(grid.cellsByColumn);
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
    return slideTiles(grid.cellsByRow);
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(column => [...column].reverse()));
}