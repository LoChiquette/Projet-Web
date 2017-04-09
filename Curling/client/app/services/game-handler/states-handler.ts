import { AbstractGameState } from "../../models/states/abstract-game-state";
import { ComputerShooting } from "../../models/states/computer-shooting";
import { ComputerTurn } from "../../models/states/computer-turn";
import { EndGame } from "../../models/states/end-game";
import { EndSet } from "../../models/states/end-set";
import { LoadingStone } from "../../models/states/loading-stone";
import { PlayerShooting } from "../../models/states/player-shooting";
import { PlayerTurn } from "../../models/states/player-turn";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { ComputerAI } from "../../models/AI/ComputerAI";
import { NormalAI } from "../../models/AI/normalAI";
import { HardAI } from "../../models/AI/hardAI";
import { Difficulty } from "../../models/difficulty";
import { RinkInfo } from "../../models/scenery/rink-info.interface";
import { GameComponent } from "../../models/game-component.interface";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IAngularInfo } from "../../services/game-handler/angular-info.interface";

/**
 * Handle the lifecyle of the states
 */
export class StatesHandler implements GameComponent {

    private static _statesHandler: StatesHandler;

    private _activeState: AbstractGameState;
    private _sharedStateInfo: IGameInfo;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        if (StatesHandler._statesHandler !== undefined) {
            throw new Error("An instance of the states handler has already been created.");
        }
        StatesHandler._statesHandler = new StatesHandler(gameServices, gameInfo, angularInfo);
    }

    public static getInstance() {
        if (StatesHandler._statesHandler === undefined) {
           throw new Error("The createInstance method must be called before getting the instance.");
        }
        return this._statesHandler;
    }

    /**
     * Initialize all the states. Because all the states cannot be instanciated more than once, this constructor
     * must only be called one time.
     */
    private constructor(gameServices: IGameServices, gameInfo: IGameInfo, angularInfo: IAngularInfo) {
        this._sharedStateInfo = gameInfo;
        ComputerShooting.createInstance(gameServices, gameInfo);
        ComputerTurn.createInstance(gameServices, gameInfo,
            this.createComputerAI(gameServices.userService.difficulty, gameInfo.rink));
        EndGame.createInstance(gameServices, gameInfo);
        EndSet.createInstance(gameServices, gameInfo);
        LoadingStone.createInstance(gameServices, gameInfo);
        PlayerTurn.createInstance(gameServices, gameInfo, angularInfo);
        PlayerShooting.createInstance(gameServices, gameInfo);
    }

    public startGame() {
        this._activeState = LoadingStone.getInstance();
        this._activeState.beginWithThisState(this.onStateChange.bind(this));
    }

    public stopGame() {
        this._activeState.forceExitState();
        this._sharedStateInfo.gameStatus.resetGameStatus();
    }

    private createComputerAI(difficulty: Difficulty, rinkInfo: RinkInfo): ComputerAI {
        let computerAI: ComputerAI;
        if (difficulty === Difficulty.NORMAL) {
            computerAI = new NormalAI(rinkInfo);
        } else if (difficulty === Difficulty.HARD) {
            computerAI = new HardAI(rinkInfo);
        }
        return computerAI;
    }

    private onStateChange(abstractGameState: AbstractGameState) {
        this._activeState = abstractGameState;
    }

    public update(timePerFrame: number) {
        this._activeState.update(timePerFrame);
    }

    public onSpacebarPressed() {
        this.informStateForEvent(this.informSpaceBarPressed);
    }

    public onSpinButtonPressed() {
        this.informStateForEvent(this.informSpinButtonPressed);
    }

    public onMouseButtonPressed() {
        this.informStateForEvent(this.informMouseButtonPressed);
    }

    public onMouseButtonReleased() {
        this.informStateForEvent(this.informMouseButtonReleased);
    }

    public onMouseMove(mouseEvent: MouseEvent) {
        this.informStateForEvent(this.informMouseMove.bind(this, mouseEvent));
    }

    private informStateForEvent(functionToCall: Function) {
        //Verify if there is an active state to inform for the event.
        if (this._activeState !== undefined) {
            functionToCall.call(this);
        }
    }

    private informSpaceBarPressed() {
        this._activeState.onSpaceBarPressed();
    }

    private informSpinButtonPressed() {
        this._activeState.onSpinButtonPressed();
    }

    private informMouseButtonPressed() {
        this._activeState.onMouseButtonPress();
    }

    private informMouseButtonReleased() {
        this._activeState.onMouseButtonReleased();
    }

    private informMouseMove(mouseEvent: MouseEvent) {
        this._activeState.onMouseMove(mouseEvent);
    }
}
