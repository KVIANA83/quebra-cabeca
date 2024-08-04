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

    function getPieceSize() {
        const minPieceSize = 60;
        const maxPieceSize = 100;
        const pieceSize = Math.min(maxPieceSize, Math.max(minPieceSize, window.innerWidth / gridSize));
        return pieceSize;
    }

    function createPuzzle() {
        pieces = [];
        puzzleContainer.innerHTML = '';
        const imageUrl = images[imageIndex];
        const pieceSize = getPieceSize();

        puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${pieceSize}px)`;
        puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, ${pieceSize}px)`;

        for (let i = 0; i < gridSize * gridSize; i++) {
            const piece = document.createElement("div");
            piece.classList.add("puzzle-piece");
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            piece.style.backgroundImage = `url('${imageUrl}')`;
            piece.style.backgroundSize = `${pieceSize * gridSize}px ${pieceSize * gridSize}px`;
            piece.style.backgroundPosition = `${(i % gridSize) * -pieceSize}px ${Math.floor(i / gridSize) * -pieceSize}px`;
            piece.dataset.index = i;
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }

        interact('.puzzle-piece')
            .draggable({
                inertia: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: puzzleContainer,
                        endOnly: true
                    })
                ],
                listeners: {
                    start(event) {
                        event.target.classList.add('dragging');
                    },
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end(event) {
                        const target = event.target;
                        target.classList.remove('dragging');
                        checkCompletion();
                    }
                }
            });

        shufflePieces();
    }

    function shufflePieces() {
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            puzzleContainer.appendChild(pieces[j]);
        }
    }

    function resetPuzzle() {
        imageIndex = (imageIndex + 1) % images.length; // Troca para a próxima imagem
        createPuzzle();
    }

    function checkCompletion() {
        const correct = Array.from(puzzleContainer.children).every((piece, index) => {
            const x = parseFloat(piece.getAttribute('data-x')) || 0;
            const y = parseFloat(piece.getAttribute('data-y')) || 0;
            return x === 0 && y === 0;
        });

        if (correct) {
            setTimeout(() => {
                alert("Parabéns! Você completou o quebra-cabeça.");
                resetPuzzle();
            }, 300);
        }
    }

    shuffleButton.addEventListener("click", shufflePieces);
    resetButton.addEventListener("click", resetPuzzle);
    window.addEventListener("resize", createPuzzle);

    createPuzzle();
});
