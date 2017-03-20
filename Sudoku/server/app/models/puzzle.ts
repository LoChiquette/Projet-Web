/**
 * puzzle.ts - Represent a Sudoku puzzle/grids
 *
 * @authors ...
 * @date 2017/01/22
 */

export interface IPuzzleItemData {
    _value: number;
    _hide: boolean;
}

export class PuzzleItem {
    private _value: number;
    private _hide: boolean;
    //private _isRed: boolean;

    /**
     * Extract from an any object the properties _value and _hide to create an object of type PuzzleItem.
     * A typeError is thrown if the object doesn't contain the properties of the IPuzzleItemData interface.
     */
    public static convertObjectToPuzzleItem(object: IPuzzleItemData): PuzzleItem {
        if (object._value === undefined || object._hide === undefined) {
            throw new TypeError("The object doesn't have the property _value or _hide.");
        }
        return new PuzzleItem(Number(object._value), object._hide);
    }

    constructor(value: number, hide: boolean) {
        this._value = value;
        this._hide = hide;
        //this._isRed = false;
    }

    get isHidden(): boolean {
        return this._hide;
    }

    set isHidden(hidden: boolean) {
        this._hide = hidden;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }
}

export class Puzzle {

    public static readonly MAX_ROW_INDEX = 8;
    public static readonly MAX_COLUMN_INDEX = 8;
    public static readonly MID_ROW_INDEX = Math.floor(Puzzle.MAX_ROW_INDEX / 2);
    public static readonly MID_COLUMN_INDEX = Math.floor(Puzzle.MAX_COLUMN_INDEX / 2);
    public static readonly SQUARE_LENGTH = 3;
    public static readonly MIN_ROW_INDEX = 0;
    public static readonly MIN_COLUMN_INDEX = 0;
    public static readonly ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    public static readonly MIN_NUMBER = 1;
    public static readonly MAX_NUMBER = 9;

    public _puzzle: Array<Array<PuzzleItem>>;
    private _numberOfHoles: number;

    /*
    public static convertObjectToPuzzle(object: Array<Array<IPuzzleItemData>>): Puzzle {
        let puzzle = new Puzzle();
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            if (puzzle[row] === undefined || puzzle[row] === null) {
                throw new TypeError("The puzzle is not a valid double array of 9 x 9.");
            }
            for (let column = Puzzle.MIN_COLUMN_INDEX; row <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                if (puzzle[row][column] === undefined || puzzle[row][column] === null) {
                    throw new TypeError("The puzzle is not a valid double array of 9 x 9.");
                }
                puzzle.
            }
        }
        return puzzle;
    }
    */

    private static validateRowColumnIndex(row: number, column: number): boolean {
        return row >= Puzzle.MIN_ROW_INDEX && row <= Puzzle.MAX_ROW_INDEX
            && column >= Puzzle.MIN_COLUMN_INDEX && column <= Puzzle.MAX_COLUMN_INDEX;
    }

    /*Initialize the following sudoku :
        1 2 3 | 4 5 6 | 7 8 9
        4 5 6 | 7 8 9 | 1 2 3
        7 8 9 | 1 2 3 | 4 5 6
        ------+-------+------
        2 3 4 | 5 6 7 | 8 9 1
        5 6 7 | 8 9 1 | 2 3 4
        8 9 1 | 2 3 4 | 5 6 7
        ------+-------+------
        3 4 5 | 6 7 8 | 9 1 2
        6 7 8 | 9 1 2 | 3 4 5
        9 1 2 | 3 4 5 | 6 7 8
    */
    constructor(puzzle: Puzzle = null) {
        this._puzzle = new Array<Array<PuzzleItem>>();
        if (puzzle === null) {
            this.generateDefaultSudoku();
            this._numberOfHoles = 0;
        }
        else {
            this.copySudoku(puzzle);
            this._numberOfHoles = puzzle.getNumberOfHoles();
        }
    }

    private generateDefaultSudoku() {
        for (let squareRow = 0; squareRow < Puzzle.SQUARE_LENGTH; ++squareRow) {
            let numberShift = 0;
            for (let insideSquare = 0; insideSquare < Puzzle.SQUARE_LENGTH; ++insideSquare) {
                let rowIndex = squareRow * Puzzle.SQUARE_LENGTH + insideSquare;
                this._puzzle[rowIndex] = new Array<PuzzleItem>();
                let initialNumber = squareRow + numberShift;
                for (let column = 0; column <= Puzzle.MAX_ROW_INDEX; ++column) {
                    this._puzzle[rowIndex][column] =
                        new PuzzleItem(initialNumber % (Puzzle.MAX_ROW_INDEX + 1) + 1, false);
                    ++initialNumber;
                }
                numberShift += Puzzle.SQUARE_LENGTH;
            }
            numberShift += 1;
        }
    }

    private copySudoku(puzzle: Puzzle) {
        puzzle._puzzle.forEach((row: PuzzleItem[], indexRow: number, sudokuArray: PuzzleItem[][]) => {
            this._puzzle[indexRow] = new Array<PuzzleItem>();
            row.forEach((item: PuzzleItem, indexColumn: number, rowArray: PuzzleItem[]) => {
                this._puzzle[indexRow][indexColumn] = new PuzzleItem(item.value, item.isHidden);
            });
        });
    }

