import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../model/goty.model';

import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';


@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, OnDestroy {
  // sockets y atraccion de datos
  private stompClient: Client;
  private games: Game[];
  //

results: any[] /*= [
  { name: 'juego X', value: 12},
  { name: 'juego Y', value: 15},
  { name: 'juego Z', value: 30}
]*/;

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Games';
  showYAxisLabel = true;
  yAxisLabel = 'Votes';

  colorScheme = 'nightLights';

  constructor() {
    this.games = [];
  }
  ngOnDestroy(): void {
    this.desconectar();
  }

  ngOnInit(): void {
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => {
      return SockJS('http://localhost:8080/votes-websocket');
    };
    this.stompClient.onConnect = (frame) => {
      console.log('Conectado ' + this.stompClient.connected + ': ' + frame);

      // recibir los votos
      this.stompClient.subscribe(
        '/votes/actual/',
        (e: any) => {
          this.games = JSON.parse(e.body) as Game[];
          console.log(this.games);
          this.extractData();
        }
      );

      // solicitar los votos
      this.stompClient.publish({destination: '/app/votes'});
    };


    this.stompClient.onDisconnect = (frame) => {
      this.games = [];
      this.results = [];
    };

    this.conectar();
  }

  public conectar(): void {
    this.stompClient.activate(); // conectarse
  }

  public desconectar(): void {
    this.stompClient.deactivate(); // desconectarse
  }

  private extractData(): void {
    this.results = [];
    this.games.map(
      game => {
        this.results.push({name: game.name, value: game.votes});
      }
    );
  }
  onSelect(event) {
  }
}
