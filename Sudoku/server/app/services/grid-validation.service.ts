import { PuzzleItem } from './../models/puzzle';

const N_ROWS = 9;
const N_COLUMNS = 9;
const N_SQUARES_BY_ROW = 3;
const N_SQUARES_BY_COLUMN = 3;

export class GridValidationManager {

    constructor() {
        //
    }

    public validateGrid(puzzle: PuzzleItem[][]): boolean {
        return this.validateRows(puzzle) && this.validateColumns(puzzle) && this.validateSquares(puzzle);
    }

    public validateRows(puzzle: PuzzleItem[][]): boolean {
        for (let i = 0; i < N_ROWS; ++i) {
            if (!this.isRowValid(puzzle, i)) {
                return false;
            }
        }
        return true;
    }

    public validateColumns(puzzle: PuzzleItem[][]): boolean {
        for (let j = 0; j < N_COLUMNS; ++j) {
            if (!this.isColumnValid(puzzle, j)) {
                return false;
            }
        }
        return true;
    }

    public validateSquares(puzzle: PuzzleItem[][]): boolean {
        for (let i = 0; i < N_SQUARES_BY_ROW; ++i) {
            for (let j = 0; j < N_SQUARES_BY_COLUMN; ++j) {
                if (!this.isSquareValid(puzzle, i * 3, j * 3)) {
                    return false;
                }
            }
        }
        return true;
    }

    public isRowValid(grid: PuzzleItem[][], rowIndex: number): boolean {
        let contained = new Array<number>();
        for (let j = 0; j < N_COLUMNS; ++j) {
            if (grid[rowIndex][j].value === null) {
                return false;
            }
            if (contained.indexOf(Number(grid[rowIndex][j].value)) === -1) {
                contained.push(Number(grid[rowIndex][j].value));
            } else {
                return false;
            }
        }
        return true;
    }

    public isColumnValid(grid: PuzzleItem[][], columnIndex: number): boolean {
        let contained = new Array<number>();
        for (let i = 0; i < N_ROWS; ++i) {
            if (grid[columnIndex][i].value === null) {
                return false;
            }
            if (contained.indexOf(Number(grid[i][columnIndex].value)) === -1) {
                contained.push(Number(grid[i][columnIndex].value));
            } else {
                return false;
            }
        }
        return true;
    }

    // Check if the square around the value is valid.
    public isSquareValid(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        let contained = new Array<number>();
        for (let rowId1 = squareMinRowIndex; rowId1 <= squareMaxRowIndex; ++rowId1) {
            for (let columnId1 = squareMinColumnIndex; columnId1 <= squareMaxColumnIndex; ++columnId1) {
                if (grid[rowId1][columnId1].value === null) {
                    return false;
                }
                if (contained.indexOf(Number(grid[rowId1][columnId1].value)) === -1) {
                    contained.push(Number(grid[rowId1][columnId1].value));
                } else {
                    return false;
                }
            }
        }
        return true;
    }
}
