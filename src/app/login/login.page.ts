import { Component, OnInit } from '@angular/core';
import { User } from '../interface/user';
import { Router } from '@angular/router';
import { UserCad } from '../interface/userCad';
import { LoginService } from '../service/login.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userCad: UserCad = {} as UserCad;
  user: User
  imagemLogo = "assets/icone.png";
  id: string;
  //user: User;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }
  cadastrar() {
    this.router.navigate(['cadastro']);
  }
  logar() {
    this.fireAuth.signInWithEmailAndPassword(this.userCad.email, this.userCad.senha)
      .then(async resp => {
        let aux: string[] = await this.loginService.logar(this.userCad);
        this.pegarId(aux);
      })
      .catch(error => {
        console.log(error.message)
      })
  }
  pegarId(lista) {
    lista.forEach(async id => {
      let aux: any = await this.loginService.getUserById(id);
      this.user = aux;
      if (this.user.email == this.userCad.email) {
        this.id = id;
        this.router.navigate(['tabs', { id: this.id }])
      }
    })

  }
}
