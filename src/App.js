import "./App.css";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";
import { useEffect, useState } from "react";
const width = 8;
const candyColours = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy,
];

const App = () => {
  const [currentColorArrangement, setcurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setsquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setsquareBeingReplaced] = useState(null);
  //checksss for coloumn and rows of 3 nd 4
  const checkForColoumnOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const coloumnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      if (
        coloumnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        coloumnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForColoumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const coloumnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      if (
        coloumnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor
        )
      ) {
        coloumnOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i <= 64; i++) {
      const RowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (
        RowOfThree.every(
          (square) => currentColorArrangement[square] == decidedColor
        )
      ) {
        RowOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };
  const checkForRowOfFour = () => {
    for (let i = 0; i < 47; i++) {
      const RowOfFour = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      if (notValid.includes(i)) continue;
      if (
        RowOfFour.every(
          (square) => currentColorArrangement[square] == decidedColor
        )
      ) {
        RowOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] == blank) {
        currentColorArrangement[i] =
          candyColours[Math.floor(Math.random() * candyColours.length)];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const dragStart = (e) => {
    setsquareBeingDragged(e.target);
  };
  const dragDrop = (e) => {
    setsquareBeingReplaced(e.target);
  };
  const dragEnd = (e) => {
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width,
    ];
    const validMove = validMoves.includes(squareBeingReplacedId);
    const isAColoumnOfFour = checkForColoumnOfFour();
    const isAColoumnOfthree = checkForColoumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();
    if (
      squareBeingReplacedId &&
      validMove &&
      (isAColoumnOfFour || isAColoumnOfthree || isARowOfFour || isARowOfThree)
    ) {
      setsquareBeingDragged(null);
      setsquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
      setcurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColours[Math.floor(Math.random() * candyColours.length)];
      randomColorArrangement.push(randomColor);
    }
    setcurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColoumnOfFour();
      checkForColoumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setcurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColoumnOfFour,
    checkForColoumnOfThree,
    checkForRowOfFour,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="App">
      <div className="game">
        {currentColorArrangement.map((candyColour, index) => (
          <img
            key={index}
            src={candyColour}
            // style={{ backgroundColor: candyColour }}
            alt={candyColour}
            data-id={index}
            draggable={true}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
            onDragStart={dragStart}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
