import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketWebService extends Socket{
  player: EventEmitter<any> = new EventEmitter();
  gameStatus: EventEmitter<any> = new EventEmitter();
  constructor() {
    const gameId = localStorage.getItem('gameId');
    const playerId = localStorage.getItem('playerId');
    console.log(playerId);
    super({
      url: 'http://192.168.1.119:5200/',
      options: {
        query: {
          gameId: gameId,
          playerId: playerId
        }
      }
    });
    this.setClientIdToPlayer();

    this.observeGameStatus();
    this.observePlayerUnion();
  }
  setClientIdToPlayer = () => {
    this.ioSocket.on('welcome', (data: string) => {
      console.log('Mensaje de bienvenida:', data);
    });
  }

  //Observar cambios
  observeGameStatus = () => {
    this.ioSocket.on('gameStatus', (res: any) => this.gameStatus.emit(res));   
  }

  observePlayerUnion = () => {
    this.ioSocket.on('player', (res: any) => this.player.emit(res));   
  }

  //Enviar cambios
  notifyGameStatus = (payload = {}) => {
    this.ioSocket.emit('gameStatus', payload)
  }

  notifyPlayerUnion = (payload = {}) => {
    this.ioSocket.emit('player', payload)
  }
}