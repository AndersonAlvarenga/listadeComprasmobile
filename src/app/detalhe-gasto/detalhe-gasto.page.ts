import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../interface/item';
import { User } from '../interface/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-detalhe-gasto',
  templateUrl: './detalhe-gasto.page.html',
  styleUrls: ['./detalhe-gasto.page.scss'],
})
export class DetalheGastoPage implements OnInit {
  id: number;
  nomeRota: string;
  dataRota: Date;
  itemRota: Item;
  progressBar = true;
  user: User;
  aux: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  async ngOnInit() {
    this.activeRoute.params.subscribe(dado => {
      this.id = dado.id;
      this.nomeRota = dado.nome;
      this.dataRota = dado.data;
    })
    setTimeout(time => {
      this.setarItem();
      this.progressBar = false;
    }, 3000);

    this.aux = await this.userService.getById(this.id);
    this.user = this.aux;
  }

  setarItem() {
    this.user.gastosMensais.forEach(gasto => {
      gasto.listaItens.forEach(item => {
        if (item.data == this.dataRota && this.nomeRota == item.nome) {
          this.itemRota = item;
        }
      })
    })
  }
  formatarData(data) {
    let dado = data.toString();
    let dataResp = dado.split("T");
    let dataResp2 = dataResp[0].split("-")
    let resp = dataResp2[2] + "/" + dataResp2[1] + "/" + dataResp2[0];
    let hora = dataResp[1].split(":");
    resp += " " + hora[0] + ":" + hora[1];
    return resp;
  }
  formataReal(real) {
    let resp;
    let dado = real.toString();
    let primeiraParte = dado.split(".");
    let segundaParte;
    if (primeiraParte.length == 1) {
      resp = primeiraParte[0] + ",00"

    } else {
      segundaParte = primeiraParte[1].split("");
      if (segundaParte.length < 2) {
        resp = primeiraParte[0] + "," + segundaParte[0] + "0";
      } else {
        resp = primeiraParte[0] + "," + segundaParte[0] +segundaParte[1]
      }
    }
    return resp;
  }
}
