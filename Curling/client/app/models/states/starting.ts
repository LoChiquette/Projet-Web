import { AbstractGameState } from "./abstract-game-state";
import { LoadingStone } from "./loading-stone";
import { IGameServices } from "../../services/game-handler/games-services.interface";
import { IGameInfo } from "../../services/game-handler/game-info.interface";
import { ComputerTurn } from "../../models/states/computer-turn";
import { StatesHandler } from "../../services/game-handler/states-handler";

/**
 * This state is used to initialize the game. It resets all the services.
 */
export class Starting extends AbstractGameState {

    private static _instance: AbstractGameState = null;

    public static createInstance(gameServices: IGameServices, gameInfo: IGameInfo) {
        Starting._instance = new Starting(gameServices, gameInfo);
    }

    public static getInstance(): AbstractGameState {
        return Starting._instance;
    }

    private constructor(gameServices: IGameServices, gameInfo: IGameInfo) {
        super(gameServices, gameInfo);
    }

     protected performEnteringState(): void {
        this._gameServices.cameraService.stopPerspectiveCameraToFollowObjectOnZ();
        this._gameServices.cameraService.replacePCameraToInitialPosition();
        this._gameServices.cameraService.setPerspectiveCameraCurrent();
        this._gameServices.particlesService.removeParticulesFromScene();
        this._gameServices.stoneHandler.cleanAllStones();
        this._gameInfo.gameStatus.resetGameStatus();
        this._gameInfo.gameStatus.randomFirstPlayer();
        let computerAI = StatesHandler.getInstance().createComputerAI(this._gameServices.userService.difficulty,
            this._gameInfo.rink);
        (<ComputerTurn> ComputerTurn.getInstance()).computerAI = computerAI;
        this.leaveState(LoadingStone.getInstance());
    }
}
