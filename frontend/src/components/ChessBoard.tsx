import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ 
    chess, 
    board, 
    socket, 
    setBoard, 
    playerColor, 
    isMyTurn 
}: {
    chess: Chess;
    setBoard: React.Dispatch<React.SetStateAction<({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]>>;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    playerColor: 'white' | 'black' | null;
    isMyTurn: boolean;
}) => {
    const [from, setFrom] = useState<null | Square>(null);

    const handleSquareClick = (squareRepresentation: Square) => {
        if (!isMyTurn || !playerColor) return;

        const clickedPiece = chess.get(squareRepresentation);
        if (!from) {
            // Only allow selecting own pieces
            if (clickedPiece && 
                ((playerColor === 'white' && clickedPiece.color === 'w') ||
                 (playerColor === 'black' && clickedPiece.color === 'b'))) {
                setFrom(squareRepresentation);
            }
        } else {
            socket.send(JSON.stringify({
                type: MOVE,
                payload: {
                    move: {
                        from,
                        to: squareRepresentation
                    }
                }
            }));
            setFrom(null);
        }
    };

    // Optionally reverse the board for black player
    const displayBoard = playerColor === 'black' ? [...board].reverse().map(row => [...row].reverse()) : board;

    return <div className="text-white-200">
        {displayBoard.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentation = playerColor === 'black' 
                        ? String.fromCharCode(104 - (j % 8)) + "" + (i + 1) as Square
                        : String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                    return <div 
                        onClick={() => handleSquareClick(squareRepresentation)}
                        key={j} 
                        className={`w-16 h-16 ${(i+j)%2 === 0 ? 'bg-green-500' : 'bg-slate-500'} 
                            ${from === squareRepresentation ? 'border-2 border-yellow-400' : ''}`}
                    >
                        <div className="w-full justify-center flex h-full">
                            <div className="h-full justify-center flex flex-col">
                                {square ? <img className="w-4" src={`/${square?.color === "b" ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`} /> : null} 
                            </div>
                        </div>
                    </div>
                })}
            </div>
        })}
    </div>
}
