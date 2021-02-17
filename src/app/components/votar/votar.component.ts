import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../model/goty.model';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
@Component({
  selector: 'app-votar',
  templateUrl: './votar.component.html',
  styleUrls: ['./votar.component.css']
})
export class VotarComponent implements OnInit, OnDestroy {
  private stompClient: Client;
  games: Game[];

  constructor() { }
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
        }
      );

      // solicitar los votos
      this.stompClient.publish({destination: '/app/votes'});
    };


    this.stompClient.onDisconnect = (frame) => {
      this.games = [];
    };

    this.conectar();
  }

  public conectar(): void {
    this.stompClient.activate(); // conectarse
  }

  public desconectar(): void {
    this.stompClient.deactivate(); // desconectarse
  }

  public votar(game: Game): void {
    // enviar voto (objeto game) convertido a json string
    this.stompClient.publish({destination: '/app/vote', body: JSON.stringify(game) });
  }

}
