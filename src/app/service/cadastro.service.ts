import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  constructor(
    private db: AngularFireDatabase,
    private http: HttpClient,
    private FireAuth: AngularFireAuth
  ) { }

  async insertUserDb(user: User,senha:string) {
    let resposta;
    await this.db.database.ref('/user').push(user)
      .then(resp => {
        resposta = resp;
        this.criarUserAuth(user.email,senha);
      })
      .catch(error => resposta = error)
    return resposta.path.pieces_[1]
  }
  async criarUserAuth(email: string, senha: string) {
    return await this.FireAuth.createUserWithEmailAndPassword(email, senha)
      .then(resp => {
        console.log(resp);
      })
      .catch(error => console.log(error));
  }
}
