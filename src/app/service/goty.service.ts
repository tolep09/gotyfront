import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GotyService {

  constructor(private httpClient: HttpClient) { }

  public getGames(): Observable<any> {
    return this.httpClient.get('http://localhost:9090/goty/getGames');
  }
}
