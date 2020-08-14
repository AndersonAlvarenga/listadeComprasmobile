import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../interface/user';
import { UserService } from '../service/user.service';
import { ActionSheetController } from '@ionic/angular';
import { Gasto } from '../interface/gasto';
import { itemLista } from '../interface/itemLista';
import { Item } from '../interface/item';


@Component({
  selector: 'app-detalhe-gasto-mes',
  templateUrl: './detalhe-gasto-mes.page.html',
  styleUrls: ['./detalhe-gasto-mes.page.scss'],
})
export class DetalheGastoMesPage implements OnInit {
  id = "";
  mes = "";
  ano = "";
  user: User;
  aux: any;
  posicaoGasto: number;
  posicaoLista: number;
  posicaoListaCompra: number;
  arrayAux: any = [];
  alternancia = true;
  progress = true;
  percentual = [
    {
      "gasto": "Alimentação",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    },
    {
      "gasto": "Carro",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    },
    {
      "gasto": "Contas",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    },
    {
      "gasto": "Faculdade",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    },
    {
      "gasto": "Lazer",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    },
    {
      "gasto": "Outros",
      "valor": 0,
      "percentual": 0
      ,
      "porcentagem": 0
    },
    {
      "gasto": "Roupas",
      "valor": 0,
      "percentual": 0,
      "porcentagem": 0
    }
  ]
  constructor(
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private actionSheet: ActionSheetController,
    private router: Router
  ) { }

  async ngOnInit() {
    this.activeRoute.params.subscribe(dado => {
      this.id = dado.id;
      this.ano = dado.ano;
      this.mes = dado.mes;
    })

    setTimeout(tima => {
      this.pegarPosicao();
      this.setarPercetualGasto();
      this.progress = false;
    }, 3000);
    this.aux = await this.userService.getById(this.id);
    this.user = this.aux;
  }
  setarPercetualGasto() {
    this.user.gastosMensais[this.posicaoGasto].listaItens.forEach(item => {
      this.percentual.forEach(tipo => {
        if (tipo.gasto == item.tipo) {
          tipo.valor += item.precoTotal;
        }
      })
    })
    let valorTotal = 0;
    this.percentual.forEach(tipo => {
      if (tipo.gasto == "Alimentação") {
        this.user.gastosMensais[this.posicaoGasto].listaCompras.forEach(lista => {
          if (lista.item != null) {
            lista.item.forEach(item => {
              tipo.valor += item.precoTotal;
            })
          }

        })
        valorTotal += tipo.valor;

      } else {
        valorTotal += tipo.valor;
      }
    })

    this.percentual.forEach(tipo => {
      tipo.percentual = tipo.valor * 100 / valorTotal / 100;
      tipo.porcentagem = tipo.valor * 100 / valorTotal;
      //tipo.porcentagem = this.tranformarValor(tipo.valor * 100 / valorTotal);
      //tipo.valor = this.tranformarValor(tipo.valor);
    })
    this.ordenar()
  }
  tranformarValor(valor) {
    let aux = valor.toString();
    let primeiraCasa = aux.split(".")
    return parseInt(primeiraCasa[0]);
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

  ordenar() {
    let contador = 0;
    let contAux = null;
    let aux: any = null;
    this.percentual.forEach(tipo => {
      if (aux == null) {
        aux = tipo;
        contAux = contador;
      } else {
        if (tipo.valor > aux.valor) {
          aux = tipo;
          contAux = contador;
        }
      }
      contador += 1;
    })
    this.arrayAux.push(aux);
    this.percentual.splice(contAux, 1);
    if (this.percentual.length > 0) {
      this.ordenar();
    } else {
      this.percentual = this.arrayAux;
    }
  }
  pegarPosicao() {
    if (this.user.gastosMensais != null) {
      this.posicaoGasto = this.user.gastosMensais.length - 1;
      if (this.user.gastosMensais[this.posicaoGasto].listaItens != null) {
        this.posicaoLista = this.user.gastosMensais[this.posicaoGasto].listaItens.length - 1;
      }
      if (this.user.gastosMensais[this.posicaoGasto].listaCompras != null) {
        this.posicaoListaCompra = this.user.gastosMensais[this.posicaoGasto].listaCompras.length - 1;
      }
    }
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
  async subirMenu(nome: string, data: Date) {
    console.log("teste")
    const actionSheet = await this.actionSheet.create({
      header: '',
      buttons: [{
        text: 'Detalhar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.detalhar(nome, data);
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletar(nome, data);
        }
      }, {
        text: 'Editar',
        icon: 'construct',
        handler: () => {
          this.editar(nome, data);
        }
      }, {
        text: 'Cancelar',
        icon: 'close-circle',
        handler: () => {
        }

      }]
    });
    await actionSheet.present();
  }
  detalhar(nome: string, data: Date) {
    if (this.alternancia == true) {
      this.router.navigate(['detalhe-gasto', { id: this.id, nome, data }]);
    } else {
      this.router.navigate(['detalhe-lista-compras', { id: this.id, data }]);
    }

  }
  async deletar(nome, data) {
    let cont = 0;
    if (this.alternancia == true) {
      //lista de gasto
      if (this.user.gastosMensais[this.posicaoGasto].listaItens != null) {
        this.user.gastosMensais[this.posicaoGasto].listaItens.forEach(item => {
          if (item.nome == nome && data == item.data) {
            this.user.gastosMensais[this.posicaoGasto].listaItens.splice(cont, 1);
          }
          cont += 1;
        })
      }

    } else {
      //lista de compras 
      this.user.gastosMensais[this.posicaoGasto].listaCompras.forEach(lista => {
        if (nome == "" && data == lista.data) {
          this.user.gastosMensais[this.posicaoGasto].listaCompras.splice(cont, 1);
        }
        cont += 1;
      })
    }
    this.userService.alter(this.user, this.id);
    this.aux = this.userService.getById(this.id);
    this.user = this.aux;

  }
  editar(nome, data) {
    let alternancia = this.alternancia
    if (this.alternancia == true) {
      //caso seja lista de gastos
      this.router.navigate(['tabs', { id: this.id,nome, data, alternancia }, 'tab1', { id: this.id,nome, data, alternancia }])

    } else {
      //caso seja lista de compras
      this.user.gastosMensais.forEach(gasto => {
        
        gasto.listaCompras.forEach(lista => {
          if (nome == "" && data == lista.data) {
            lista.status = "Pendente";
            this.userService.alter(this.user, this.id);
            this.router.navigate(['tabs', { id: this.id, data, alternancia }, 'tab1', { id: this.id, data, alternancia }])
          }
        })
      })

    }
  }

}
