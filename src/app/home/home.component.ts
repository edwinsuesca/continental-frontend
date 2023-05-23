import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { SocketWebService } from '../services/socket-web.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  URI = "http://192.168.1.119:3200"
  gameId:string = "";
  gameNotFound = false;
  nickname:string = "";
  selectedAvatarId = 0;
  selectedAvatarImage = "";
  isAuthor = false;
  step = "new_game";
  playersOnGame!:any;
  avatars!:any;
  playerCreated = false;
  errorToCreatePlayer = "";
  constructor(
    private api: ApiService,
    private router:Router){}
  
  createGame = () => {
    this.api.createGame().subscribe({
      next: (response) => {
        if(response.id_partida){
          localStorage.setItem("gameId", response.id_partida);
          this.gameId = response.id_partida;
          this.router.navigate([`/new-player/${this.gameId}`])
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  joinToGame = (gameId:string) => {
    this.router.navigate([`/new-player/${gameId}`])
  }
}