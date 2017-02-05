
import {
    fakeAsync,
    inject,
    TestBed
} from '@angular/core/testing';


import { expect, assert } from 'chai';

import { Puzzle, PuzzleItem } from '../models/puzzle';
import { GridManagerService } from '../services/grid-manager.service';

describe('GridManagerService', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                GridManagerService
            ]
        });
    });

    it("isDuplicatedNumberInCurrentRow, Should return false with a duplicated number error in the current row",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(2, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentRow(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in a row");

            }))
    );

    it("isDuplicatedNumberInCurrentRow, Should return true for a valid row",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(5, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentRow(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    "The current row must be valid");

            }))
    );

    it("isDuplicatedNumberInCurrentColumn, Should return false with a duplicated number error in the current column",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                /* []
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(6, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(6, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentColumn(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in a column");

            }))
    );

    it("isDuplicatedNumberInCurrentColumn, Should return true for a valid column",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                /* []
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(6, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false)],
                    [new PuzzleItem(8, false), new PuzzleItem(null, true), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentColumn(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " The current column must be valid");

            }))
    );

    it("isDuplicatedNumberInCurrentSquare, Should return false with a duplicated number error in the first square",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                /*  [][]
                    [][]
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(1, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentSquare(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in a square");

            }))
    );

    it("isDuplicatedNumberInCurrentSquare, Should return true for a valid square",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                /*  [][]
                    [][]
                */
                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(8, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.isDuplicatedNumberInCurrentSquare(
                    fakePuzzle._puzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " The current square must be valid");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number error in the first row/column and square",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(1, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(1, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in the same row/column/square");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the first row",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(1, false),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    " A duplicated number is not allowed in the current first row");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the first column",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    "A duplicated number is not allowed in a column");

            }))
    );

    it("validateEnteredNumber, Should return false with a duplicated number in the 1st column, 2nd row",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(2, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(1, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === false,
                    "A duplicated number is not allowed in a column");

            }))
    );

    it("validateEnteredNumber, Should return true with a valid grid",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Create a ready puzzle for the grid.
                let fakePuzzle = new Puzzle([
                    [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                    new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                    [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                    new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                    new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                    [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                    new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                    new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                    [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                    new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
                ]);

                let newDuplicatedRowId = 0;
                let newDuplicatedColumnId = 0;

                assert(gridManagerService.validateEnteredNumber(
                    fakePuzzle, newDuplicatedRowId, newDuplicatedColumnId) === true,
                    " The current grid must be valid");

            }))
    );

    it("initializeGrid should throw a null argument error",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                assert.throws(() => gridManagerService.initializeGrid(null), Error, "The initial grid cannot be null");
            })));

    it("initializeGrid should reset the current given",
        inject([GridManagerService], fakeAsync((gridManagerService: GridManagerService) => {

            // Create a fake valid puzzle.
            let fakePuzzle = new Puzzle([
                [new PuzzleItem(1, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                new PuzzleItem(6, true), new PuzzleItem(3, false), new PuzzleItem(8, true)],
                [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                new PuzzleItem(5, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(7, true),
                new PuzzleItem(9, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                [new PuzzleItem(3, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                new PuzzleItem(4, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                new PuzzleItem(3, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(8, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
            ]);

            let expectedPuzzle = new Puzzle([
                [new PuzzleItem(null, true), new PuzzleItem(2, false), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(3, false), new PuzzleItem(null, true)],
                [new PuzzleItem(4, false), new PuzzleItem(6, false), new PuzzleItem(3, false),
                new PuzzleItem(null, true), new PuzzleItem(1, false), new PuzzleItem(null, true)],
                [new PuzzleItem(5, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(4, false), new PuzzleItem(null, true)],

                [new PuzzleItem(null, true), new PuzzleItem(5, false), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(2, false), new PuzzleItem(null, true)],
                [new PuzzleItem(2, false), new PuzzleItem(1, false), new PuzzleItem(4, false),
                new PuzzleItem(null, true), new PuzzleItem(7, false), new PuzzleItem(null, true)],
                [new PuzzleItem(7, false), new PuzzleItem(null, true), new PuzzleItem(null, true),
                new PuzzleItem(null, true), new PuzzleItem(5, false), new PuzzleItem(null, true)],
            ]);

            gridManagerService.initializeGrid(fakePuzzle);

            // Check the expected result
            expect(fakePuzzle).to.deep.equal(expectedPuzzle);
        })));

    // it("deleteCurrentValue should throw a null element error for a not existing DOM element",
    //     inject([GridManagerService],
    //         fakeAsync((gridManagerService: GridManagerService) => {

    //             // Since we don't have an input element with index like [1][100]
    //             // This should throw an Error.
    //             let invalidRowIndex = 1;
    //             let invalidColumnIndex = 333333;
    //             assert.throws(() => gridManagerService.deleteCurrentValue(
    //              invalidRowIndex, invalidColumnIndex), Error, "Invalid Input element");

    //         })));

    it("deleteCurrentValue should throw an out of range index error",
        inject([GridManagerService],
            fakeAsync((gridManagerService: GridManagerService) => {

                // Since we don't have an input element with index like [1][100]
                // This should throw an Error.
                let invalidRowIndex = -1;
                let validColumnIndex = -1;
                assert.throws(() => gridManagerService.deleteCurrentValue(invalidRowIndex, validColumnIndex),
                    Error, "A row or a column index cannot be less than (0)");

            })));

});