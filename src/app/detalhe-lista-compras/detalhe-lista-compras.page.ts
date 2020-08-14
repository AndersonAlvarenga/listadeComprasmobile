import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';
import { User } from '../interface/user';
import { ListaCompras } from '../interface/lista';

@Component({
  selector: 'app-detalhe-lista-compras',
  templateUrl: './detalhe-lista-compras.page.html',
  styleUrls: ['./detalhe-lista-compras.page.scss'],
})
export class DetalheListaComprasPage implements OnInit {
  user: User;
  progress = true;
  aux: any;
  id: string;
  data: Date;
  lista: ListaCompras;
  constructor(
    private activeRouter: ActivatedRoute,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.activeRouter.params.subscribe(dado => {
      console.log(dado)
      this.id = dado.id;
      this.data = dado.data;
    })
    setTimeout(time => {
      this.setarLista();
      this.progress = false;
    }, 3000)
    this.aux = await this.userService.getById(this.id);
    this.user = this.aux;

  }
  setarLista() {
    this.user.gastosMensais.forEach(gasto => {
      gasto.listaCompras.forEach(lista => {
        if (lista.data == this.data) {
          this.lista = lista;
        }
      })
    })
  }
  transformarReal(valor) {
    let resp = ""

    let aux = valor.toString();

    let primeiraParte = aux.split(".");
    let segundaParte;

    if (primeiraParte.length == 1) {
      resp = primeiraParte[0] + ",00";
    } else {
      segundaParte = primeiraParte[1].split("");
      if (segundaParte.length == 1) {
        resp = primeiraParte[0] + "," + segundaParte[0] + "0";
      }
      if (segundaParte.length >= 2) {
        resp = primeiraParte[0] + "," + segundaParte[0] + segundaParte[1];
      }
    }


    return resp;
  }
  formataData(data) {
    //2020 - 08 - 01T11: 05: 16.361Z
    let date = data.toString();
    let dia = date.split("T");
    dia = dia[0].split("-")
    dia = dia[2] + "/" + dia[1] + "/" + dia[0];
    let hora = date.split("T");
    hora = hora[1].split(":");
    hora = hora[0] + ":" + hora[1]
    return dia + " " + hora;


  }

}
