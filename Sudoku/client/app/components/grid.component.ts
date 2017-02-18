/**
 * grid.component.ts - Represents a component which display the grid of the Sudoku.
 *
 * @authors ...
 * @date 2017/01/22
 */

import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/timer';


import { RestApiProxyService } from '../services/rest-api-proxy.service';
import { GridManagerService } from '../services/grid-manager.service';
import { UserSettingService } from '../services/user-setting.service';
import { PuzzleEventManagerService } from '../services/puzzle-event-manager.service';
import { StopwatchService } from "../services/stopwatch.service";

import { PuzzleCommon } from '../commons/puzzle-common';
import { Puzzle } from '../models/puzzle';
import { Record } from '../models/record';
import { UserSetting, Difficulty } from '../models/user-setting';

import { Observable } from 'rxjs/Observable';
import { Time } from "../models/time";


//noinspection TsLint
@Component({
    moduleId: module.id,
    selector: 'sudoku-grid',
    templateUrl: "/assets/templates/grid.component.html",
    styleUrls: ["../../assets/stylesheets/grid.component.css"],
    providers: [GridManagerService, PuzzleEventManagerService, StopwatchService]
})

export class GridComponent implements OnInit {
    _puzzle: Puzzle;
    _isLoading: boolean;
    _isFinished: boolean;
    _userSetting: UserSetting;
    _time: Time;
    _hiddenClock: boolean;
    _easyRecords: Array<Record>;
    _hardRecords: Array<Record>;

    @ViewChild("messageCongratulation") messageCongratulation: ElementRef;
    @ViewChild("leaderboard") leaderboard: ElementRef;

    constructor(
        private gridManagerService: GridManagerService,
        private puzzleEventManager: PuzzleEventManagerService,
        private userSettingService: UserSettingService,
        private api: RestApiProxyService,
        private stopwatchService: StopwatchService) {
    }

    // Initialization
    ngOnInit() {
        this._isLoading = true;
        this._isFinished = false;
        this._userSetting = this.userSettingService.userSetting;
        this._time = new Time();
        this.getNewPuzzle(this._userSetting.difficulty);
        Observable.timer(0, 1000).subscribe(() => {
            if (!this._isLoading && !this._isFinished) {
                this.stopwatchService.updateClock();
                this._time.seconds = this.stopwatchService.seconds;
                this._time.minutes = this.stopwatchService.minutes;
                this._time.hours = this.stopwatchService.hours;
            }
        });
        this._easyRecords = new Array<Record>();
        this._hardRecords = new Array<Record>();
    }

    @HostListener('window:beforeunload')
    public async logout() {
        let str: string;
        await this.api.removeUsername(this._userSetting.name)
            .then(result => {
                if (result) {
                    str = "done";
                }
                else {
                    str = "not done";
                }
            })
            .catch(error => {
                console.log("error: ", error);
                str = "error";
            });
        return str;
    }

    public getNewPuzzle(difficulty: Difficulty) {
        this._isLoading = true;
        this._time.resetTime();
        this.leaderboard.nativeElement.classList.add("fade");
        this.hideMessageCongratulation();
        this._easyRecords = [];
        this._hardRecords = [];
        this.api.getNewPuzzle(difficulty)
            .subscribe((puzzle: Puzzle) => {
                this.stopwatchService.resetTime();
                this._isLoading = false;
                this._isFinished = false;
                this._puzzle = puzzle;
                this._userSetting.difficulty = difficulty;
                this.gridManagerService.countFilledCell(puzzle);
            });
    }

    // Handle the directions key event by using the EventManager
    public onKeyDownEventHandler(event: KeyboardEvent, id: string) {
        this.puzzleEventManager.onKeyEventUpdateCurrentCursor(event, id);
    }

    // Handle the input value changed event from grid
    public async onValueChange(event: KeyboardEvent, id: string) {

        let rowColIndex = id.split('');
        let rowIndex = Number(rowColIndex[PuzzleCommon.yPosition]);
        let colIndex = Number(rowColIndex[PuzzleCommon.xPosition]);

        if (this.puzzleEventManager.isDeleteKey(event.key)) {
            if (this._puzzle._puzzle[rowIndex][colIndex]._value !== null) {
                this.gridManagerService.deleteCurrentValue(this._puzzle, rowIndex, colIndex);
                this.gridManagerService.updateGridAfterDelete(this._puzzle, rowIndex, colIndex);
            }
        }
        else if (this.puzzleEventManager.isSudokuNumber(event.key)) {
            this.gridManagerService.decrementCellsToBeCompleted();
            this.gridManagerService.validateEnteredNumber(this._puzzle, rowIndex, colIndex);
            // TODO: replace 59 by 0

            if (this.gridManagerService.cellsToBeCompleted === 59) {
                //if (this.api.verifyGrid(this._puzzle)) {
                this._isFinished = true;
                await this.api.getTopRecords().then(topRecords => {
                    let isInserted = false;
                    if (this._userSetting.difficulty === Difficulty.NORMAL) {
                        for (let i = 0; i < topRecords[0].length
                            && this._easyRecords.length <= topRecords[0].length; ++i) {
                            if (this._time.compareTo(topRecords[0][i].time) === -1 && !isInserted) {
                                isInserted = true;
                                this._easyRecords.push(
                                    new Record(this._userSetting.name, this._userSetting.difficulty, this._time)
                                );
                            }
                            else {
                                this._easyRecords.push(topRecords[0][i]);
                            }
                        }
                        this._hardRecords = topRecords[1];
                    }
                    else if (this._userSetting.difficulty === Difficulty.HARD) {
                        for (let i = 0; i < topRecords[1].length
                            && this._hardRecords.length <= topRecords[1].length; ++i) {
                            if (this._time.compareTo(topRecords[1][i].time) === -1 && !isInserted) {
                                isInserted = true;
                                this._hardRecords.push(
                                    new Record(this._userSetting.name, this._userSetting.difficulty, this._time)
                                );
                            }
                            else {
                                this._hardRecords.push(topRecords[1][i]);
                            }
                        }
                        this._easyRecords = topRecords[0];
                    }
                    if (isInserted) {
                        this.leaderboard.nativeElement.classList.remove("fade");
                        this.messageCongratulation.nativeElement.classList.remove("fade");
                    }
                }).catch(error => {
                    console.log(error);
                });
                //this.api.createGameRecord(this._userSetting, this._time);
                //}
            }
        }
    }

    // Initialize the current grid
    public initializeCurrentGrid() {
        if (this._puzzle === null
            || this._puzzle._puzzle == null) {
            throw new Error("The initial grid cannot be null.");
        }

        this.stopwatchService.resetTime();
        this.leaderboard.nativeElement.classList.add("fade");
        this.hideMessageCongratulation();
        this.gridManagerService.initializeGrid(this._puzzle);
        this._isFinished = false;
        this._easyRecords = [];
        this._hardRecords = [];
    }

    // Use to check if a value is a Sudoku number
    public validateInputValue(event: KeyboardEvent) {
        if (event === null) {
            throw new Error("No event source is provided.");
        }

        if (!this.puzzleEventManager.isSudokuNumber(event.key)) {
            return false;
        }
    }

    public hideMessageCongratulation() {
        this.messageCongratulation.nativeElement.classList.add("fade");
    }

    public hideClock() {
        this._hiddenClock = !this._hiddenClock;
    }
}
