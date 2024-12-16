'use strict';

class PlayerGrid {
    constructor() {
        this.grid = [];
        this.boatSize = 2;
        this.boatId = 3;
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

    resetRadius(elDiv) {
        elDiv.style.borderTopLeftRadius = '0';
        elDiv.style.borderTopRightRadius = '0';
        elDiv.style.borderBottomLeftRadius = '0';
        elDiv.style.borderBottomRightRadius = '0';
    }

    borderRadius(elDiv, start) {
        this.resetRadius(elDiv);
        if (this.horizontal) {
            if (start) {
                elDiv.style.borderTopLeftRadius = '50%';
                elDiv.style.borderBottomLeftRadius = '50%';
                return;
            }
            elDiv.style.borderTopRightRadius = '50%';
            elDiv.style.borderBottomRightRadius = '50%';
            return;
        }
        if (start) {
            elDiv.style.borderTopLeftRadius = '50%';
            elDiv.style.borderTopRightRadius = '50%';
            return;
        }
        elDiv.style.borderBottomLeftRadius = '50%';
        elDiv.style.borderBottomRightRadius = '50%';
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

    removeBoat(boatId) {
        //Remove boat from grid and refactor grid
        this.grid.forEach(row => {
            row.forEach((cell, index) => {
                if (cell === boatId) {
                    row[index] = 0;
                }
                if (cell > boatId) {
                    row[index]--;
                }
            });
        });
        this.boatId--;
        //Remove boat from table
        this.updateTable();
    }
    
    setEventsTable() {
        document.querySelectorAll('td.main').forEach(td => {
            //Contextmenu event
            td.addEventListener('contextmenu', e => {
                //Prevent default context menu
                e.preventDefault();
                //Send mouseout event to remove green cells
                td.dispatchEvent(new MouseEvent('mouseout'));
                //Change direction
                this.horizontal = !this.horizontal;
                //Send mouseover event to redraw green cells
                td.dispatchEvent(new MouseEvent('mouseover'));
            });
            //Mouseover event
            td.addEventListener('mouseover', e => {
                let x = e.target.cellIndex;
                let y = e.target.parentNode.rowIndex;
                //For horizontal direction
                if (this.horizontal) {
                    //If the cell contains a boat, change color to red
                    if (e.target.parentNode.children[x].children[0].style.backgroundColor === 'gold') {
                        e.target.parentNode.children[x].children[0].style.backgroundColor = 'lightcoral';
                        return;
                    }
                    //If the boat is out of bounds, return
                    if (x + this.boatSize > 11) {
                        return;
                    }
                    //Check if the boat overlaps with another boat
                    let overlap = false;
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (e.target.parentNode.children[i].children[0].style.backgroundColor === 'gold') {
                            overlap = true;
                            break;
                        }
                    }
                    //If there's an overlap, return
                    if (overlap) {
                        return;
                    }
                    //If not, change color to green
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (i === x) {
                            this.borderRadius(e.target.parentNode.children[i].children[0], true);
                        }
                        else if (i === x + this.boatSize - 1) {
                            this.borderRadius(e.target.parentNode.children[i].children[0], false);
                        }
                        else {
                            this.resetRadius(e.target.parentNode.children[i].children[0]);
                        }
                        e.target.parentNode.children[i].children[0].style.backgroundColor = 'lightgreen';
                    }
                //For vertical direction
                } else {
                    //If the cell contains a boat, change color to red
                    if (e.target.parentNode.parentNode.children[y].children[x].children[0].style.backgroundColor === 'gold') {
                        e.target.parentNode.parentNode.children[y].children[x].children[0].style.backgroundColor = 'lightcoral';
                        return;
                    }
                    //If the boat is out of bounds, return
                    if (y + this.boatSize > 11) {
                        return;
                    }
                    //Check if the boat overlaps with another boat
                    let overlap = false;
                    for (let i = y; i < y + this.boatSize; i++) {
                        if (e.target.parentNode.parentNode.children[i].children[x].children[0].style.backgroundColor === 'gold') {
                            overlap = true;
                            break;
                        }
                    }
                    //If there's an overlap, return
                    if (overlap) {
                        return;
                    }
                    //If not, change color to green
                    for (let i = y; i < y + this.boatSize; i++) {
                        if (i === y) {
                            this.borderRadius(e.target.parentNode.parentNode.children[i].children[x].children[0], true);
                        }
                        else if (i === y + this.boatSize - 1) {
                            this.borderRadius(e.target.parentNode.parentNode.children[i].children[x].children[0], false);
                        }
                        else {
                            this.resetRadius(e.target.parentNode.parentNode.children[i].children[x].children[0]);
                        }
                        e.target.parentNode.parentNode.children[i].children[x].children[0].style.backgroundColor = 'lightgreen';
                    }
                }
            });
            //Mouseout event
            td.addEventListener('mouseout', e => {
                //Redraw the table
                this.updateTable();
            });
            //Click event
            td.addEventListener('click', e => {
                let x = e.target.cellIndex - 1;
                let y = e.target.parentNode.rowIndex - 1;
                //For horizontal direction
                if (this.horizontal) {
                    //Check if the boat overlaps with another boat
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (this.grid[y][i] !== 0) {
                            //If there's an overlap, remove the boat
                            this.removeBoat(this.grid[y][i]);
                            return;
                        }
                    }
                    //If the boat is out of bounds, return
                    if (x + this.boatSize > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    //If not, add the boat to the grid
                    for (let i = x; i < x + this.boatSize; i++) {
                        this.grid[y][i] = this.boatId;
                    }
                //For vertical direction
                } else {
                    //Check if the boat overlaps with another boat
                    for (let i = y; i < y + this.boatSize; i++) {
                        if (this.grid[i][x] !== 0) {
                            //If there's an overlap, remove the boat
                            this.removeBoat(this.grid[i][x]);
                            return;
                        }
                    }
                    //If the boat is out of bounds, return
                    if (y + this.boatSize > 10) {
                        console.log('Out of bounds');
                        return;
                    }
                    //If not, add the boat to the grid
                    for (let i = y; i < y + this.boatSize; i++) {
                        this.grid[i][x] = this.boatId;
                    }
                }
                //Increment boatId and redraw the table
                this.boatId++;
                this.updateTable();
            });
        });
    }
}

let playerGrid = new PlayerGrid();
