import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import UseEffects from './useEffects';
import { ChatAPI } from './FriendStatus';

const Square = (props) => (
  <button
    className="square"
    onClick={props.onClick}
  >
    {props.value}
  </button>
);

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      friendId: 'SK',
      friendIdInput: 'SK',
    };
    // In the constructor, 'this' is an instance of Game object
    // since I am passing an arrow function when instantiation
    //  <Board />, I no longer have to bind 'this' to the Game object

    // however, reading this- https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1
    // i feel, we should bind this.handleClick in the constructor rather than use arrow functions
    // in render, since we won't need to create a new function each time we render
    // and also because arrow functions are slower
    this.handleClick = this.handleClick.bind(this);
  }
  jumpTo(stepNumber) {
    console.log("jumpTo stepNumber", stepNumber);
    const xIsNext = (stepNumber % 2 === 0) ? true : false;
    this.setState({
      stepNumber,
      xIsNext,
    });
  }
  handleClick(i) {
    const stepNumber = this.state.stepNumber + 1;
    const history = [...this.state.history];
    const current = {
      ...history[history.length - 1],
    };
    // return early if square is already filled or if game over
    // or if we are in the middle of past steps
    if (current.squares[i] ||
      (stepNumber !== (history.length)) ||
      calculateWinner(current.squares)) {
      return;
    }
    current.squares = [...current.squares];
    current.squares[i] = this.state.xIsNext ? 'X' : 'O';
    history.push({ squares: current.squares });
    console.log(`handleClick: next stepNumber: ${stepNumber}`);
    this.setState({
      history,
      xIsNext: !this.state.xIsNext,
      stepNumber,
    });
  }
  handleFriendIdInputChange = (event) => {
    this.setState({ friendIdInput: event.target.value });
  }
  toggleFriendStatus = () => {
    ChatAPI.mockToggleFriendStatus(this.state.friendId);
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="game">
          <div className="game-board">
            {/*here, using the arrow function bound 'this' to the arrow function.
          In the 'render' function, 'this' is an instance of the Game object.
          and then we see the arrow function calling handleClick, 
          so handleClick receives the Game object as 'this' and uses it

          onClick={(i) => this.handleClick(i)}
        */}
            <Board onClick={this.handleClick}
              squares={current.squares} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
        <h2>Hooks</h2>
        <button onClick={this.toggleFriendStatus}>Toggle Friend Status</button>
        <label htmlFor="friendId">New Friend Id</label>
        <input type="text" id="friendId" value={this.friendId} onChange={(this.handleFriendIdInputChange)}></input>
        <button onClick={() => { this.setState({ friendId: this.state.friendIdInput }) }}>Update Friend Id</button>
        <UseEffects friend={{ id: this.state.friendId }} />
      </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
