import { Injectable } from "@angular/core";

@Injectable()
export class UserSetting {
    private _name: string;
    private _difficulty: Difficulty;

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get difficulty(): Difficulty {
        return this._difficulty;
    }

    public set difficulty(value: Difficulty) {
        this._difficulty = value;
    }

    /**
     *
     */
    constructor() {
        this._name = "";
        this._difficulty = Difficulty.NORMAL;
    }
}

export enum Difficulty {
    NORMAL,
    HARD
}
