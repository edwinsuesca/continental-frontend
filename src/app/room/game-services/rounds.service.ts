import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class RoundsService {
  rounds = [];
  constructor(private api:ApiService, private router:Router) {
    this.getAllRounds();
  }

  // GET DATA
  getAllRounds = () => {
    this.api.getAllRounds().subscribe({
      next: (response) => {
        this.rounds = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // SEND DATA
  getRound = (roundId:number) => {
    const round = this.rounds.find((round:any) => round.ID_RONDA === roundId);
    return round;
  }

  setProgress = (roundId:number) => {
    return `${roundId * 10}%`;
  }
}
