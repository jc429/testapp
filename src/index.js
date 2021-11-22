import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
		<button className= {props.winner ? "square square-winner" : "square"} onClick={props.onClick} >
			{props.value}
		</button>
	);
	
}

class Board extends React.Component {
	renderSquare(i) {
		let winner = this.props.winner && this.props.winner.includes(i) ? true : false;
		return (
			<Square 
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
				winner = {winner}
			/>
		);
	}

	render() {
		let boardDisplay = [];
		for(let row = 0; row < 3; row++){
			let rowDisplay = [];
			for(let col = 0; col < 3; col++){
				rowDisplay.push(
					<span key={(row * 3) + col}>
						{this.renderSquare((row * 3) + col)}
					</span>
				);
			}
			boardDisplay.push(<div className="board-row" key={row}>{rowDisplay}</div>);
		}
		return(
			<div>
				{boardDisplay}
			</div>
		);

		// return (
		// 	<div>
		// 		<div className="board-row">
		// 			{this.renderSquare(0)}
		// 			{this.renderSquare(1)}
		// 			{this.renderSquare(2)}
		// 		</div>
		// 		<div className="board-row">
		// 			{this.renderSquare(3)}
		// 			{this.renderSquare(4)}
		// 			{this.renderSquare(5)}
		// 		</div>
		// 		<div className="board-row">
		// 			{this.renderSquare(6)}
		// 			{this.renderSquare(7)}
		// 			{this.renderSquare(8)}
		// 		</div>
		// 	</div>
		// );
	}
}

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				tileSet: 0,
			}],
			stepNumber: 0,
			nextIsX: true,
			turnsAsc: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if(squares[i] || calculateWinner(squares)){
			return;
		}
		squares[i] = this.state.nextIsX ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				tileSet: i,
			}]),
			stepNumber: history.length,
			nextIsX: !this.state.nextIsX,
		});
	}

	jumpTo(step){
		this.setState(
			{
				stepNumber: step,
				nextIsX: (step % 2) === 0,
			}
		);
	}

	toggleAsc(){
		this.setState({
			turnsAsc: !this.state.turnsAsc,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const turnsAsc = this.state.turnsAsc;

		const moves = history.map(
			(step, move) => {
				let desc = move ? 'Move #' + move : 'Game Start';
				let style = null;
				let tile = this.state.history[move].tileSet;
				if(move)
				{
					desc += ' (' + (tile % 3) + ',' + Math.floor(tile / 3) + ')';
				}

				if(move === this.state.stepNumber){
					//desc = 'style="font-weight:bold;"' + desc ;
					style = { fontWeight: 'bold' };
				}
				return (
					<li key={move}>
						<button 
							onClick={() => this.jumpTo(move)}
							style = {style}
						>{desc}</button>
					</li>
				);
			}
		);


		let status;
		if(winner){
			status = 'Winner: ' + winner.winner;
		}
		else{
			if(this.state.stepNumber >= 9){
				status = "Draw";
			}
			else{
				status = 'Next player: ' + (this.state.nextIsX ? 'X' : 'O');
			}
		}

		return (
			<div className='game'>
			<div className='game-board'>
				<Board 
					squares={current.squares}
					onClick={(i) => this.handleClick(i)}
					winner={winner && winner.match}
				/>
			</div>
			<div className='game-info'>
				<div>{status}</div>
				<div>
					<button onClick={() => this.toggleAsc()}>
						{turnsAsc ? 'Show Turns Descending' : 'Show Turns Ascending'}
					</button>
				</div>
				<ol>{turnsAsc ? moves : moves.reverse()}</ol>
			</div>
			</div>
		);
	}
}

function calculateWinner(squares){
	const lines = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[0,4,8],
		[2,4,6]
	];

	for(let i = 0; i < lines.length; i++)
	{
		const[a,b,c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return {
				winner: squares[a],
				match: lines[i]
			};
		}
	}
}


// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
