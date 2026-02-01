document.addEventListener("DOMContentLoaded", () => {

  /* ============================
     ELEMENTOS
  ============================ */
  const puzzleBoard = document.getElementById("puzzle-board");
  const piecesContainer = document.getElementById("pieces-container");
  const shuffleButton = document.getElementById("shuffle-button");
  const resetButton = document.getElementById("reset-button");

  /* ============================
     CONFIGURAÇÕES
  ============================ */
  const gridSize = 4;
  const pieceSize = 80;
  let imageIndex = 0;
  let pieces = [];

  const images = [
    "assets/OIP (1).jpeg",
    "assets/OIP (2).jpeg",
    "assets/OIP.jpeg",
    "assets/R (1).jpeg",
    "assets/R (2).jpeg",
    "assets/R.jpeg"
  ];

  /* ============================
     CRIAR TABULEIRO
  ============================ */
  function createBoard() {
    puzzleBoard.innerHTML = "";
    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.dataset.index = i;
      puzzleBoard.appendChild(slot);
    }
  }

  /* ============================
     CRIAR PEÇAS
  ============================ */
  function createPieces(imageUrl) {
    piecesContainer.innerHTML = "";
    pieces = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
      const piece = document.createElement("div");
      piece.classList.add("puzzle-piece");

      piece.dataset.correctIndex = i;

      piece.style.width = `${pieceSize}px`;
      piece.style.height = `${pieceSize}px`;
      piece.style.backgroundImage = `url('${imageUrl}')`;
      piece.style.backgroundSize = `${pieceSize * gridSize}px ${pieceSize * gridSize}px`;
      piece.style.backgroundPosition =
        `${-(i % gridSize) * pieceSize}px ${-Math.floor(i / gridSize) * pieceSize}px`;

      piecesContainer.appendChild(piece);
      pieces.push(piece);
    }

    randomizeInitialPosition();
    enableDrag();
  }

  /* ============================
     POSIÇÃO ALEATÓRIA INICIAL
  ============================ */
  function randomizeInitialPosition() {
    const containerRect = piecesContainer.getBoundingClientRect();

    pieces.forEach(piece => {
      const maxX = containerRect.width - pieceSize - 10;
      const maxY = containerRect.height - pieceSize - 10;

      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      piece.style.transform = `translate(${x}px, ${y}px)`;
      piece.dataset.x = x;
      piece.dataset.y = y;
    });
  }

  /* ============================
     DRAG & DROP (INTERACT.JS)
  ============================ */
  function enableDrag() {
    interact(".puzzle-piece").draggable({
      inertia: true,
      listeners: {
        move(event) {
          const target = event.target;

          const x = (parseFloat(target.dataset.x) || 0) + event.dx;
          const y = (parseFloat(target.dataset.y) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.dataset.x = x;
          target.dataset.y = y;
        },

        end(event) {
          const piece = event.target;
          const slots = document.querySelectorAll(".slot");

          let encaixou = false;

          slots.forEach(slot => {
            if (slot.children.length > 0) return;

            const slotRect = slot.getBoundingClientRect();
            const pieceRect = piece.getBoundingClientRect();

            const overlap =
              pieceRect.left < slotRect.right &&
              pieceRect.right > slotRect.left &&
              pieceRect.top < slotRect.bottom &&
              pieceRect.bottom > slotRect.top;

            if (
              overlap &&
              slot.dataset.index === piece.dataset.correctIndex
            ) {
              // 🔒 FIXA A PEÇA NO SLOT
              slot.appendChild(piece);

              piece.style.transform = "none";
              piece.style.position = "relative";
              piece.style.left = "0";
              piece.style.top = "0";

              piece.removeAttribute("data-x");
              piece.removeAttribute("data-y");

              interact(piece).draggable(false);
              encaixou = true;
            }
          });

          if (!encaixou) {
            // Mantém posição atual se não encaixar
            piece.dataset.x = piece.dataset.x || 0;
            piece.dataset.y = piece.dataset.y || 0;
          }

          checkVictory();
        }
      }
    });
  }

  /* ============================
     VERIFICAR VITÓRIA
  ============================ */
  function checkVictory() {
    const correctPieces = puzzleBoard.querySelectorAll(".slot .puzzle-piece");

    if (correctPieces.length === gridSize * gridSize) {
      setTimeout(() => {
        alert("🎉 Parabéns! Você concluiu o quebra-cabeça!");
        nextImage();
      }, 400);
    }
  }

  /* ============================
     PRÓXIMA IMAGEM
  ============================ */
  function nextImage() {
    imageIndex = (imageIndex + 1) % images.length;
    startGame();
  }

  /* ============================
     INICIAR JOGO
  ============================ */
  function startGame() {
    createBoard();
    createPieces(images[imageIndex]);
  }

  /* ============================
     BOTÕES
  ============================ */
  shuffleButton.addEventListener("click", () => {
    randomizeInitialPosition();
  });

  resetButton.addEventListener("click", () => {
    nextImage();
  });

  /* ============================
     START
  ============================ */
  startGame();
});
