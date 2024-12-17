'use strict';

class PlayerGrid {
    constructor(roomCode, uid) {
        this.roomCode = roomCode;
        this.uid = uid;
        this.grid = [];

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

    buildGrid() {
        let col;
        let row;

        for (let i = 0; i < this.board.length; i++) {
            col = this.board[i].col;
            row = this.board[i].row;
            this.grid[row][col] = this.board[i].boat_id;
        }

        console.log(this.grid);
    }

    render() {
        //Apply style to cells depending on grid var
        let x;
        let y;

        document.querySelectorAll('td.p_cell').forEach(td => {
            x = parseInt(td.getAttribute('data-row'));
            y = parseInt(td.getAttribute('data-col'));
            if (this.grid[x][y] === 0) {
                td.children[0].style.backgroundColor = 'lightskyblue';
            } else {
                td.children[0].style.backgroundColor = 'gray';
                
                //Bateaux situées tout en haut
                if (x === 0) {
                    //Bateau située tout en haut à gauche
                    if (y === 0) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y + 1] === this.grid[x][y]) {
                            td.children[0].style.borderBottomLeftRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.children[0].style.borderTopRightRadius = '50%';
                        }
                    }
                    //Bateau située tout en haut à droite
                    else if (y === this.grid.length - 1) {
                        td.children[0].style.borderTopRightRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y - 1] === this.grid[x][y]) {
                            td.children[0].style.borderBottomRightRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.children[0].style.borderTopLeftRadius = '50%';
                        }
                    }
                    //Bateaux situées au milieu tout en haut
                    else {
                        //Orientation horizontale, premier morceau
                        if (this.grid[x][y + 1] === this.grid[x][y] && this.grid[x][y - 1] !== this.grid[x][y]) {
                            td.children[0].style.borderTopLeftRadius = '50%';
                            td.children[0].style.borderBottomLeftRadius = '50%';
                        }
                        //Orientation horizontale, dernier morceau
                        else if (this.grid[x][y - 1] === this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y]) {
                            td.children[0].style.borderTopRightRadius = '50%';
                            td.children[0].style.borderBottomRightRadius = '50%';
                        }
                        //Orientation verticale, premier morceau
                        else if (this.grid[x + 1][y] === this.grid[x][y]) {
                            td.children[0].style.borderTopLeftRadius = '50%';
                            td.children[0].style.borderTopRightRadius = '50%';
                        }
                    }
                }
                //Bateaux situées tout en bas
                else if (x === this.grid.length - 1) {
                    //Bateau située tout en bas à gauche
                    if (y === 0) {
                        td.children[0].style.borderBottomLeftRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y + 1] === this.grid[x][y]) {
                            td.children[0].style.borderTopLeftRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.children[0].style.borderBottomRightRadius = '50%';
                        }
                    }
                    //Bateau située tout en bas à droite
                    else if (y === this.grid.length - 1) {
                        td.children[0].style.borderBottomRightRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y - 1] === this.grid[x][y]) {
                            td.children[0].style.borderTopRightRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.children[0].style.borderBottomLeftRadius = '50%';
                        }
                    }
                    //Bateaux situées au milieu tout en bas
                    else {
                        //Orientation horizontale, premier morceau
                        if (this.grid[x][y + 1] === this.grid[x][y] && this.grid[x][y - 1] !== this.grid[x][y]) {
                            td.children[0].style.borderBottomLeftRadius = '50%';
                            td.children[0].style.borderTopLeftRadius = '50%';
                        }
                        //Orientation horizontale, dernier morceau
                        else if (this.grid[x][y - 1] === this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y]) {
                            td.children[0].style.borderBottomRightRadius = '50%';
                            td.children[0].style.borderTopRightRadius = '50%';
                        }
                        //Orientation verticale, dernier morceau
                        else if (this.grid[x - 1][y] === this.grid[x][y]) {
                            td.children[0].style.borderBottomLeftRadius = '50%';
                            td.children[0].style.borderBottomRightRadius = '50%';
                        }
                    }   
                }
                //Bateaux situées tout à gauche
                else if (y === 0) {
                    //Orientation verticale, premier morceau
                    if (this.grid[x + 1][y] === this.grid[x][y] && this.grid[x - 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        td.children[0].style.borderTopRightRadius = '50%';
                    }
                    //Orientation verticale, dernier morceau
                    else if (this.grid[x - 1][y] === this.grid[x][y] && this.grid[x + 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderBottomLeftRadius = '50%';
                        td.children[0].style.borderBottomRightRadius = '50%';
                    }
                    //Orientation horizontale, premier morceau
                    else if (this.grid[x][y + 1] === this.grid[x][y]) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        td.children[0].style.borderBottomLeftRadius = '50%';
                    }
                }
                //Bateaux situées tout à droite
                else if (y === this.grid.length - 1) {
                    //Orientation verticale, premier morceau
                    if (this.grid[x + 1][y] === this.grid[x][y] && this.grid[x - 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        td.children[0].style.borderTopRightRadius = '50%';
                    }
                    //Orientation verticale, dernier morceau
                    else if (this.grid[x - 1][y] === this.grid[x][y] && this.grid[x + 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderBottomLeftRadius = '50%';
                        td.children[0].style.borderBottomRightRadius = '50%';
                    }
                    //Orientation horizontale, dernier morceau
                    else if (this.grid[x][y - 1] === this.grid[x][y]) {
                        td.children[0].style.borderTopRightRadius = '50%';
                        td.children[0].style.borderBottomRightRadius = '50%';
                    }
                }
                //Bateaux situées au milieu
                else {
                    //Orientation horizontale, premier morceau
                    if (this.grid[x - 1][y] !== this.grid[x][y] && this.grid[x + 1][y] !== this.grid[x][y] && this.grid[x][y - 1] !== this.grid[x][y]) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        td.children[0].style.borderBottomLeftRadius = '50%';
                    }
                    //Orientation horizontale, dernier morceau
                    else if (this.grid[x - 1][y] !== this.grid[x][y] && this.grid[x + 1][y] !== this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y]) {
                        td.children[0].style.borderTopRightRadius = '50%';
                        td.children[0].style.borderBottomRightRadius = '50%';
                    }
                    //Orientation verticale, premier morceau
                    else if (this.grid[x][y - 1] !== this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y] && this.grid[x - 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderTopLeftRadius = '50%';
                        td.children[0].style.borderTopRightRadius = '50%';
                    }
                    //Orientation verticale, dernier morceau
                    else if (this.grid[x][y - 1] !== this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y] && this.grid[x + 1][y] !== this.grid[x][y]) {
                        td.children[0].style.borderBottomLeftRadius = '50%';
                        td.children[0].style.borderBottomRightRadius = '50%';
                    }
                }
            }
        });
    }


    async getGrid() {
        const data = {
            code: this.roomCode,
            uid: this.uid,
        }
        await fetch(`https://navalbrawl.jmouzet.fr/api/get_grid.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert(data.error);
            } else {
                this.board = data.board;
            }
        });
    }

    async run() {
        await this.getGrid();
        this.initGrid();
        this.buildGrid();
        this.render();
    }
}


class OpponentGrid {
    constructor(roomCode, uid) {
        this.roomCode = roomCode;
        this.uid = uid;
        this.grid = [];

        this.run();
    }

    initGrid() {
        for (let i = 0; i < 10; i++) {
            this.grid.push([]);
            for (let j = 0; j < 10; j++) {
                this.grid[i].push(1);
            }
        }
    }

    borderRadius(x, y, isHorizontal, start) {
        let elDiv = document.querySelector(`td.o_cell[data-row="${x}"][data-col="${y}"]`);
        if (isHorizontal) {
            if (start) {
                elDiv.children[0].style.borderTopLeftRadius = '50%';
                elDiv.children[0].style.borderBottomLeftRadius = '50%';
                return;
            }
            elDiv.children[0].style.borderTopRightRadius = '50%';
            elDiv.children[0].style.borderBottomRightRadius = '50%';
            return;
        }
        if (start) {
            elDiv.children[0].style.borderTopLeftRadius = '50%';
            elDiv.children[0].style.borderTopRightRadius = '50%';
            return;
        }
        elDiv.children[0].style.borderBottomLeftRadius = '50%';
        elDiv.children[0].style.borderBottomRightRadius = '50%';
    }

    boatSunk(boat_id, pos, win) {
        let x;
        let y;
        let isHorizontal;

        for (let i = 0; i < pos.length; i++) {
            x = pos[i].row;
            y = pos[i].col;
            this.grid[x][y] = boat_id;
            //Identify direction
            if (i === 0) {
                if (pos[i].row === pos[i + 1].row) {
                    //Horizontal
                    isHorizontal = true;
                } else {
                    //Vertical
                    isHorizontal = false;
                }
                this.borderRadius(x, y, isHorizontal, true);
            } else if (i === pos.length - 1) {
                this.borderRadius(x, y, isHorizontal, false);
            }
        }
        this.render(win);
    }

    async setEventsTable() {
        document.querySelectorAll('td.o_cell').forEach(td => {
            td.addEventListener('click', async () => {
                const input = {
                    code: this.roomCode,
                    uid: this.uid,
                    row: parseInt(td.getAttribute('data-row')),
                    col: parseInt(td.getAttribute('data-col')),
                }
                console.log(input);
                await fetch(`https://navalbrawl.jmouzet.fr/api/send_input.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(input),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    switch (data.return) {
                        case -1:
                            //Error
                            alert(data.error);
                            break;
                        case 0:
                            //Miss
                            td.children[0].style.backgroundColor = '';
                            this.grid[input.row][input.col] = 0;
                            break;
                        case 1:
                            //Win
                            this.grid[input.row][input.col] = 2;
                            this.boatSunk(2, data.pos, true);
                            alert('You win!');
                            break;
                        case 2:
                            //Hit
                            td.children[0].style.backgroundColor = 'gold';
                            this.grid[input.row][input.col] = 2;
                            break;
                        default:
                            //Sunk
                            this.boatSunk(data.return, data.pos, false);
                            break;
                    }
                    //Remove event listener
                    td.removeEventListener('click', () => {});
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        });
    }

    render(win) {
        let x;
        let y;

        document.querySelectorAll('td.o_cell').forEach(td => {
            x = parseInt(td.getAttribute('data-row'));
            y = parseInt(td.getAttribute('data-col'));
            if (this.grid[x][y] === 0) {
                td.children[0].style.backgroundColor = '';
            } else if (this.grid[x][y] === 1) {
                td.children[0].style.backgroundColor = 'lightgray';
            } else if (this.grid[x][y] === 2 && !win) {
                td.children[0].style.backgroundColor = 'gold';
            } else {
                td.children[0].style.backgroundColor = 'red';
            }
            td.style.backgroundColor = 'lightskyblue';
        });
    }

    async run() {
        this.initGrid();
        this.render(false);
        this.setEventsTable();
    }
}

const roomCode = new URLSearchParams(window.location.search).get('room');
const uid = document.cookie.split('; ').find(row => row.startsWith('uid')).split('=')[1];

let playerGrid = new PlayerGrid(roomCode, uid);
let opponentGrid = new OpponentGrid(roomCode, uid);