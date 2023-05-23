import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketWebService } from '../services/socket-web.service';
import { ApiService } from '../services/api.service'
import { RoundsService } from './game-services/rounds.service';
import { PlayerService } from './game-services/player.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit{
  URI = "http://192.168.1.119:3200";
  author = false;
  players:any = [];
  gameId: string = "";
  playerId: string = "";
  currentRound = {
    ID_RONDA: 1,
    NUM_CARTAS: 3
  };
  progress = "0";
  rounds:any = [];
  me = {
    "ID_JUGADOR": "",
    "NICKNAME": "",
    "FK_PARTIDA": "",
    "CREADOR": false,
    "FK_AVATAR": 0,
    "ID_CLIENTE": null,
    "TURNO": null,
    "AVATAR": {
      "ID_AVATAR": 0,
      "IMAGEN": ""
    },
    "CARDS": []
  };

  //Estado del juego
  myCards = [];
  maso = [];
  discarded = [];
  board = [];

  gameProps = {
    num_jugadores: 1,
    num_barajas: 2,
    estado: true,
    id_creador: null,
    id_ronda: 1
  }

  constructor(
  private socketWebService: SocketWebService,
  private activatedRoute: ActivatedRoute,
  private router: Router,
  private api:ApiService,

  private roundsService:RoundsService,
  private playerService:PlayerService){
    this.socketWebService.player.subscribe(res => {
      console.log(res);
    })
  }
  ngOnInit(): void {
    const gameId = this.activatedRoute.snapshot.paramMap.get('gameId');
    const playerId = this.activatedRoute.snapshot.paramMap.get('playerId');
    if(gameId && playerId){
      this.gameId = gameId;
      this.playerId = playerId;
      this.checkPlayerOnGame(gameId, playerId);
    } else{
      this.router.navigate(["/"]);
    }
  }

  getGameById = (gameId:string) => {
    this.api.getGameById(gameId).subscribe({
      next: (response) => {
        console.log(response);
        if(response.ID_PARTIDA){
          this.gameProps = {
            num_jugadores: response.NUM_JUGADORES,
            num_barajas: response.NUM_BARAJAS,
            estado: response.ESTADO,
            id_creador: response.FK_CREADOR,
            id_ronda: response.FK_RONDA
          }
          this.currentRound = this.roundsService.getRound(this.gameProps.id_ronda)!;
          this.progress = this.roundsService.setProgress(this.gameProps.id_ronda)!;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  checkPlayerOnGame = (gameId:string, playerId:string) => {
    this.api.checkPlayerOnGame(gameId, playerId).subscribe({
      next: (response) => {
        console.log(response.player);
        if(response.player){
          this.me = response.player;
          this.author = response.player.CREADOR;
          this.getAvatarById(this.me, this.me.FK_AVATAR);
          this.getGameById(gameId);
          this.getAllPlayers(gameId);
          this.startGame()
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

  getAvatarById = (player:any, avatarId:number) =>{
    this.api.getAvatarById(avatarId).subscribe({
      next: (response) => {
        this.me.AVATAR = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  startGame = () => {
    this.players = this.playerService.players;
    let numBarajas = 2;
    if(this.players.length > 4){
      numBarajas = 3
    } 
    const props = {
      numBarajas: numBarajas,
      gameId: this.gameId
    }

    this.api.startGame(props).subscribe({
      next: (response) => {
        console.log(response);
/*         this.getAllPlayers(this.gameId);
        this.currentRound = this.roundsService.getRound(1)!;
        this.progress = this.roundsService.setProgress(1)!;
        const newPropsGame = {
          num_jugadores: this.players.length,
          num_barajas: numBarajas,
          estado: true,
          id_creador: this.playerId,
          id_ronda: this.currentRound.ID_RONDA
        }
        this.updateGame(newPropsGame, this.gameId); */
      },
      error: (err) => {
        console.log(err);
        //this.router.navigate(["/"]);
      }
    })
    //Establecer Ronda en 1 a la partida
    //repartir cartas
    //Mostrar popup qué juego debe armarse
    //Obtener id de usuario en posición 3(Si son sólo 3 jugadores) o 4(si son más de 4 jugadores)
  }


  updateGame = (props:any, gameId: string) => {
    this.api.updateGame(props, gameId).subscribe({
      next: (response) => {
      },
      error: (err) => {
        console.log(err);
        this.router.navigate(["/"]);
      }
    })
  }

  turnPlayer = () => {
    //Verificar si se ha bajado => No castigarse, no robar de discard
    //Verificar si puede castigarse

  }

  selectCardFromHand = () => {
    
  }

  //SOCKET ESCUCHAR Y ENVIAR UNIÓN DE JUGADORES

  notifyGameStatus = (novelty: boolean) => {
    this.socketWebService.notifyGameStatus(novelty);
  }

  playSound() {
    console.log("Es diferente");
    const audio = new Audio();
    audio.src = 'assets/sounds/newPlayer.mp3'; // Ruta relativa al archivo de sonido
    audio.load();
    audio.play();
  }
}