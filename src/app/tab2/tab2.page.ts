import { Component } from '@angular/core';
import { Gasto } from '../interface/gasto';
import { User } from '../interface/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  gastosMensais: Gasto;
  user: User
  id: string;
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }
  async ngOnInit() {
    let aux: any;
    this.activeRouter.params.subscribe(dado => {
      aux = dado.id;
      this.id = aux;

    })
    aux = await this.userService.getById(this.id);
    this.user = aux;
    aux = this.user.gastosMensais;
    this.gastosMensais = aux;
    this.setarValorTotal();
    this.user.gastosMensais.forEach(dado => {
      let valorTotal = 0;
      dado.listaItens.forEach(dado2 => {
        if (dado2 != null) {
          valorTotal += dado2.precoTotal;
        }
      })
      let aux: any = valorTotal;
      dado.status = aux;
    })

  }
  async ionViewWillEnter() {
    this.ngOnInit();
  }
  detalhe(mes, ano) {
    this.router.navigate(["detalhe-gasto-mes", { id: this.id, mes, ano }]);
  }
  setarValorTotal() {
    this.user.gastosMensais.forEach(gasto => {
      let valor = 0;
      if (gasto.listaItens != null) {
        gasto.listaItens.forEach(itemGasto => {
          valor += itemGasto.precoTotal;
        })
      }
      if (gasto.listaCompras != null) {
        gasto.listaCompras.forEach(itemLista => {
          if (itemLista.status == "Finalizado") {
            valor += itemLista.valorTota;
          }
        })
      }

      gasto.valorTotal = valor;
    })
    this.userService.alter(this.user, this.id);
  }
  formataData(real) {
    let valor = real.toString()
    let resp;
    let primeiraParte = valor.split(".");
    let segundaParte;
    if (primeiraParte.length == 1) {
      resp = primeiraParte[0] + ",00"
    } else {
      segundaParte = primeiraParte[1].split("");
      if (segundaParte.length == 1) {
        resp = primeiraParte[0] + "," + segundaParte[0] + "0";
      } else {
        resp = primeiraParte[0] + "," + segundaParte[0] + segundaParte[1];
      }
    }
    return resp;
  }
}
