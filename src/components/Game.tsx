import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { useTimer } from "../hooks/useTimer";
import { GameState } from "../types/GameState";
import { MouseButtons } from "../types/MouseButtons";
import { Board } from "./Board";
import { GameInfo } from "./GameInfo";
import { Difficulty, GameMenu, defaultDifficulties } from "./GameMenu";
import { Link } from "./Link";
import { Square } from "./Square";

const MINE = "💣";
const FLAG = "⛳";
const UNREVEALED = "";
const EMPTY = " ";
const UNKNOWN = "?";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const GameText = styled(Link)`
  color: blue;
`;

const Border = styled.div`
  border-width: 2px;
  border-style: solid;
`;

export const Game = () => {
  const [shouldDisplayMenu, setShouldDisplayMenu] = useState<boolean>(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(
    defaultDifficulties[0]
  );
  const {
    width: boardWidth,
    height: boardHeight,
    mines: numberOfMines
  } = currentDifficulty;
  const [grid, setGrid] = useState<string[]>(
    new Array(boardHeight * boardWidth).fill(UNREVEALED)
  );
  const [gameState, setGameState] = useState(GameState.STOPPED);
  const mineSet = useRef(new Set<number>());
  const [lastClickedIndex, setLastClickedIndex] = useState<
    number | undefined
  >();
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [remainingMines, setRemainingMines] = useState(numberOfMines);
  const { setTime, startTimer, stopTimer, time } = useTimer();
  const newGameIcon =
    gameState === GameState.WON
      ? "😎"
      : gameState === GameState.LOST
      ? "😵"
      : isMousePressed
      ? "😲"
      : "🙂";

  const generateMines = useCallback(
    (selectedIndex: number) => {
      const totalSquares = boardWidth * boardHeight;
      let currentMines = numberOfMines;

      const remainingSet = new Set<number>([]);
      for (let i = 0; i < totalSquares; i++) {
        remainingSet.add(i);
      }

      // Try to prevent placing mines on surrounding squares
      let surroundingSquares = 0;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          const currX = (selectedIndex % boardWidth) + x;
          const currY = Math.floor(selectedIndex / boardWidth) + y;

          if (
            currX >= 0 &&
            currX < boardWidth &&
            currY >= 0 &&
            currY < boardHeight
          ) {
            surroundingSquares++;
          }
        }
      }
      if (currentMines <= totalSquares - surroundingSquares) {
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            const currX = (selectedIndex % boardWidth) + x;
            const currY = Math.floor(selectedIndex / boardWidth) + y;

            if (
              currX >= 0 &&
              currX < boardWidth &&
              currY >= 0 &&
              currY < boardHeight
            ) {
              remainingSet.delete(selectedIndex + x + boardWidth * y);
            }
          }
        }
      } else {
        remainingSet.delete(selectedIndex);
      }

      while (currentMines > 0 && remainingSet.size > 0) {
        const mine = Math.floor(Math.random() * remainingSet.size);
        const newMineIndex = [...remainingSet.values()][mine];

        remainingSet.delete(newMineIndex);
        mineSet.current.add(newMineIndex);
        currentMines--;
      }
      return [...grid];
    },
    [boardHeight, boardWidth, numberOfMines, grid]
  );

  const countSurroundingMines = useCallback(
    (selectedIndex: number) => {
      let surroundingMines = 0;
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          const currX = (selectedIndex % boardWidth) + x;
          const currY = Math.floor(selectedIndex / boardWidth) + y;
          const currIndex = selectedIndex + x + boardWidth * y;

          if (
            currX >= 0 &&
            currX < boardWidth &&
            currY >= 0 &&
            currY < boardHeight &&
            mineSet.current.has(currIndex)
          ) {
            surroundingMines++;
          }
        }
      }
      return surroundingMines;
    },
    [boardHeight, boardWidth]
  );

  const reveal = useCallback(
    (selectedIndex: number, grid: string[]) => {
      if (grid[selectedIndex] === FLAG || grid[selectedIndex] === UNKNOWN) {
        return;
      }
      if (mineSet.current.has(selectedIndex)) {
        setGameState(GameState.LOST);
        [...mineSet.current.values()].forEach((mine) => {
          grid[mine] = `${MINE}`;
        });
        stopTimer();
        return;
      }
      const numOfMines = countSurroundingMines(selectedIndex);

      if (numOfMines === 0) {
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            const currX = (selectedIndex % boardWidth) + x;
            const currY = Math.floor(selectedIndex / boardWidth) + y;
            const currIndex = selectedIndex + x + boardWidth * y;

            if (
              currX >= 0 &&
              currX < boardWidth &&
              currY >= 0 &&
              currY < boardHeight &&
              grid[currIndex] === UNREVEALED
            ) {
              const numOfMines = countSurroundingMines(currIndex);
              grid[currIndex] = `${numOfMines ? numOfMines : EMPTY}`;
              if (numOfMines === 0) {
                reveal(currIndex, grid);
              }
            }
          }
        }
      } else {
        grid[selectedIndex] = `${numOfMines ? numOfMines : EMPTY}`;
      }
    },
    [boardHeight, boardWidth, countSurroundingMines, stopTimer]
  );

  const onNewGame = useCallback(
    (difficulty: Difficulty) => {
      setShouldDisplayMenu(false);
      setCurrentDifficulty(difficulty);
      setGrid(new Array(difficulty.height * difficulty.width).fill(UNREVEALED));
      mineSet.current.clear();
      setGameState(GameState.STOPPED);
      setRemainingMines(difficulty.mines);
      stopTimer();
      setTime(0);
    },
    [setTime, stopTimer]
  );

  const didWin = (grid: string[]) => {
    const totalUnrevealed = (grid.map((value) =>
      value === UNREVEALED || value === FLAG || value === UNKNOWN ? 1 : 0
    ) as number[]).reduce((prev, current) => prev + current);
    return totalUnrevealed === numberOfMines;
  };

  return (
    <Container>
      <GameText
        onClick={() => {
          setShouldDisplayMenu(!shouldDisplayMenu);
        }}
      >
        {"Game"}
      </GameText>
      <GameMenu
        onClose={() => setShouldDisplayMenu(false)}
        onNewGame={onNewGame}
        style={{ visibility: shouldDisplayMenu ? "visible" : "hidden" }}
      />
      <Border>
        <GameInfo
          emojiIcon={newGameIcon}
          remainingMines={remainingMines}
          time={time}
          onNewGame={() => onNewGame(currentDifficulty)}
        />
        <Board
          width={boardWidth}
          height={boardHeight}
          onPointerLeave={() => setIsMousePressed(false)}
        >
          {grid.map((square, index) => (
            <Square
              key={index}
              onMouseDown={() => setIsMousePressed(true)}
              onMouseUp={(event) => {
                if (!isMousePressed) {
                  return;
                }
                if (
                  !event?.button ||
                  event.button === MouseButtons.LEFT_CLICK
                ) {
                  if (
                    gameState === GameState.WON ||
                    gameState === GameState.LOST
                  ) {
                    return;
                  }
                  const newGrid =
                    gameState === GameState.STOPPED
                      ? generateMines(index)
                      : [...grid];
                  if (
                    gameState === GameState.STOPPED ||
                    newGrid[index] === UNREVEALED
                  ) {
                    reveal(index, newGrid);
                  }
                  if (gameState === GameState.STOPPED) {
                    setGameState(GameState.STARTED);
                    startTimer();
                  }
                  if (didWin(newGrid)) {
                    setGameState(GameState.WON);
                    [...mineSet.current.values()].forEach((mine) => {
                      newGrid[mine] = `${FLAG}`;
                    });
                    stopTimer();
                    setRemainingMines(0);
                  }
                  setGrid(newGrid);
                  setLastClickedIndex(index);
                  setIsMousePressed(false);
                } else if (event.button === MouseButtons.RIGHT_CLICK) {
                  if (gameState === GameState.STARTED) {
                    const newGrid = [...grid];
                    const selectedGrid = newGrid[index];
                    if (selectedGrid === UNREVEALED) {
                      newGrid[index] = FLAG;
                      setRemainingMines((remainingMines) => remainingMines - 1);
                    } else if (selectedGrid === FLAG) {
                      newGrid[index] = UNKNOWN;
                      setRemainingMines((remainingMines) => remainingMines + 1);
                    } else if (selectedGrid === UNKNOWN) {
                      newGrid[index] = UNREVEALED;
                    }
                    setGrid(newGrid);
                  }
                  setIsMousePressed(false);
                }
              }}
              style={{
                backgroundColor:
                  square === MINE && lastClickedIndex === index
                    ? "red"
                    : square === UNREVEALED
                    ? "white"
                    : "#CCC"
              }}
            >
              {square}
            </Square>
          ))}
        </Board>
      </Border>
    </Container>
  );
};