    public getPuzzleTileValue(row: number, column: number): number {
        if (!Puzzle.validateRowColumnIndex(row, column)) {
            throw new RangeError("Invalid row of column index.");
        }
        return this._puzzle[row][column].value;
    }

    public setPuzzleTileValue(row: number, column: number, newValue: number) {
        if (!Puzzle.validateRowColumnIndex(row, column)) {
            throw new RangeError("Invalid row or column index.");
        }
        if (Puzzle.MIN_ROW_INDEX + 1 > newValue || Puzzle.MAX_ROW_INDEX + 1 < newValue) {
            throw new RangeError("Invalid number. The number entered is " + newValue.toString()
            + ". It must be between " + (Puzzle.MIN_ROW_INDEX + 1).toString() + " and "
            + (Puzzle.MAX_ROW_INDEX + 1).toString() + "inclusively.");
        }
        this._puzzle[row][column].value = newValue;
    }

    public getPuzzleTileVisibility(row: number, column: number): boolean {
        if (!Puzzle.validateRowColumnIndex(row, column)) {
            throw new RangeError("Invalid row or column index.");
        }
        return this._puzzle[row][column].isHidden;
    }

    public setPuzzleTileVisibility(row: number, column: number, isHidden: boolean) {
        if (!Puzzle.validateRowColumnIndex(row, column)) {
            throw new RangeError("Invalid row or column index.");
        }
        if (isHidden === null) {
            throw new RangeError("The isHidden value cannot be null");
        }
        if (this._puzzle[row][column].isHidden !== isHidden) {
            this._numberOfHoles += isHidden ? 1 : -1;
            this._puzzle[row][column].isHidden = isHidden;
        }
    }

    public swapRow(rowA: number, rowB: number) {
        for (let column = 0; column < this._puzzle.length; ++column) {
            this.swapTwoTiles(rowA, column, rowB, column);
        }
    }

    public swapColumn(columnA: number, columnB: number) {
        for (let row = 0; row < this._puzzle.length; ++row) {
            this.swapTwoTiles(row, columnA, row, columnB);
        }
    }

    public horizontalSymmetry() {
        for (let i = Puzzle.MIN_COLUMN_INDEX; i < Puzzle.MID_COLUMN_INDEX; ++i) {
            this.swapRow(i, Puzzle.MAX_COLUMN_INDEX - i);
        }
    }

    public verticalSymmetry() {
        for (let j = Puzzle.MIN_ROW_INDEX; j < Puzzle.MID_ROW_INDEX; ++j) {
            this.swapColumn(j, Puzzle.MAX_ROW_INDEX - j);
        }
    }

    public diagonal1Symmetry() {
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            for (let column = row; column <= Puzzle.MAX_COLUMN_INDEX; ++column) {
                this.swapTwoTiles(row, column, column, row);
            }
        }
    }

    public diagonal2Symmetry() {
        for (let row = Puzzle.MIN_ROW_INDEX; row <= Puzzle.MAX_ROW_INDEX; ++row) {
            for (let column = Puzzle.MIN_COLUMN_INDEX; column <= Puzzle.MAX_COLUMN_INDEX - row; ++column) {
                this.swapTwoTiles(row, column, Puzzle.MAX_ROW_INDEX - column, Puzzle.MAX_ROW_INDEX - row);
            }
        }
    }

    public getNumberOfHoles(): number {
        return this._numberOfHoles;
    }

    private swapTwoTiles(rowA: number, columnA: number, rowB: number, columnB: number) {
        let temp = this._puzzle[rowA][columnA];
        this._puzzle[rowA][columnA] = this._puzzle[rowB][columnB];
        this._puzzle[rowB][columnB] = temp;
    }

    //Erase the PuzzleItem marked hidden.
    public createPuzzleHoles() {
        this._puzzle.forEach((puzzleItems) => {
            puzzleItems.forEach((puzzleItem) => {
                puzzleItem.value = (puzzleItem.isHidden) ? null : puzzleItem.value;
            });
        });
    }

    public hideAllItemsInRange(minRow: number, maxRow: number, minColumn: number, maxColumn: number) {
        if (minRow < Puzzle.MIN_ROW_INDEX || minRow > Puzzle.MAX_ROW_INDEX || minColumn < Puzzle.MIN_COLUMN_INDEX
            || maxColumn > Puzzle.MAX_COLUMN_INDEX || minRow > maxRow || minColumn > maxColumn) {
                throw new Error("One parameter is invalid. The min must be smaller or equals than the max"
                    + " and they must be in the range of the sudoku index.");
        }
        for (let row = minRow; row <= maxRow; ++row) {
            for (let column = minColumn; column <= maxColumn; ++column) {
                this.setPuzzleTileVisibility(row, column, true);
            }
        }
    }

    public generateJSONFormat(): string {
        return JSON.stringify(this._puzzle);
    }

    public printToConsole() {
        this._puzzle.forEach((row: PuzzleItem[], rowIndex: number, array: PuzzleItem[][]) => {
            let toWrite = "";
            row.forEach((item: PuzzleItem, columnIndex: number, items: PuzzleItem[]) => {
                if (!item.isHidden) {
                    toWrite += item.value + " ";
                }
                else {
                    toWrite += "  ";
                }
            });
            console.log(toWrite);
        });
    }
}

export enum Difficulty {
    NORMAL = 0,
    HARD = 1,
    NUMBER_OF_DIFFICULTIES = 2
}
