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
  mensagem: string;
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
    let cont = 0
    setInterval(time => {
      if (cont == 5) {
        this.mensagem = "Falha na conexão, verifique!"
        this.router.navigate([""]);
      }
      cont += 1;
    }, 1000)
    console.log(this.userCad.email)
    if (navigator.onLine == true) {
      if (this.userCad.email != null && this.userCad.senha != null) {
        this.fireAuth.signInWithEmailAndPassword(this.userCad.email, this.userCad.senha)
          .then(async resp => {
            let aux: string[] = await this.loginService.logar(this.userCad);
            this.pegarId(aux);
            cont =10
          })
          .catch(error => {
            console.log(error.message)
            this.mensagem = "Email ou senha inválidos!"
          })
      } else {
        //verificar qual esta vazio e printar na tela
        this.mensagem = "Os campos email e senha devem ser preenchidos!"
      }

    } else {
      this.mensagem = "Falha na conexão com a internet!"
    }

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
