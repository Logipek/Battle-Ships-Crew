'use strict';


const createGameBtn = document.getElementById("create-game-btn");
const createGameSection = document.getElementById("create-game-section");

if (createGameBtn && createGameSection) {
  createGameBtn.addEventListener("click", function () {
    createGameSection.style.display = "block";
  });
}

const JoinGameBtn = document.getElementById("join");
const JoinGameSection = document.getElementById("join-party-section");

if (JoinGameBtn && JoinGameSection) {
  JoinGameBtn.addEventListener("click", function () {
    JoinGameSection.style.display = "block";
  });
}

if (createGameBtn && JoinGameSection) {
  createGameBtn.addEventListener("click", function () {
    JoinGameSection.style.display = "none";
  });

  if (JoinGameBtn && createGameSection) {
    JoinGameBtn.addEventListener("click", function () {
      createGameSection.style.display = "none";
    });
  }
}


const create = document.getElementById('form-create');
const join = document.getElementById('form-join');

async function PostCreate(e) {
    //Prevent default
    e.preventDefault();

    const pseudo = document.getElementById('create-pseudo').value;

    const data = {
        pseudo: pseudo,
    };
  
    await fetch("api/start_game.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.success) {
            alert(data.error);
        } else {
            let date = new Date();
            // Set cookie for 1 day
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = `uid=${data.uid} ; expires=${date.toUTCString()}; path=/`;
            window.location.href = `lobby.html?room=${data.code}`;
        }
    });
};

async function PostJoin(e) {
    //Prevent default
    e.preventDefault();

    const pseudo = document.getElementById('join-pseudo').value;
    const room = document.getElementById('join-room').value.toUpperCase();

    const data = {
        pseudo: pseudo,
    };
  
    await fetch(`api/start_game.php?room=${room}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        if (!data.success) {
            alert(data.error);
        } else {
            let date = new Date();
            // Set cookie for 1 day
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
            document.cookie = `uid=${data.uid} ; expires=${date.toUTCString()}; path=/`;
            window.location.href = `lobby.html?room=${room}`;
        }
    });
};

create.addEventListener('submit', (e) => PostCreate(e));
join.addEventListener('submit', (e) => PostJoin(e));
    