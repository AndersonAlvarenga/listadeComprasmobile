import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  link = "https://lista-de-compras-53aec.firebaseio.com/user"
  json = ".json"
  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient
  ) { }
  async insert(obj) {
    return await this.db.database.ref("/user").push(obj)
      .then(resp => console.log("Dado inserido" + resp))
      .catch(error => console.log("Erro ao inserir dado" + error))
  }
  async alter(obj, id) {
    await this.db.database.ref("/user/" + id).update(obj)
      .then(resp => console.log(resp))
      .catch(error => console.log(error))
  }
  async getById(id) {
    return await this.http.get(this.link + "/" + id + this.json).toPromise();
  }
}
