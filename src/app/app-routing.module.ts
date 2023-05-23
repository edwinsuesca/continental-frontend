import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { HomeComponent } from './home/home.component';
import { AddPlayerComponent } from './add-player/add-player.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';

const routes: Routes = [
  {
    path:'',
    component: HomeComponent
  },
  {
    path:'room/:gameId/:playerId',
    component: RoomComponent
  },
  {
    path:'waiting-room/:gameId/:playerId',
    component: WaitingRoomComponent
  },
  {
    path:'new-player/:gameId',
    component: AddPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
