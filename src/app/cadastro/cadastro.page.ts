import { Component, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserCad } from '../interface/userCad';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { CadastroService } from '../service/cadastro.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  constructor(
    private FireAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router,
    private cadastroService: CadastroService
  ) { }
  user: UserCad = {} as UserCad;
  userDb: User = {} as User;
  verNome = null;
  verEmail = null;
  verSenha = null;
  verRepSenha = null;
  respCriaUsuario = null;
  ngOnInit(

  ) {
  }
  async cadastrar() {

    //verificar se os campos estão 
    if (this.user.nome == null) {
      this.verNome = "O campo nome de ser preenchido!";
    } else {
      this.verNome = null;
    }
    if (this.user.email == null) {
      this.verEmail = "O campo Email deve ser preenchido!";
    } else {
      this.verEmail = null;
    }
    if (this.user.senha == null) {
      this.verSenha = "O campo senha deve ser preenchido!";
    } else {
      this.verSenha = null;
    }
    if (this.user.repSenha == null) {
      this.verRepSenha = "O campo repetir senha deve ser preenchido!";
    } else {
      this.verEmail = null;
    }

    if (
      this.user.nome != null &&
      this.user.email != null &&
      this.user.repSenha != null &&
      this.user.senha != null) {

      this.userDb.nome = this.user.nome;
      this.userDb.email = this.user.email;

      if (this.user.senha == this.user.repSenha) {
        let resp = await this.cadastroService.insertUserDb(this.userDb, this.user.senha);
        //this.router.navigate(['tabs',{id:resp}]);
        this.router.navigate(['tabs', { id: resp }]);

      }


    }

  }
  voltarLogin() {
    this.router.navigate(['login']);
  }
}