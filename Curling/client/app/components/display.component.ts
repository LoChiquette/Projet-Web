import { Component, OnInit, HostListener, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";

import { LeaderboardService } from "../services/leaderboard.service";
import { RestApiProxyService } from "../services/rest-api-proxy.service";
import { UserService } from "../services/user.service";
import { GameStatusService } from "../services/game-status.service";
import { RenderService } from "../services/game-handler/render.service";

@Component({
    moduleId: module.id,
    selector: "display-component",
    templateUrl: "../../assets/templates/display-component.html",
    styleUrls: [
        "../../assets/stylesheets/display-component.css",
        "../../assets/stylesheets/menu-hamburger.css",
        "../../assets/stylesheets/gl-component.css",
        "../../assets/stylesheets/leaderboard-component.css"
    ]
})
export class DisplayComponent implements OnInit {
    _userSettingService: UserService;
    _computerName: string;
    _textToShow: string;

    @ViewChild("hamburger") hamburger: ElementRef;
    @ViewChild("overlay") overlay: ElementRef;

    @HostListener("window:beforeunload")
    public async saveAndLogout() {
        await this.api.removeUsername(this._userSettingService.username);
        await this.api.createGameRecord(this._userSettingService.username,
            this._userSettingService.difficulty, this.gameStatusService);
    }

    @HostListener("window:resize", ["$event"])
    public resizeWindow(event: Event) {
        this.renderService.onResize();
    }

    @HostListener("window:keydown.space", ["$event"])
    public disableScrollingWithSpace(event: KeyboardEvent) {
        event.preventDefault();
    }

    @HostListener("window:keydown", ["$event"])
    public keyDown(event: KeyboardEvent) {
        this.renderService.switchSpin(event);
    }

    @HostListener("window:keyup.space", ["$event"])
    public spaceKeyPressed(event: KeyboardEvent) {
        this.renderService.switchCamera();
    }

    @HostListener("window:mousemove", ["$event"])
    public mouseMove(event: MouseEvent) {
        this.renderService.onMouseMove(event);
    }

    @HostListener("window:mousedown", ["$event"])
    public mouseDown(event: MouseEvent) {
        this.renderService.onMousePressed();
    }

    @HostListener("window:mouseup", ["$event"])
    public mouseUp(event: MouseEvent) {
        this.renderService.onMouseReleased();
    }

    constructor(
        private router: Router,
        private api: RestApiProxyService,
        private userService: UserService,
        public leaderboardService: LeaderboardService,
        public gameStatusService: GameStatusService,
        public renderService: RenderService) {
        this._textToShow = "Cliquez pour continuer.";
    }

    ngOnInit() {
        this.leaderboardService.fetchRecords();
        this._userSettingService = this.userService;
        if (this._userSettingService.username === "") {
            this.router.navigate(["/"]);
        } else {
            this.getComputerName();
            this.renderService.initAndStart();
        }
    }

    public toggleOverlay(event: MouseEvent): void {
        event.stopImmediatePropagation();
        this.hamburger.nativeElement.classList.toggle("is-active");
        this.overlay.nativeElement.classList.toggle("is-open-menu");
    }

    public getComputerName(): void {
        this._computerName = this.userService.getComputerName();
    }

    public gameOver(): void {
        this.api.createGameRecord(
            this._userSettingService.username,
            this._userSettingService.difficulty,
            this.gameStatusService);
        this.api.removeUsername(this._userSettingService.username);
        this.renderService.removeCanvasElement();
        this.renderService.stopGame();
        this.router.navigate(["/"]);
    }

    public restartGame() {
        this.api.createGameRecord(this._userSettingService.username,
            this._userSettingService.difficulty, this.gameStatusService);

        this.renderService.stopGame().then(() => {
            this.router.navigate(["/difficulty"]);
        });
    }

    public returnHomePage() {
        this.gameStatusService.resetGameStatus();
        this.renderService.stopGame().then(() => {
            this.router.navigate(["/user"]);
        });
        this.api.removeUsername(this._userSettingService.username);
    }

    public startNewGame() {
        this.gameStatusService.resetGameStatus();
        this.renderService.stopGame().then(() => {
            this.router.navigate(["/game"]);
            this.renderService.initAndStart();
        });
    }
}
