import { useState } from "react";

const BOARD_SIZE = 3
const MAX_MOVES = BOARD_SIZE ** 2

function Square({ value, onSquareClick, style }) {
  return (
    <button style={style} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  let board = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    let board_row = []
    for (let j = 0; j < BOARD_SIZE; j++) {
      const idx = i * BOARD_SIZE + j
      board_row.push(<Square key={idx} value={squares[idx]} onSquareClick={() => handleClick(idx)} />)
    }
    board.push(
      <div key={'row' + i} className="board-row">
        {board_row}
      </div>
    )
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
    const style = { color: 'red', }
    winner[1].forEach((val) => {
      board[Math.floor(val / BOARD_SIZE)].props.children[val % BOARD_SIZE]
        = <Square style={style} key={val} value={squares[val]} onSquareClick={() => handleClick(val)} />
    });
  } else {
    if (currentMove != BOARD_SIZE ** 2)
      status = "Next player: " + (xIsNext ? "X" : "O");
    else
      status = "Draw"
  }

  return (
    <>
      <div key={'status'} className="status">{status}</div>
      {board}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setAscending] = useState(true)
  const [movesHistory, setMovesHistory] = useState([])
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, pos) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setMovesHistory([...movesHistory.slice(0, currentMove), pos])
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function sortMoves() {
    setAscending(!isAscending)
  }

  let moves = history.map((squares, move) => {
    let msg
    if (move === currentMove) {
      msg =
        <li key={move}>
          <div>You are at move {move}</div>
        </li>
    } else {
      let description
      if (move > 0) {
        description = "Go to move #" + move
      } else {
        description = "Go to game start"
      }
      msg =
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    }
    return msg
  });
  if (!isAscending)
    moves = moves.reverse()

  let allMoves = movesHistory.map((val, idx) => {
    return (
      <li key={idx}>
        ({Math.floor(val / BOARD_SIZE)}, {val % BOARD_SIZE})
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button onClick={sortMoves}>Sort {isAscending ? 'Ascending' : 'Descending'}</button>
        <ol>{moves}</ol>
      </div>
      <div className="moves-history">
        Move history
        <ol>{allMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}
