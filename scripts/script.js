document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const shuffleButton = document.getElementById("shuffle-button");
    const resetButton = document.getElementById("reset-button");

    const gridSize = 4; // Tamanho da grade (4x4)
    let pieces = [];
    let imageIndex = 0; // Índice da imagem atual

    const images = [
        'assets/OIP (1).jpeg',
        'assets/OIP (2).jpeg',
        'assets/OIP.jpeg',
        'assets/R (1).jpeg',
        'assets/R (2).jpeg',
        'assets/R.jpeg'
    ];

    function createPuzzle() {
        pieces = [];
        puzzleContainer.innerHTML = '';
        const imageUrl = images[imageIndex];
        
        for (let i = 0; i < gridSize * gridSize; i++) {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.backgroundImage = `url('${imageUrl}')`;
            piece.style.backgroundPosition = `${(i % gridSize) * -100}px ${Math.floor(i / gridSize) * -100}px`;
            piece.dataset.index = i;
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }

        shufflePieces();
    }

    function shufflePieces() {
        // Embaralha a ordem das peças
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            puzzleContainer.appendChild(pieces[j]);
        }
    }

    function resetPuzzle() {
        imageIndex = (imageIndex + 1) % images.length; // Troca para a próxima imagem
        createPuzzle();
    }

    // Evento para embaralhar as peças
    shuffleButton.addEventListener("click", shufflePieces);

    // Evento para resetar o quebra-cabeça
    resetButton.addEventListener("click", resetPuzzle);

    // Inicializa o quebra-cabeça
    createPuzzle();
});
