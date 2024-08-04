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
            piece.draggable = true;
            piece.addEventListener("dragstart", dragStart);
            piece.addEventListener("dragover", dragOver);
            piece.addEventListener("drop", drop);
            pieces.push(piece);
            puzzleContainer.appendChild(piece);
        }

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

    function dragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.dataset.index);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        const fromIndex = e.dataTransfer.getData("text/plain");
        const toIndex = e.target.dataset.index;

        if (fromIndex !== toIndex) {
            const fromElement = document.querySelector(`.puzzle-piece[data-index='${fromIndex}']`);
            const toElement = document.querySelector(`.puzzle-piece[data-index='${toIndex}']`);

            [fromElement.dataset.index, toElement.dataset.index] = [toIndex, fromIndex];

            puzzleContainer.insertBefore(fromElement, toElement);
            puzzleContainer.insertBefore(toElement, fromElement.nextSibling);

            checkCompletion();
        }
    }

    function checkCompletion() {
        const correct = Array.from(puzzleContainer.children).every((piece, index) => {
            return piece.dataset.index == index;
        });

        if (correct) {
            alert("Parabéns! Você completou o quebra-cabeça.");
            resetPuzzle();
        }
    }

    // Evento para embaralhar as peças
    shuffleButton.addEventListener("click", shufflePieces);

    // Evento para resetar o quebra-cabeça
    resetButton.addEventListener("click", resetPuzzle);

    // Inicializa o quebra-cabeça
    createPuzzle();
});


