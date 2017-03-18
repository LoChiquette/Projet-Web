import { Alphabet } from "./commons/alphabet";
import { AlphabetPoint } from "./commons/alphabet-point";

export class Letter {
    private _alphabetLetter: string;
    private _point: AlphabetPoint;
    private _quantity: number;
    private _imageSource: string;

    public get imageSource(): string {
        return this._imageSource;
    }

    public set imageSource(v: string) {
        this._imageSource = v;
    }

    public get alphabetLetter(): string {
        return this._alphabetLetter;
    }

    public set alphabetLetter(letter: string) {
        this._alphabetLetter = letter;
    }

    public get point(): AlphabetPoint {
        return this._point;
    }

    public set point(value: AlphabetPoint) {
        this._point = value;
    }

    public get quantity(): number {
        return this._quantity;
    }

    public set quantity(quantity: number) {
        this._quantity = quantity;
    }

    constructor(letter: string, point: AlphabetPoint, quantity: number) {
        this._alphabetLetter = letter;
        this._point = point;
        this._quantity = quantity;
        this._imageSource = "";
    }
}