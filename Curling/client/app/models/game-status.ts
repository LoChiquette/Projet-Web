export class GameStatus{
    _scorePlayer: number = 0;
    _scoreComputer: number = 0;
    _currentSet: number = 0;
    _currentStonesPlayer: number = 8;
    _currentStonesComputer: number = 8;
    _isLaunched: boolean = false;

    public usedStonePlayer(): void {
        this._currentStonesPlayer = this._currentStonesPlayer - 1;
    }

    public usedStoneComputer(): void {
        this._currentStonesComputer = this._currentStonesComputer - 1;
    }

    public incrementScorePlayer(): void {
        this._scorePlayer = this._scorePlayer + 1;
    }

    public incrementScoreComputer(): void {
        this._scoreComputer = this._scoreComputer + 1;
    }

    public resetStones(): void {
        this._currentStonesComputer = 8;
        this._currentStonesPlayer = 8;
    }

    public lauchedGame(): void{
        this._isLaunched = true;
    }

    public resetGameStatus(): void{
        this._scorePlayer = 0;
        this._scoreComputer = 0;
        this._currentSet = 0;
        this._currentStonesPlayer = 8;
        this._currentStonesComputer = 8;
        this._isLaunched = false;
    }
}
