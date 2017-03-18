import { Player } from "./player";
import { QueueCollection } from "./queue-collection";
import { Letter } from "./letter";
import { Board } from "./board/board";
import { TimerService } from "../services/timer.service";
import { LetterBankHandler } from "../services/letterbank-handler";

let uuid = require('node-uuid');

export class Room {

    static roomMinCapacity = 1;
    static roomMaxCapacity = 4;

    private _playersQueue: QueueCollection<Player>;
    private _letterBankHandler: LetterBankHandler;
    private _timerService: TimerService;
    private _roomCapacity: number;
    private _roomId: string;
    private _board: Board;

    public get timerService() {
        this._timerService.initializeCounter();
        return this._timerService;
    }
    // The constructor of the room
    constructor(roomCapacity: number) {
        if (roomCapacity < Room.roomMinCapacity || roomCapacity > Room.roomMaxCapacity) {
            throw new RangeError("Argument error: the number of players must be between 1 and 4.");
        }

        this._roomCapacity = roomCapacity;
        this._playersQueue = new QueueCollection<Player>();
        this._letterBankHandler = new LetterBankHandler();
        this._timerService = new TimerService();
        this._roomId = uuid.v1(); // Generate a v1 (time-based) id
        this._board = new Board();
    }

    // The player of the room
    public get players(): QueueCollection<Player> {
        return this._playersQueue;
    }
    public set players(value: QueueCollection<Player>) {
        this._playersQueue = value;
    }

    public get letterBankHandler(): LetterBankHandler {
        return this._letterBankHandler;
    }

    // The room unique id
    public get roomId(): string {
        return this._roomId;
    }

    // The board of the room
    public get board() : Board {
        return this._board;
    }

    // The room capacity
    public get roomCapacity(): number {
        return this._roomCapacity;
    }

    // Check if the room is full or not
    public isFull(): boolean {
        return this._playersQueue.count === this._roomCapacity;
    }

    // Add a new player to the current room
    public addPlayer(player: Player) {

        if (typeof (player) === "undefined" || player == null) {
            throw new Error("The player cannot be null");
        }

        if (this.isFull()) {
            throw new Error("The room is full, cannot add a new player");
        }

        if (this.isUsernameAlreadyExist(player.username)) {
            throw new Error("The username already exist in this room");
        }

        this._playersQueue.enqueue(player);
    }

    // Get the number of missing player before the game
    public numberOfMissingPlayers(): number {
        return this._roomCapacity - this._playersQueue.count;
    }

    // Remove a player from the current room
    public removePlayer(player: Player): Player {
        let playerRemoved: Player = null;
        if (player === null || player === undefined) {
            throw new Error("Argument error: the player cannot be null");
        }

        playerRemoved = this._playersQueue.remove(player);
        return playerRemoved;
    }

    // Check if the username of the player already exist in the current room
    public isUsernameAlreadyExist(username: string): Boolean {
        if (username === null) {
            throw new Error("Argument error: the username cannot be null");
        }
        let exist = false;
        this._playersQueue.forEach((player: Player) => {
            if (player.username === username) {
                exist = true;
            }
        });

        return exist;
    }

    // Use to exchange letters from the a player easel
    public exchangeThePlayerLetters(letterToBeExchange: Array<string>): Array<string> {
        return this.letterBankHandler.exchangeLetters(letterToBeExchange);
    }

    public getAndUpdatePlayersQueue(): Array<string> {
        let newPlayerOrder = new Array<string>();
        let players = this._playersQueue.updateAndGetQueuePriorities();

        for (let index = 0; index < players.length; ++index) {
            newPlayerOrder[index] = players[index].username;
        }
        this._timerService.initializeCounter();
        return newPlayerOrder;
    }

    public randomizePlayersPriorities() {
        if (this._playersQueue.count > 1) {
            this._playersQueue.randomizeTheListOfThePriorities();
        }
    }

    public getInitialsLetters(): Array<string> {
        return this.letterBankHandler.initializeEasel();
    }
}