'use client';

import { useState, useEffect } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];

type GameResult = {
  id: number;
  winner: string;
  createdAt: string;
};

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | '引き分け' | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const response = await fetch('/api/gameResults');
      const data = await response.json();
      setGameHistory(data);
    } catch (error) {
      console.error('履歴の取得に失敗しました:', error);
    }
  };

  const saveGameResult = async (winner: string) => {
    try {
      await fetch('/api/gameResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ winner }),
      });
      fetchGameHistory();
    } catch (error) {
      console.error('結果の保存に失敗しました:', error);
    }
  };

  const calculateWinner = (squares: Board): Player | '引き分け' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
      [0, 4, 8], [2, 4, 6] // 斜め
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (squares.every(square => square !== null)) {
      return '引き分け';
    }

    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    if (winner) {
      saveGameResult(winner);
    }
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const renderStatus = () => {
    if (winner === '引き分け') return '引き分けです！';
    if (winner) return `${winner}の勝利です！`;
    return `次は${isXNext ? 'X' : 'O'}の番です`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">3目並べ</h1>
        <div className="mb-4 text-xl text-center font-bold text-gray-800 dark:text-white">
          {renderStatus()}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {board.map((square, index) => (
            <button
              key={index}
              className={`w-20 h-20 text-4xl font-bold border-2 rounded
                ${!square && !winner ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : ''}
                ${square === 'X' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
                dark:border-gray-600
                focus:outline-none transition-colors duration-200`}
              onClick={() => handleClick(index)}
              disabled={!!square || !!winner}
            >
              {square}
            </button>
          ))}
        </div>
        <button
          onClick={resetGame}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200 mb-6"
        >
          リセット
        </button>

        {gameHistory.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">対戦履歴</h2>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="py-2 text-left text-gray-800 dark:text-gray-200">日時</th>
                    <th className="py-2 text-left text-gray-800 dark:text-gray-200">結果</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((game) => (
                    <tr key={game.id} className="border-b dark:border-gray-600">
                      <td className="py-2 text-gray-700 dark:text-gray-300">
                        {new Date(game.createdAt).toLocaleString('ja-JP')}
                      </td>
                      <td className="py-2 text-gray-700 dark:text-gray-300">
                        {game.winner === '引き分け' ? '引き分け' : `${game.winner}の勝利`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
