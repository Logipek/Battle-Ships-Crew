'use strict';

class PlayerGrid {
    constructor() {
        this.grid = [];
        this.boat = 2;
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
            radio.addEventListener('change', function() {
                this.boat = this.value;
                console.log('Boat size:', this.boat);
            });
        });
    }

    updateTable() {
        document.querySelectorAll('table tr:not(:first-child) td:not(:first-child)').forEach(td => {
            let x = td.cellIndex - 1;
            let y = td.parentNode.rowIndex - 1;
            if (this.grid[y][x] === 0) {
                td.style.backgroundColor = 'lightskyblue';
            } else {
                td.style.backgroundColor = 'gold';
            }
        });
    }
    
    setEventsTable() {
        document.querySelectorAll('table tr:not(:first-child) td:not(:first-child)').forEach(td => {
            td.addEventListener('contextmenu', e => {
                e.preventDefault();
                this.horizontal = !this.horizontal;
                console.log('Horizontal:', this.horizontal);
            });
            td.addEventListener('mouseover', e => {
                let x = e.target.cellIndex;
                let y = e.target.parentNode.rowIndex;
                if (this.horizontal) {
                    if (x + this.boat > 11) {
                        e.target.parentNode.children[x].style.backgroundColor = 'lightcoral';
                        return;
                    }
                    for (let i = x; i < x + this.boat; i++) {
                        if (e.target.parentNode.children[i].style.backgroundColor === 'gold') {
                            e.target.parentNode.children[i].style.backgroundColor = 'lightcoral';
                            return;
                        }
                        e.target.parentNode.children[i].style.backgroundColor = 'lightgreen';
                    }
                } else {
                    if (y + this.boat > 11) {
                        return;
                    }
                    for (let i = y; i < y + this.boat; i++) {
                        e.target.parentNode.parentNode.children[i].children[x].style.backgroundColor = 'lightgreen';
                    }
                }
            });
            td.addEventListener('mouseout', e => {
                document.querySelectorAll('table tr:not(:first-child) td:not(:first-child)').forEach(td => {
                    this.updateTable();
                    if (td.style.backgroundColor === 'gold') {
                        return;
                    }
                    td.style.backgroundColor = 'lightskyblue';
                });
            });
            td.addEventListener('click', e => {
                let x = e.target.cellIndex - 1;
                let y = e.target.parentNode.rowIndex - 1;
                console.log('Clicked:', x, y);
                if (this.horizontal) {
                    if (x + this.boat > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    for (let i = x; i < x + this.boat; i++) {
                        if (this.grid[y][i] !== 0) {
                            console.log('Boat overlap');
                            return;
                        }
                    }
                    for (let i = x; i < x + this.boat; i++) {
                        this.grid[y][i] = this.boat;
                    }
                } else {
                    if (y + this.boat > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    for (let i = y; i < y + this.boat; i++) {
                        if (this.grid[i][x] !== 0) {
                            console.log('Boat overlap');
                            return;
                        }
                    }
                    for (let i = y; i < y + this.boat; i++) {
                        this.grid[i][x] = this.boat;
                    }
                }
                console.log('Grid:', this.grid);
                this.updateTable();
            });
        });
    }
}

let playerGrid = new PlayerGrid();
