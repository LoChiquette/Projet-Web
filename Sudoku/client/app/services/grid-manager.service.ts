 import { Injectable } from '@angular/core';

import { Puzzle, PuzzleItem } from '../models/puzzle';

declare var jQuery: any;

export const CELL_ID_PREFIX = "#";
export const CSS_BACKGROUND_PROPERTY = "background-color";
export const CSS_BACKGROUND_VALUE = "#E57373 ";
export const CSS_BACKGROUND_INIT = "";
const SUDOKU_LENGTH = 9;
@Injectable()
export class GridManagerService {
    private _cellsToBeCompleted = 0;

    constructor() {
        //Default constructor
    }

    get cellsToBeCompleted(): number {
        return this._cellsToBeCompleted;
    }

    //  Check if the value is valid
    public validateEnteredNumber(puzzle: Puzzle, rowIndex: number, columnIndex: number): boolean {

        let grid = puzzle._puzzle;

        let isColumnValid = !(this.isDuplicatedNumberInCurrentColumn(grid, rowIndex, columnIndex));
        let isRowValid = !(this.isDuplicatedNumberInCurrentRow(grid, rowIndex, columnIndex));
        let isSquareValid = this.isDuplicatedNumberInCurrentSquare(grid, rowIndex, columnIndex);

        if (isColumnValid && isRowValid && isSquareValid) {
            this.updateCurrentCellFormat(rowIndex, columnIndex, true);
        } else {
            if ((!isSquareValid || !isColumnValid || !isRowValid)
             && grid[rowIndex][columnIndex]._value !== null) {
                this.updateCurrentCellFormat(rowIndex, columnIndex);
            }
        }
        this._cellsToBeCompleted--;
        return (isRowValid && isColumnValid && isSquareValid);
    }

    updateCurrentCellFormat(rowIndex: number, columnIndex: number, removeErrorCSS?: boolean) {
        let borderPropertyValue = (!removeErrorCSS) ? CSS_BACKGROUND_VALUE : CSS_BACKGROUND_INIT;
        let cellId = CELL_ID_PREFIX + rowIndex + columnIndex;
        jQuery(cellId).css(CSS_BACKGROUND_PROPERTY, borderPropertyValue);
    }

    public isDuplicatedNumberInCurrentRow(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {

        let puzzleItem = Number(grid[rowIndex][columnIndex]._value);

        for (let columnId = 0; columnId < grid[rowIndex].length ; ++columnId) {
            if (puzzleItem === Number(grid[rowIndex][columnId]._value)
                && columnId !== columnIndex) {
                return true;
            }
        }
        return false;
    }

    public isDuplicatedNumberInCurrentColumn(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {

        let puzzleItem = Number(grid[rowIndex][columnIndex]._value);

        for (let rowId = 0; rowId < grid[rowIndex].length  ; ++rowId) {
            if (puzzleItem === Number(grid[rowId][columnIndex]._value)
                && rowId !== rowIndex) {
                return true;
            }
        }
        return false;
    }

    // Check if the square around the value is valid.
    public isDuplicatedNumberInCurrentSquare(grid: PuzzleItem[][], rowIndex: number, columnIndex: number): boolean {
        let squareMinRowIndex = Math.floor(rowIndex / 3) * 3;
        let squareMaxRowIndex = squareMinRowIndex + 2;
        let squareMinColumnIndex = Math.floor(columnIndex / 3) * 3;
        let squareMaxColumnIndex = squareMinColumnIndex + 2;

        for (let rowId1 = squareMinRowIndex; rowId1 <= squareMaxRowIndex; ++rowId1) {

            for (let columnId1 = squareMinColumnIndex; columnId1 <= squareMaxColumnIndex; ++columnId1) {

                let count = 0;
                let cellValue = grid[rowId1][columnId1]._value;

                for (let rowId2 = squareMinRowIndex; rowId2 <= squareMaxRowIndex; ++rowId2) {
                    for (let columnId2 = squareMinColumnIndex; columnId2 <= squareMaxColumnIndex; ++columnId2) {

                        if (Number(grid[rowId2][columnId2]._value) === Number(cellValue)
                            && Number(cellValue) !== 0) {
                            ++count;
                        }
                        if (count > 1) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    // Clears the cells the user filled.
    // Initialize the grid format to prevent when an invalid grid format is applied.
    public initializeGrid(puzzle: Puzzle) {

        if (puzzle === null
            || puzzle._puzzle === null) {
            throw new Error("The initial grid cannot be null");
        }
        this._cellsToBeCompleted = 0;

        for (let row = 0; row < puzzle._puzzle.length; ++row) {

            for (let column = 0; column < puzzle._puzzle.length; ++column) {

                if (puzzle._puzzle[row][column]._hide) {
                    puzzle._puzzle[row][column]._value = null;
                    this._cellsToBeCompleted++;
                }
                this.updateCurrentCellFormat(row, column, true);
            }
        }
    }

    // Delete the current value and update the cell format.
    public deleteCurrentValue(puzzle: Puzzle, rowIndex: number, colIndex: number) {

        if (rowIndex < 0 || colIndex < 0) {
            throw new Error("A row or a column index cannot be less than (0)");
        }
        // Get the id of the current input id and delete it value
        let inputId = [CELL_ID_PREFIX, rowIndex, colIndex].join('');

        jQuery(inputId).val("");
        jQuery(inputId).css("background-color", "");

        puzzle._puzzle[rowIndex][colIndex]._value = null;
        this._cellsToBeCompleted++;
    }

    public countFilledCell(puzzle: Puzzle){
        this._cellsToBeCompleted = 0;
        puzzle._puzzle.forEach((puzzleItems) => {
            puzzleItems.forEach((puzzleItem) => {
                if (puzzleItem._hide){
                    this._cellsToBeCompleted++;
                }
            });
        });
    }
}
