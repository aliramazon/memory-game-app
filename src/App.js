import "./App.css";
import { useEffect, useState } from "react";
import classnames from "classnames";

const MemoryGame = () => {
    const [level, setLevel] = useState(2);
    const [cells, setCells] = useState(Array(4).fill(undefined));
    const [preFilledCells, setPreFilledCells] = useState({});
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [timer, setTimer] = useState(false);
    const [correctSelect, setCorrectSelect] = useState(0);
    const [wrongSelect, setWrongSelect] = useState(0);
    const [clickedIndices, setClickedIndices] = useState({});
    const [isGameFinished, setIsGameFinished] = useState(false);

    useEffect(() => {
        setPreFilledCells({});
        setWrongSelect(0);
        setCorrectSelect(0);
        setClickedIndices({});
    }, [level]);

    useEffect(() => {
        console.log("Running");
        console.log(correctSelect, level);
        if (correctSelect === level) {
            setIsGameFinished(true);
            setIsGameStarted(false);
        }
    }, [correctSelect]);

    const handleOnClickCell = (clickedIdx) => {
        if (preFilledCells[clickedIdx] && !clickedIndices[clickedIdx]) {
            setCorrectSelect(correctSelect + 1);
            setClickedIndices({ ...clickedIndices, [clickedIdx]: true });
        } else if (!preFilledCells[clickedIdx] && !clickedIndices[clickedIdx]) {
            setWrongSelect(wrongSelect + 1);
            setClickedIndices({ ...clickedIndices, [clickedIdx]: true });
        }
    };

    const handleOnChangeLevel = (e) => {
        setLevel(parseInt(e.target.value));
        setCells(Array(Math.pow(parseInt(e.target.value), 2)).fill(undefined));
        setIsGameStarted(false);
    };

    const generatePreFilledCells = (level) => {
        let cells = [];

        while (cells.length < level) {
            let randomIdx = Math.floor(
                Math.random() * Math.pow(parseInt(level), 2)
            );

            if (cells.indexOf(randomIdx) === -1) {
                cells.push(randomIdx);
            }
        }

        let hash = cells.reduce((acc, ele) => {
            acc[ele] = true;
            return acc;
        }, {});

        setPreFilledCells(hash);
        setTimer(true);
        setTimeout(() => {
            setTimer(false);
        }, 1000);
    };

    const handleOnClickButton = () => {
        setIsGameStarted(true);
        generatePreFilledCells(level);

        setWrongSelect(0);
        setCorrectSelect(0);
        setClickedIndices({});
        setIsGameFinished(false);
    };
    return (
        <>
            <h1>Memory Game</h1>
            <p>Difficulty: {level}</p>
            <input
                value={level}
                type="range"
                min="2"
                max="20"
                onChange={handleOnChangeLevel}
            />
            {(!isGameStarted || isGameFinished) && (
                <div>
                    <button onClick={handleOnClickButton}>
                        {isGameFinished ? "Play Again ?" : "Start Game"}
                    </button>
                </div>
            )}

            {timer && isGameStarted && <p>Memorize the highlighted cells</p>}
            {!timer && isGameStarted && (
                <p>
                    Click the cells! {correctSelect} right out of {level} total
                    with {wrongSelect} mistakes.
                </p>
            )}
            {isGameFinished && (
                <p>You got all of the boxes with {wrongSelect} mistakes!</p>
            )}
            <section
                className="board"
                style={{
                    gridTemplateColumns: `repeat(${level}, 1fr)`,
                    gap: "5px"
                }}
            >
                {cells &&
                    cells.map((cell, idx) => {
                        return (
                            <div
                                key={idx}
                                className={classnames(
                                    "board__cell",
                                    preFilledCells[idx] &&
                                        timer &&
                                        "pre-filled",
                                    preFilledCells[idx] &&
                                        clickedIndices[idx] &&
                                        "correct",
                                    !preFilledCells[idx] &&
                                        clickedIndices[idx] &&
                                        "wrong",
                                    !isGameStarted && "game-not-started"
                                )}
                                onClick={
                                    !timer && !isGameFinished
                                        ? () => handleOnClickCell(idx)
                                        : () => {
                                              return;
                                          }
                                }
                            ></div>
                        );
                    })}
            </section>
        </>
    );
};

export default function App() {
    return (
        <div className="App">
            <MemoryGame />
        </div>
    );
}
