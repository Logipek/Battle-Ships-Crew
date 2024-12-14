'use strict';

class PlayerGrid {
    constructor() {
        this.grid = [];
        this.boatSize = 2;
        this.horizontal = true;
        this.initGrid();
        this.setEventsRadio();
        this.setEventsTable();
    }

    initGrid() {
        for (let i = 0; i < 10; i++) {
            this.grid.push([]);
            for (let j = 0; j < 10; j++) {
                this.grid[i].push(0);
            }
        }
    }

    setEventsRadio() {
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', e => {
                this.boatSize = parseInt(e.target.value);
                console.log('Boat size:', this.boatSize);
            });
        });
    }

    updateTable() {
        document.querySelectorAll('td.main').forEach(td => {
            let x = td.cellIndex - 1;
            let y = td.parentNode.rowIndex - 1;
            if (this.grid[y][x] === 0) {
                td.children[0].style.backgroundColor = 'lightskyblue';
            } else {
                td.children[0].style.backgroundColor = 'gold';
            }
        });
    }

    removeBoat() {
        document.querySelectorAll('td.main').forEach(td => {
            let x = td.cellIndex - 1;
            let y = td.parentNode.rowIndex - 1;
            if (this.grid[y][x] === this.boatSize) {
                this.grid[y][x] = 0;
            }
        });
    }
    
    setEventsTable() {
        document.querySelectorAll('td.main').forEach(td => {
            td.addEventListener('contextmenu', e => {
                e.preventDefault();
                td.dispatchEvent(new MouseEvent('mouseout'));
                this.horizontal = !this.horizontal;
                td.dispatchEvent(new MouseEvent('mouseover'));
                console.log('Horizontal:', this.horizontal);
            });
            td.addEventListener('mouseover', e => {
                let x = e.target.cellIndex;
                let y = e.target.parentNode.rowIndex;
                if (this.horizontal) {
                    if (x + this.boatSize > 11) {
                        //e.target.parentNode.children[x].children[0].style.backgroundColor = 'lightcoral';
                        return;
                    }
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (e.target.parentNode.children[i].children[0].style.backgroundColor === 'gold') {
                            e.target.parentNode.children[i].children[0].style.backgroundColor = 'lightcoral';
                        }
                        e.target.parentNode.children[i].children[0].style.backgroundColor = 'lightgreen';
                    }
                } else {
                    if (y + this.boatSize > 11) {
                        return;
                    }
                    for (let i = y; i < y + this.boatSize; i++) {
                        e.target.parentNode.parentNode.children[i].children[x].children[0].style.backgroundColor = 'lightgreen';
                    }
                }
            });
            td.addEventListener('mouseout', e => {
                document.querySelectorAll('td.main').forEach(td => {
                    this.updateTable();
                    if (td.children[0].style.backgroundColor === 'gold') {
                        return;
                    }
                    td.children[0].style.backgroundColor = 'lightskyblue';
                });
            });
            td.addEventListener('click', e => {
                let x = e.target.cellIndex - 1;
                let y = e.target.parentNode.rowIndex - 1;
                console.log('Clicked:', x, y);
                if (this.horizontal) {
                    if (x + this.boatSize > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (this.grid[y][i] !== 0) {
                            this.removeBoat();
                            return;
                        }
                    }
                    for (let i = x; i < x + this.boatSize; i++) {
                        this.grid[y][i] = this.boatSize;
                    }
                } else {
                    if (y + this.boatSize > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    for (let i = y; i < y + this.boatSize; i++) {
                        if (this.grid[i][x] !== 0) {
                            this.removeBoat();
                            return;
                        }
                    }
                    for (let i = y; i < y + this.boatSize; i++) {
                        this.grid[i][x] = this.boatSize;
                    }
                }
                console.log('Grid:', this.grid);
                this.updateTable();
            });
        });
    }
}

let playerGrid = new PlayerGrid();
