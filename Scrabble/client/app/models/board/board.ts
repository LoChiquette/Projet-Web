import { BoardRows } from "./board-rows";
import { BoardColumn } from "./board-column";
import { Square } from "../square/square";
import { SquarePosition } from "../square/square-position";
import { SquareType } from "../square/square-type";

const BOARD_SIZE = 15;

export class Board {
    private _squares: Array<Array<Square>>;
    public get squares(): Array<Array<Square>> {
        return this._squares;
    }

    constructor() {
        this._squares = new Array<Array<Square>>();
        this.generateBoard();
        this.assignTypesToSquares();
    }

    private generateBoard(): void {
        let row: number;
        let colomn: number;
        let innerRow: Array<Square>;

        for (row = 1; row <= BOARD_SIZE; row++) {
            innerRow = new Array<Square>();
            for (colomn = BoardColumn.FIRST_COLUMN; colomn <= BOARD_SIZE; colomn++) {
                innerRow.push(new Square(new SquarePosition(BoardRows[row], colomn), SquareType.normal));
            }
            this.squares.push(innerRow);
        }
    }

    private assignTypesToSquares(): void {
        this.assignStarToSquare();
        this.assignTripleWordCountToSquare();
        this.assignDoubleWordCountToSquare();
        this.assignTripleLetterCountToSquare();
        this.assignDoubleLetterCountToSquare();
    }

    private assignStarToSquare(): void {
        this.squares[7][7].type = SquareType.star;
    }

    private assignTripleWordCountToSquare(): void {
        this.squares[0][0].type = SquareType.tripleWordCount;
        this.squares[0][7].type = SquareType.tripleWordCount;
        this.squares[0][14].type = SquareType.tripleWordCount;
        this.squares[7][0].type = SquareType.tripleWordCount;
        this.squares[7][14].type = SquareType.tripleWordCount;
        this.squares[14][0].type = SquareType.tripleWordCount;
        this.squares[14][7].type = SquareType.tripleWordCount;
        this.squares[14][14].type = SquareType.tripleWordCount;
    }

    private assignDoubleWordCountToSquare(): void {
        this.squares[1][1].type = SquareType.doubleWordCount;
        this.squares[1][13].type = SquareType.doubleWordCount;
        this.squares[2][2].type = SquareType.doubleWordCount;
        this.squares[2][12].type = SquareType.doubleWordCount;
        this.squares[3][3].type = SquareType.doubleWordCount;
        this.squares[3][11].type = SquareType.doubleWordCount;
        this.squares[4][4].type = SquareType.doubleWordCount;
        this.squares[4][10].type = SquareType.doubleWordCount;
        this.squares[10][4].type = SquareType.doubleWordCount;
        this.squares[10][10].type = SquareType.doubleWordCount;
        this.squares[11][11].type = SquareType.doubleWordCount;
        this.squares[11][3].type = SquareType.doubleWordCount;
        this.squares[12][2].type = SquareType.doubleWordCount;
        this.squares[12][12].type = SquareType.doubleWordCount;
        this.squares[13][1].type = SquareType.doubleWordCount;
        this.squares[13][13].type = SquareType.doubleWordCount;
    }

    private assignTripleLetterCountToSquare(): void {
        this.squares[1][5].type = SquareType.tripleLetterCount;
        this.squares[1][9].type = SquareType.tripleLetterCount;
        this.squares[5][1].type = SquareType.tripleLetterCount;
        this.squares[5][5].type = SquareType.tripleLetterCount;
        this.squares[5][9].type = SquareType.tripleLetterCount;
        this.squares[5][13].type = SquareType.tripleLetterCount;
        this.squares[9][1].type = SquareType.tripleLetterCount;
        this.squares[9][5].type = SquareType.tripleLetterCount;
        this.squares[9][9].type = SquareType.tripleLetterCount;
        this.squares[9][13].type = SquareType.tripleLetterCount;
        this.squares[13][5].type = SquareType.tripleLetterCount;
        this.squares[13][9].type = SquareType.tripleLetterCount;
    }

    private assignDoubleLetterCountToSquare(): void {
        this.squares[0][3].type = SquareType.doubleLetterCount;
        this.squares[2][6].type = SquareType.doubleLetterCount;
        this.squares[2][8].type = SquareType.doubleLetterCount;
        this.squares[3][0].type = SquareType.doubleLetterCount;
        this.squares[3][7].type = SquareType.doubleLetterCount;
        this.squares[3][14].type = SquareType.doubleLetterCount;
        this.squares[6][2].type = SquareType.doubleLetterCount;
        this.squares[6][12].type = SquareType.doubleLetterCount;
        this.squares[6][6].type = SquareType.doubleLetterCount;
        this.squares[6][8].type = SquareType.doubleLetterCount;
        this.squares[7][3].type = SquareType.doubleLetterCount;
        this.squares[7][11].type = SquareType.doubleLetterCount;
        this.squares[8][2].type = SquareType.doubleLetterCount;
        this.squares[8][6].type = SquareType.doubleLetterCount;
        this.squares[8][8].type = SquareType.doubleLetterCount;
        this.squares[8][12].type = SquareType.doubleLetterCount;
        this.squares[11][0].type = SquareType.doubleLetterCount;
        this.squares[11][7].type = SquareType.doubleLetterCount;
        this.squares[11][14].type = SquareType.doubleLetterCount;
        this.squares[12][6].type = SquareType.doubleLetterCount;
        this.squares[12][8].type = SquareType.doubleLetterCount;
        this.squares[14][3].type = SquareType.doubleLetterCount;
        this.squares[14][11].type = SquareType.doubleLetterCount;
    }
}
