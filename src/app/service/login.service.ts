import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { UserCad } from '../interface/userCad';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../interface/user';
import { UserLista } from '../interface/userList';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  link = "https://lista-de-compras-53aec.firebaseio.com/user";
  json = ".json"
  user: User;
  respFunction: string
  id: string[] = [];
  constructor(
    private fireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private http: HttpClient
  ) { }

  async logar(user: UserCad) {
    let aux: any = await this.http.get(this.link + this.json).toPromise();
    let cont = 0;
    let respFunction;
    let resp = Object.keys(aux).map(i => {
      this.id.push(i);
    })
    return this.id;
  }

  async verificarEmail(id, user) {
    this.id.forEach(id => {
      let aux: any = this.http.get(this.link + "/" + id + this.json).toPromise();
      this.user = aux;
      if (this.user.email == user.email) {
        this.respFunction = id;
        console.log(this.respFunction)
      }

    })
    return this.respFunction

  }
  async getUserById(id) {
    return await this.http.get(this.link + "/" + id + this.json).toPromise();
  }


}
