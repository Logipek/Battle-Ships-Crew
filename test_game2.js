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
            this.grid[col][row] = this.board[i].boat_id;
        }

        console.log(this.grid);
    }

    render() {
        //Apply style to cells depending on grid var
        let x;
        let y;

        document.querySelectorAll('td.p_cell').forEach(td => {
            x = td.getAttribute('data-x');
            y = td.getAttribute('data-y');
            if (this.grid[x][y] === 0) {
                td.style.backgroundColor = 'lightskyblue';
            } else {
                td.style.backgroundColor = 'gray';
                
                //Bateaux situées tout en haut
                if (x === 0) {
                    //Bateau située tout en haut à gauche
                    if (y === 0) {
                        td.style.borderTopLeftRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y + 1] === this.grid[x][y]) {
                            td.style.borderBottomLeftRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.style.borderTopRightRadius = '50%';
                        }
                    }
                    //Bateau située tout en haut à droite
                    else if (y === this.grid.length - 1) {
                        td.style.borderTopRightRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y - 1] === this.grid[x][y]) {
                            td.style.borderBottomRightRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.style.borderTopLeftRadius = '50%';
                        }
                    }
                    //Bateaux situées au milieu tout en haut
                    else {
                        //Orientation horizontale, premier morceau
                        if (this.grid[x][y + 1] === this.grid[x][y] && this.grid[x][y - 1] !== this.grid[x][y]) {
                            td.style.borderTopLeftRadius = '50%';
                            td.style.borderBottomLeftRadius = '50%';
                        }
                        //Orientation horizontale, dernier morceau
                        else if (this.grid[x][y - 1] === this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y]) {
                            td.style.borderTopRightRadius = '50%';
                            td.style.borderBottomRightRadius = '50%';
                        }
                        //Orientation verticale, premier morceau
                        else if (this.grid[x + 1][y] === this.grid[x][y]) {
                            td.style.borderTopLeftRadius = '50%';
                            td.style.borderTopRightRadius = '50%';
                        }
                    }
                }
                //Bateaux situées tout en bas
                else if (x === this.grid.length - 1) {
                    //Bateau située tout en bas à gauche
                    if (y === 0) {
                        td.style.borderBottomLeftRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y + 1] === this.grid[x][y]) {
                            td.style.borderTopLeftRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.style.borderBottomRightRadius = '50%';
                        }
                    }
                    //Bateau située tout en bas à droite
                    else if (y === this.grid.length - 1) {
                        td.style.borderBottomRightRadius = '50%';
                        //Si orientation horizontale
                        if (this.grid[x][y - 1] === this.grid[x][y]) {
                            td.style.borderTopRightRadius = '50%';
                        }
                        //Si orientation verticale
                        else {
                            td.style.borderBottomLeftRadius = '50%';
                        }
                    }
                    //Bateaux situées au milieu tout en bas
                    else {
                        //Orientation horizontale, premier morceau
                        if (this.grid[x][y + 1] === this.grid[x][y] && this.grid[x][y - 1] !== this.grid[x][y]) {
                            td.style.borderBottomLeftRadius = '50%';
                            td.style.borderTopLeftRadius = '50%';
                        }
                        //Orientation horizontale, dernier morceau
                        else if (this.grid[x][y - 1] === this.grid[x][y] && this.grid[x][y + 1] !== this.grid[x][y]) {
                            td.style.borderBottomRightRadius = '50%';
                            td.style.borderTopRightRadius = '50%';
                        }
                        //Orientation verticale, dernier morceau
                        else if (this.grid[x - 1][y] === this.grid[x][y]) {
                            td.style.borderBottomLeftRadius = '50%';
                            td.style.borderBottomRightRadius = '50%';
                        }
                    }   
                }
                //Bateaux situées tout à gauche
                
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
    }
}

class opponentGrid {
    constructor() {
    }
}

const roomCode = new URLSearchParams(window.location.search).get('room');
const uid = document.cookie.split('; ').find(row => row.startsWith('uid')).split('=')[1];

let playerGrid = new PlayerGrid(roomCode, uid);