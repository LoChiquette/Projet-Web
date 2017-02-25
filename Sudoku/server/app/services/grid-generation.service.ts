/**
 * puzzle-manager.service.ts - Manage the puzzles generation
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Puzzle } from './../models/puzzle';

const NOMBRE_ITERATION = 1;

// Used to generate the type of transformation and to give a number of holes to dig in sudoku
function getRandomInRange(min: number, max: number) {
    return function (): number {
        return Math.floor((Math.random() / Math.random() / Math.random()) % (max - min)) + min;
    };
}

module GridGenerationService {

    export enum Difficulty {
        NORMAL = 0,
        HARD = 1,
        NUMBER_OF_DIFFICULTIES = 2
    }

    export class GridGenerationManager {

        private static MILLISECONDS_TO_WAIT = 5000;

        private _sudokuGenerated: Array<Array<Puzzle>>;

        constructor() {
            this._sudokuGenerated = new Array<Array<Puzzle>>();
            for (let i = 0; i < Difficulty.NUMBER_OF_DIFFICULTIES; ++i) {
                this._sudokuGenerated.push(new Array<Puzzle>());
            }
        }

        public getNewPuzzle(difficulty: Difficulty): Promise<Puzzle> {
            return new Promise((resolve, reject) => {
                if (this._sudokuGenerated[difficulty].length !== 0) {
                    let sudokuGenerated = this._sudokuGenerated[difficulty].pop();
                    //Launch a new sudoku generation after the sudokuGenerated is returned.
                    resolve(sudokuGenerated);
                    setTimeout(this._sudokuGenerated[difficulty].push(this.generateNewPuzzle(difficulty)), 0);
                }
                else {
                    //Generate a new puzzle and wait until 5 seconds is elapsed to return the sudoku generated.
                    let time = Date.now();
                    let sudokuGenerated = this.generateNewPuzzle(difficulty);
                    let intervalOfTimeForGeneration = Date.now() - time;
                    let waitTime = (GridGenerationManager.MILLISECONDS_TO_WAIT - intervalOfTimeForGeneration)
                    setTimeout(resolve.bind(resolve, sudokuGenerated), waitTime > 0 ? waitTime : 0);
                }
            });
        }

        /**
         * The getNewPuzzle function, return a new puzzle.
         *
         * @class PuzzleManager
         * @method getNewPuzzle
         * @return newPuzzle
         */
        public generateNewPuzzle(difficulty?: Difficulty) {
            let endTime = new Date().getTime() / 1000 + 5;
            let getRandomSudoku = getRandomInRange(1, 9);
            let newPuzzle: Puzzle = new Puzzle();
            let deltaIteration: number = Math.round(NOMBRE_ITERATION * Math.random());

            for (let it = 0; it < NOMBRE_ITERATION + deltaIteration; ++it) {
                // Rows swapping
                let rowA: number;
                let rowB: number;
                do {
                    rowA = getRandomSudoku() - 1;
                    rowB = getRandomSudoku() - 1;
                } while (rowA === rowB || Math.floor(rowA / 3) * 3 !== Math.floor(rowB / 3) * 3);
                // While the rows aren't in the same square (3x3) or while the rows are equal
                newPuzzle.swapRow(rowA, rowB);

                // Column swapping
                let columnA: number;
                let columnB: number;
                do {
                    columnA = getRandomSudoku() - 1;
                    columnB = getRandomSudoku() - 1;
                } while (columnA === columnB || Math.floor(columnA / 3) * 3 !== Math.floor(columnB / 3) * 3);
                // While the columns aren't in the same square (3x3) or while the columns are equal
                newPuzzle.swapColumn(columnA, columnB);

                // Horizontal Symmetry
                newPuzzle.horizontalSymmetry();

                // Vertical Symmetry
                newPuzzle.verticalSymmetry();
            }
            return this.createPuzzleHoles(newPuzzle);
        }

        /**
         * The extractNewPuzzle function, extract the new puzzle without the solution.
         *
         * @class PuzzleManagerService
         * @method createPuzzleHoles
         * @return Puzzle
         */
        public createPuzzleHoles(puzzle: Puzzle) {

            if (puzzle === null) {
                throw new Error("The parameter cannot be null");
            }
            puzzle._puzzle.forEach((puzzleItems) => {
                puzzleItems.forEach((puzzleItem) => {
                    puzzleItem._value = (puzzleItem._hide) ? null : puzzleItem._value;
                });
            });
            return puzzle;
        }
    }
}

export = GridGenerationService;
