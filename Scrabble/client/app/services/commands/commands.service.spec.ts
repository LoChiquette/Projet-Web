import { NO_ERRORS_SCHEMA, } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { RouterTestingModule, } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { GameRoomModule } from '../../modules/game-room.module';
import { GameStartModule } from '../../modules/game-start.module';
import {
    fakeAsync,
    inject,
    ComponentFixture,
    TestBed,
    async,
} from '@angular/core/testing';

import { expect, assert } from "chai";

import { EaselComponent } from "../../components/easel.component";
import { ChatroomComponent } from "../../components/chatroom.component";
import { GameComponent } from "../../components/game-room.component";
import { GameInitiationComponent } from "../../components/game-initiation.component";
import { BoardComponent } from "../../components/board.component";

import { ScrabbleLetter } from "../../models/letter/scrabble-letter";
import { Alphabet } from "../../models/letter/alphabet";
import { SocketEventType } from '../../commons/socket-eventType';

import { CommandStatus } from "./commons/command-status";
import { CommandType } from "./commons/command-type";
import { ICommandRequest } from "./commons/command-request";

import { MessageCommand } from '../../services/commands/message-command';
import { ChangeLettersCommand } from '../../services/commands/change-letters-command';
import { PlaceWordCommand } from '../../services/commands/place-word-command';
import { PassCommand } from '../../services/commands/pass-command';

import { SocketService } from "../../services/socket-service";
import { EaselManagerService } from "../easel/easel-manager.service";
import { CommandsService } from "../../services/commands/commands.service";

import { Observable } from "rxjs/Observable"

describe("CommandService", function () {

    let commandsService: CommandsService;
    let messageCommand: MessageCommand;
    let changeLettersCommand: ChangeLettersCommand;
    let placeWordCommand: PlaceWordCommand;
    let passCommand: PassCommand;

    let easelComponent: EaselComponent;
    let chatroomComponent: ChatroomComponent;
    let gameComponent: GameComponent;
    let boardComponent: BoardComponent;

    let fixtureEasel: ComponentFixture<EaselComponent>;
    let fixtureChatroom: ComponentFixture<ChatroomComponent>;
    let fixtureGame: ComponentFixture<GameComponent>;
    let fixtureBoard: ComponentFixture<BoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GameRoomModule, GameStartModule],
            declarations: [],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/game-room/test' },
                SocketService,
                EaselManagerService,
            ],

        })
            .compileComponents();
    }));

    beforeEach(() => {

        fixtureEasel = TestBed.createComponent(EaselComponent);
        easelComponent = fixtureEasel.componentInstance;

        console.log(easelComponent);
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterA));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterB));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterC));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterD));
        easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterE));
        // easelComponent.letters.push(new ScrabbleLetter(Alphabet.letterF));
        // easelComponent.letters.push(new ScrabbleLetter(Alphabet.blank));

        fixtureChatroom = TestBed.createComponent(ChatroomComponent);
        chatroomComponent = fixtureChatroom.componentInstance;

        fixtureGame = TestBed.createComponent(GameComponent);
        gameComponent = fixtureGame.componentInstance;

        fixtureBoard = TestBed.createComponent(BoardComponent);
        boardComponent = fixtureBoard.componentInstance;
    });

    it("extractCommandParameters, throw an exception when an input command is null", inject([EaselManagerService],
        fakeAsync((easelManagerService: EaselManagerService) => {
            commandsService = new CommandsService(easelManagerService);
            let verification = () => commandsService.extractCommandParameters(null);
            expect(verification).to.throw(Error);
        })));

    it("extractCommandParameters, should not be null", () => {
        expect(commandsService).to.not.be.undefined;
    });

    it("extractCommandParameters, throw an exception when an input command is empty", () => {
        let input = "";
        let verification = () => commandsService.extractCommandParameters(null);
        expect(verification).to.throw(Error);
    });

    it("extractCommandParameters, reconize the input to a new message", () => {
        let verification = commandsService.extractCommandParameters("fake message");
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("extractCommandParameters, reconize the input to add a new word", () => {
        let verification = commandsService.extractCommandParameters("!placer sfdg");
        expect(verification.commandType).to.be.equal(CommandType.PlaceCmd);
    });

    it("extractCommandParameters, reconize the input to exchange letters", () => {
        let verification = commandsService.extractCommandParameters("!changer fake");
        expect(verification.commandType).to.be.equal(CommandType.ExchangeCmd);
    });

    it("extractCommandParameters, reconize the input to let a player pass it's turn", () => {
        let verification = commandsService.extractCommandParameters("!passer");
        expect(verification.commandType).to.be.equal(CommandType.PassCmd);
    });

    it("extractCommandParameters, reconize the input to open help menu", () => {
        let verification = commandsService.extractCommandParameters("!aide");
        expect(verification.commandType).to.be.equal(CommandType.Guide);
    });

    it("extractCommandParameters, reconize an invalid command", () => {
        let input = "!";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.InvalidCmd);
    });

    it("extractCommandParameters, reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("extractCommandParameters, reconize the input of a valid message when it's not empty", () => {
        let input = "Hello World";
        let verification = commandsService.extractCommandParameters(input);
        expect(verification.commandType).to.be.equal(CommandType.MessageCmd);
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a null chatroomComponent", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(null, "fake message");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, "");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteMessageCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteMessageCommand, should invoke the ExchangeLettersCommand without error", () => {
        let wrapper = () => commandsService.invokeAndExecuteMessageCommand(chatroomComponent, "abcd");
        expect(wrapper()).to.not.throw;
    });

    it("invokeAndExecuteExchangeCommand, should throw a null argument error with a null easelComponent", () => {
        let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(null, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteExchangeCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(easelComponent, "");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteExchangeCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(easelComponent, null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecuteExchangeCommand, should invoke the ExchangeLettersCommand without error", () => {
        let wrapper = () => commandsService.invokeAndExecuteExchangeCommand(easelComponent, "abcd");
        expect(wrapper()).to.not.throw;
    });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a null easelComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(null, boardComponent, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a null boardComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, null, "abcd");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, boardComponent, "");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePlaceCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, boardComponent, null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePlaceCommand, should invoke the ExchangeLettersCommand without error", () => {
        let wrapper = () => commandsService.invokeAndExecutePlaceCommand(easelComponent, boardComponent, "abcd");
        expect(wrapper()).to.not.throw;
    });

    it("invokeAndExecutePassCommand, should throw a null argument error with a null gameComponent", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(null, "fake message");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePassCommand, should throw a null argument error with a empty letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(gameComponent, "");
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePassCommand, should throw a null argument error with a null letters", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(gameComponent, null);
        expect(wrapper).throw(Error, "Null argument error: the parameters cannot be null");
    });

    it("invokeAndExecutePassCommand, should invoke the ExchangeLettersCommand without error", () => {
        let wrapper = () => commandsService.invokeAndExecutePassCommand(gameComponent, "abcd");
        expect(wrapper()).to.not.throw;
    });

});
