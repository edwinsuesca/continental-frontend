import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SocketWebService } from '../services/socket-web.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent {
  URI = "http://192.168.1.119:3200";
  gameId = "";
  author = false;
  playerId = "";
  players: { NICKNAME: string; TURNO: number; FK_AVATAR: number; }[] = [];

  constructor(
    private activatedRoute:ActivatedRoute,
    private clipboard:Clipboard,
    private socketWebService: SocketWebService,
    private api:ApiService,
    private router:Router){
    this.socketWebService.player.subscribe(res => {
      console.log(res);
      console.log("Sí devuleve");
      console.log(res.length, this.players.length);
      if(res.length !== this.players.length){
        this.players = res;
        this.playSound();
      }
    })

    this.socketWebService.gameStatus.subscribe(res => {
      if(res){
        this.router.navigate([`/room/${this.gameId}/${this.playerId}`]);
      }
    })
  }

  ngOnInit(): void {
    const gameId = this.activatedRoute.snapshot.paramMap.get('gameId');
    const playerId = this.activatedRoute.snapshot.paramMap.get('playerId');
    if(gameId && playerId){
      this.gameId = gameId;
      this.playerId = playerId;
      this.checkGameAvailable(gameId);
    } else{
      this.router.navigate(["/"]);
    }
  }

  checkGameAvailable = (gameId:string) => {
    this.api.checkGameAvailable(gameId).subscribe({
      next: (response) => {
        console.log(response);
        if(response.available){
          this.getAllPlayers(gameId);
          this.checkPlayerOnGame(gameId, this.playerId);
        } else{
          this.router.navigate(["/"]);
        }
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(["/"]);
      }
    })
  }

  checkPlayerOnGame = (gameId:string, playerId:string) => {
    this.api.checkPlayerOnGame(gameId, playerId).subscribe({
      next: (response) => {
        console.log(response);
        if(response.player){
          this.notifyPlayerUnion(true);
          this.author = response.player.CREADOR;
        } else{
          this.router.navigate(["/"]);
        }
      },
      error: (err) => {
        console.log(err);
        
        this.router.navigate(["/"]);
      }
    })
  }

  getAllPlayers = (gameId:string) => {
    this.api.getPlayersByGameId(gameId).subscribe({
      next: (response) => {
        if(response.players){
          this.players = response.players;
        }
        console.log(this.players);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  startGame(){
    if(this.players.length > 2){
      this.notifyGameStatus(true);
      this.router.navigate([`/room/${this.gameId}/${this.playerId}`]);
    }
  }

  copyText(option: string) {
    let textToCopy = `http://192.168.1.119:4200/new-player/${this.gameId}`;
    if(option === "code"){
      textToCopy = this.gameId
    }
    this.clipboard.copy(textToCopy);
  }

  notifyPlayerUnion = (novelty: boolean) => {
    this.socketWebService.notifyPlayerUnion(novelty);
  }

  notifyGameStatus = (status: boolean) => {
    this.socketWebService.notifyGameStatus(status);
  }

  playSound() {
    console.log("Es diferente");
    const audio = new Audio();
    audio.src = 'assets/sounds/newPlayer.mp3'; // Ruta relativa al archivo de sonido
    audio.load();
    audio.play();
  }
}
