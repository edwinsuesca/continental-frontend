import { HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import { Injectable, Inject  } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  baseUrl:string = "http://192.168.1.119:3200/api";


  // CREAR PARTIDA
  createGame():Observable<any> {
    const url = `${this.baseUrl}/game`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, headers).pipe(map(response => {
      return response;
    }));
  }

  // CREAR PARTIDA
  createPlayer(player: { id_partida: string; nickname: string; id_avatar: number; creador: boolean; }):Observable<any> {
    const url = `${this.baseUrl}/player`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, player, headers).pipe(map(response => {
      return response;
    }));
  }

  // CONSULTAR AVATARS
  getAllAvatars():Observable<any> {
    const url = `${this.baseUrl}/avatars`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  checkGameAvailable(id:string):Observable<any> {
    const url = `${this.baseUrl}/game/available/${id}`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  checkPlayerOnGame(gameId:string, playerId:string):Observable<any> {
    const url = `${this.baseUrl}/player/available/${playerId}/${gameId}`;
    console.log(playerId);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  getGameById(id:string):Observable<any> {
    const url = `${this.baseUrl}/game/id/${id}`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  getAvatarById(id:number):Observable<any> {
    const url = `${this.baseUrl}/avatars/id/${id}`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  getPlayersByGameId(id:string):Observable<any> {
    const url = `${this.baseUrl}/player/gameId/${id}`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  getAllRounds():Observable<any> {
    const url = `${this.baseUrl}/rounds`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.get(url, headers).pipe(map(response => {
      return response;
    }));
  }

  updateGame(props:any, gameId:string):Observable<any> {
    const url = `${this.baseUrl}/game/id/${gameId}`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.put(url, props, headers).pipe(map(response => {
      return response;
    }));
  }

  //Start game
  startGame(props: { numBarajas: number; gameId: string; }):Observable<any> {
    const url = `${this.baseUrl}/game/start`;
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    return this.http.post(url, props, headers).pipe(map(response => {
      return response;
    }));
  }
}