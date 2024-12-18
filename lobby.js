'use strict';

//Update invite-code
const code = new URLSearchParams(window.location.search).get('room');
document.getElementById('invite-code').innerText = code;

// Fonction pour mettre à jour les compteurs de bateaux
function updateShipCount(type, value) {
const shipCounts = {
    cruiser: 'cruiser-count',
    submarine: 'submarine-count',
    torpedo: 'torpedo-count',
    'aircraft-carrier': 'aircraft-carrier-count'
};

const currentCount = parseInt(document.getElementById(shipCounts[type]).innerText);
const newCount = currentCount + value;
document.getElementById(shipCounts[type]).innerText = newCount <= 5 ? newCount : 5;
}


// function retirer les bateaux

function deleteBoat(type, value) {
const shipCounts = {
    cruiser: 'cruiser-count',
    submarine: 'submarine-count',
    torpedo: 'torpedo-count',
    'aircraft-carrier': 'aircraft-carrier-count'
};

const currentCount = parseInt(document.getElementById(shipCounts[type]).innerText);
const newCount = currentCount - value;
document.getElementById(shipCounts[type]).innerText = newCount >= 0 ? newCount : 0;
}

// Fonction pour copier le lien d'invitation
function copyInvite() {
const inviteText = document.getElementById('invite-code').innerText;
const textArea = document.createElement('textarea');
textArea.value = inviteText;
document.body.appendChild(textArea);
textArea.select();
document.execCommand('copy');
document.body.removeChild(textArea);
showPopup();
}

// Fonction pour afficher le popup
function showPopup() {
document.getElementById('popup').classList.add('active');
}

// Fonction pour fermer le popup
function closePopup() {
document.getElementById('popup').classList.remove('active');
}

// Attacher la fonction copyInvite au bouton "Copier le lien"
document.getElementById('copy-button').addEventListener('click', copyInvite);


async function PostLobby(e) {
    //Prevent default
    e.preventDefault();
    
    let roomCode = new URLSearchParams(window.location.search).get('room');

    const data = {
        sizeTwo: document.getElementById('cruiser-count').innerText,
        sizeThree: document.getElementById('submarine-count').innerText,
        sizeFour: document.getElementById('torpedo-count').innerText,
        sizeFive: document.getElementById('aircraft-carrier-count').innerText,
        uid: document.cookie.split('; ').find(row => row.startsWith('uid')).split('=')[1],
        code: roomCode,
    };
  
    await fetch("api/set_param.php", {
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
            window.location.href = `preparation.html?room=${roomCode}`;
        }
    });
};

async function GetLobby() {
    let roomCode = new URLSearchParams(window.location.search).get('room');

    const data = {
        code: roomCode,
        uid: document.cookie.split('; ').find(row => row.startsWith('uid')).split('=')[1],
    };

    await fetch(`api/get_param.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.href = `preparation.html?room=${roomCode}`;
        }
    });
}

setInterval(GetLobby, 3000);

const btnValidate = document.getElementById('validate');

btnValidate.addEventListener('click', (e) => PostLobby(e));