const board = document.getElementById("board");
const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");

let currentPlayer = "X";
let gameActive = true;
let boardState = Array(9).fill("");
let scores = { X: 0, O: 0, Draw: 0 };

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function updateStatus(message) {
  statusEl.textContent = message;
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

function setDisabledCells(state) {
  cells.forEach(cell => {
    const index = Number(cell.dataset.index);
    cell.disabled = state || boardState[index] !== "";
  });
}

function checkWinner() {
  for (const combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return combo;
    }
  }
  return null;
}

function handleCellClick(e) {
  const cell = e.currentTarget;
  const index = Number(cell.dataset.index);

  if (!gameActive || boardState[index]) return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "filled");
  cell.disabled = true;

  const winningCombo = checkWinner();

  if (winningCombo) {
    gameActive = false;
    scores[currentPlayer]++;
    updateScores();
    winningCombo.forEach(i => cells[i].classList.add("win"));
    updateStatus(`Player ${currentPlayer} wins.`);
    setDisabledCells(true);
    return;
  }

  if (!boardState.includes("")) {
    gameActive = false;
    scores.Draw++;
    updateScores();
    updateStatus("Game ended in a draw.");
    setDisabledCells(true);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function resetBoard(keepScores = true) {
  currentPlayer = "X";
  gameActive = true;
  boardState = Array(9).fill("");

  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = "cell";
    cell.disabled = false;
  });

  updateStatus("Player X's turn");
  setDisabledCells(false);

  if (!keepScores) {
    scores = { X: 0, O: 0, Draw: 0 };
    updateScores();
  }
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));

restartBtn.addEventListener("click", () => {
  resetBoard(true);
});

updateScores();
updateStatus("Player X's turn");
