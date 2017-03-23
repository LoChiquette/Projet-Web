import { expect, assert } from "chai";
import { ExceptionHelper } from "../commons/exception-helper";

describe("ExceptionHelper", () => {

    it("should throw a null argument exception", () => {
        let wrapper = () => ExceptionHelper.throwNullArgumentException(null);
        expect(wrapper).throw("Null argument exception: the parameter cannot be null")
    });

    it("should not throw a null argument exception", () => {
        let wrapper = () => ExceptionHelper.throwNullArgumentException("not null param");
        expect(wrapper).not.throw("Null argument exception: the parameter cannot be null")
    });

    it("should not throw an out of range exception", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = (Math.random() * (maxValue - minValue)) + minValue;
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);
        expect(wrapper).not.throw;
    });

    it("should throw an out of range exception if greater than the max value", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = (Math.random() * (30)) + (maxValue + 10);
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);

        expect(wrapper).throw("Out of range exception: the parameter cannot be greater than")
    });

    it("should throw an out of range exception", () => {
        let minValue = 1;
        let maxValue = 15;
        let param = 0;
        let wrapper = () => ExceptionHelper.throwOutOfRangeException(minValue, maxValue, param);

        expect(wrapper).throw("Out of range exception: the parameter cannot be less than" + " " + minValue)
    });
})