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
