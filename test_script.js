'use strict';

class PlayerGrid {
    constructor(sizeTwo, sizeThree, sizeFour, sizeFive, roomCode, uid) {
        this.grid = [];
        this.boatSize = 2;
        this.boatId = 1001;
        this.horizontal = true;
        this.maxSizes = [sizeTwo, sizeThree, sizeFour, sizeFive];
        this.roomCode = roomCode;
        this.uid = uid;
        this.run();
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

    changeSizesState() {
        let checkNext = false;
        let disSubmit = false;
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (this.maxSizes[radio.value - 2] === 0) {
                if (!radio.disabled) {
                    radio.disabled = true;
                    radio.checked = false;
                    checkNext = true;
                    this.boatSize = 0;    
                }
            }
            else {
                radio.disabled = false;
                disSubmit = true;
                if (checkNext) {
                    radio.checked = true;
                    this.boatSize = parseInt(radio.value);
                    checkNext = false;
                }
            }
        });
        if (disSubmit) {
            document.querySelector('input[type="button"]').disabled = true;
            return;
        }
        document.querySelector('input[type="button"]').disabled = false;
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
        let size = 0;
        console.log('Removing boat:', boatId);
        //Remove boat from grid and refactor grid
        this.grid.forEach(row => {
            row.forEach((cell, index) => {
                if (cell === boatId) {
                    row[index] = 0;
                    size++;
                }
            });
        });
        //Increment back the max number of this boat's size
        this.maxSizes[size - 2]++;
        this.changeSizesState();        
        //Redraw the table
        this.updateTable();
        console.log('Boat removed:', boatId);
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
                let x = e.target.cellIndex;
                let y = e.target.parentNode.rowIndex;
                //For horizontal direction
                if (this.horizontal) {
                    //Check if clicked on a boat
                    if (this.grid[y - 1][x - 1] >= 3) {
                        console.log('Remove boat');
                        this.removeBoat(this.grid[y - 1][x - 1]);
                        return;
                    }
                    //If the boat is out of bounds, return
                    if (x + this.boatSize > 11) {
                        console.log('Out of bounds');
                        return;
                    }
                    //Check if the boat overlaps with another boat
                    for (let i = x; i < x + this.boatSize; i++) {
                        if (this.grid[y - 1][i - 1] >= 3) {
                            console.log('Overlap');
                            return;
                        }
                    }
                    //If not, add the boat to the grid
                    for (let i = x; i < x + this.boatSize; i++) {
                        this.grid[y - 1][i - 1] = this.boatId;
                    }
                //For vertical direction
                } else {
                    //Check if clicked on a boat
                    if (this.grid[y - 1][x - 1] >= 3) {
                        console.log('Remove boat');
                        this.removeBoat(this.grid[y - 1][x - 1]);
                        return;
                    }
                    //If the boat is out of bounds, return
                    if (y + this.boatSize > 11) {
                        console.log('Out of bounds');
                        return;
                    }
                    //Check if the boat overlaps with another boat
                    for (let i = y; i < y + this.boatSize; i++) {
                        if (this.grid[i - 1][x - 1] >= 3) {
                            console.log('Overlap');
                            return;
                        }
                    }
                    //If not, add the boat to the grid
                    for (let i = y; i < y + this.boatSize; i++) {
                        this.grid[i - 1][x - 1] = this.boatId;
                    }
                }
                //Decrement the max number of this boat's size
                this.maxSizes[this.boatSize - 2]--;
                this.changeSizesState();
                //Increment boatId and redraw the table
                this.boatId++;
                this.updateTable();
            });
        });
    }

    refactorGrid() {
        let newId = 3;
        let idMap = new Map();

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
            let currentId = this.grid[i][j];
            if (currentId >= 3) {
                if (!idMap.has(currentId)) {
                idMap.set(currentId, newId++);
                }
                this.grid[i][j] = idMap.get(currentId);
            }
            }
        }
        this.updateTable();
        console.log('Grid refactored:', this.grid);
    }

    setEventButton() {
        document.querySelector('input[type="button"]').addEventListener('click', e => {
            this.refactorGrid();
            //this.sendGrid();
            console.log('Grid sent');
        });
    }

    //async sendGrid() {
    //    const data = {
    //        grid: this.grid,
    //        roomCode: this.roomCode,
    //        player: this.uid,
    //    }
    //    await fetch('https://navalbrawl.jmouzet.fr/api/sendGrid.php', {
    //        method: 'POST',
    //        headers: {
    //            'Content-Type': 'application/json'
    //        },
    //        body: JSON.stringify(data),
    //    })
    //    .then(response => response.json())
    //    .then(data => {
    //        console.log(data);
    //    })
    //}

    run() {
        this.initGrid();
        this.changeSizesState();
        this.setEventsRadio();
        this.setEventButton();
        this.setEventsTable();
    }
}

//Temp
const sizeTwo = 2;
const sizeThree = 2;
const sizeFour = 1;
const sizeFive = 2;
const roomCode = "a44506";
const uid = "c6ad1bfde2218b7d4b9bb764f6bbe950";

let playerGrid = new PlayerGrid(sizeTwo, sizeThree, sizeFour, sizeFive, roomCode, uid);
