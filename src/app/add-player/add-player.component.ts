import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit{
  URI = "http://192.168.1.119:3200"
  nickname:string = "";
  avatars!:any;
  selectedAvatarId = 0;
  errorToCreatePlayer = "";
  selectedAvatarImage = "";
  gameId:string = "";
  playersOnGame:any = [];
  gameNotFound = true;

  constructor(private api:ApiService, private activatedRouter:ActivatedRoute, private router:Router){}

  ngOnInit(): void {
    const gameId = this.activatedRouter.snapshot.paramMap.get('gameId');
    if(gameId && this.gameNotFound){
      this.gameId = gameId;
      this.checkGameAvailable(this.gameId);
    }
  }

  checkGameAvailable = (code:string) => {
    if(code){
      this.api.checkGameAvailable(code).subscribe({
        next: (response) => {
          if(response.available){
            this.getAllAvatars();
            localStorage.setItem("gameId", code);
            this.gameId = code;
            this.gameNotFound = false;
          } else{
            this.gameNotFound = true;
          }
        },
        error: (err) => {
          console.log(err);
          this.gameNotFound = true;
        }
      })
    }
  }

  selectAvatar = () => {
    if(!this.selectedAvatarId || !this.nickname){
      return;
    }
    const avatar = this.avatars.find((avatar:any) => avatar.ID_AVATAR === this.selectedAvatarId);
    if(avatar){
      this.selectedAvatarImage = avatar.IMAGEN;
      this.createPlayer(this.gameId);
    }
  }

  getAllAvatars = () => {
    this.api.getAllAvatars().subscribe({
      next: (response) => {
        this.avatars = response;
        this.getPlayersByGameId(this.gameId);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getPlayersByGameId = (gameId:string) =>{
    this.api.getPlayersByGameId(gameId).subscribe({
      next: (response) => {
        if(response.players){
          this.playersOnGame = response.players;
          this.avatars.forEach((avatar:any) => {
            this.playersOnGame.forEach((players:any) => {
              if (players.FK_AVATAR === avatar.ID_AVATAR) {
                avatar.BUSY = true;
              }
            });
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  createPlayer = (gameId:string) =>{
    const isAuthor = this.playersOnGame.length === 0 ? true : false;
    const player = {
      id_partida: gameId,
      nickname: this.nickname,
      id_avatar: this.selectedAvatarId,
      creador: isAuthor,
      turno: this.playersOnGame.length + 1
    }

    console.log(this.playersOnGame.length);

    this.api.createPlayer(player).subscribe({
      next: (response) => {
        console.log(response);
        if(response.player){
          localStorage.setItem("playerId", response.player.ID_JUGADOR);
          const playerId = response.player.ID_JUGADOR;
          this.router.navigate([`/waiting-room/${gameId}/${playerId}`]);
        }
      },
      error: (err) => {
        console.log(err);
        if(err.error.message){
          this.errorToCreatePlayer = err.error.message;
        } else {
          this.errorToCreatePlayer = "No hemos podido crear tu avatar. Intenta más tarde.";
        }
      }
    })
  }
}
