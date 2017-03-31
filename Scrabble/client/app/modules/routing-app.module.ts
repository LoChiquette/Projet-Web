import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GameInitiationComponent } from "./../components/game-initiation.component";
import { GameComponent } from "./../components/game-room.component";
import { WaitingRoomComponent } from "./../components/waiting-room.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "/game-start", pathMatch: "full" },
  { path: "game-start", component: GameInitiationComponent },
  { path: "game-room/:id", component: GameComponent, data: { id: "" } },
  { path: "waiting-room/:id", component: WaitingRoomComponent, data: { id: "", missingPlayers: "" } }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class RouteModule { }
