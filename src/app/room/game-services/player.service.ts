import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  players = [];
  gameId = "";
  constructor(private api:ApiService, private router:Router) {}

  //GET DATA
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

  // SEND DATA
  assignCardToPlayer = (arr1: any[], n: number) => {
    const arr2: any[] = [];
    
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * arr1.length);
      const elemento = arr1.splice(randomIndex, 1)[0];
      arr2.push(elemento);
    }
    
    return {maso: arr1, hand: arr2};
  }
}
