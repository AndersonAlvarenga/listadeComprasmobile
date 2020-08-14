import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../interface/item';
import { User } from '../interface/user';
import { Gasto } from '../interface/gasto';
import { itemLista } from '../interface/itemLista';
import { ListaCompras } from '../interface/lista';
import { ActionSheetController } from '@ionic/angular';
import { ThrowStmt } from '@angular/compiler';




@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  item: Item = {} as Item;
  user: User;
  id: string;
  posicaoGasto: number;
  posicaoLista: number;
  progress = true;
  alternancia = true;
  itemLista: itemLista = {} as itemLista;
  lista: ListaCompras = {} as ListaCompras;
  gasto: Gasto = {} as Gasto;
  aux: any = [{}];
  listaCarregada = false;
  posicaoListaCompras = 0;
  salvae = true;
  valorBotao = "Adicionar";
  contadorEditar: number;
  valorLista = "0";
  botaoAddLista = "Adicionar";
  itemAux: itemLista;
  nomeRota: string;
  dataRota: Date;
  verRota: string;
  constructor(
    private userService: UserService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private actionSheet: ActionSheetController
  ) { }
  async ionViewWillEnter() {
    this.progress = true;
    let aux;
    this.activeRouter.params.subscribe(dado => {
      this.id = dado.id;
      this.nomeRota = dado.nome;
      this.dataRota = dado.data;
      this.verRota = dado.alternancia;
    })
    setTimeout(time => {
      this.pegarValor();
      this.progress = false;
      this.setarPosicaoCompras();
      this.listaCarregada = true;
      this.setarValorListaCompras()
    }, 3000);
    aux = await this.userService.getById(this.id);
    this.user = aux;
    if (this.verRota == "true") {
      this.editarRota();
    } else {
      if (this.verRota == "false") {
        this.alternancia = false;
      }
    }
  }
  ngOnInit() {
    this.ionViewWillEnter();
  }
  editarRota() {
    this.user.gastosMensais.forEach(gasto => {
      gasto.listaItens.forEach(item => {
        if (item.data == this.dataRota && item.nome && this.nomeRota) {
          this.editar(item);
        }
      })
    })
  }
  enviarLista() {
    this.criarLista();
  }
  pegarValor() {
    this.posicaoGasto = this.user.gastosMensais.length - 1;
    this.posicaoLista = this.user.gastosMensais[this.posicaoGasto].listaCompras.length - 1;
  }
  criarLista() {
    this.router.navigate(['lista-de-compras', { id: this.id }])
  }
  async subirMenu(item: Item) {
    const actionSheet = await this.actionSheet.create({
      header: 'Deletar',
      buttons: [
        {
          text: 'Detalhe',
          role: 'destructive',
          icon: 'search',
          handler: () => {
            let nome = item.nome;
            let data = item.data;
            this.detalhar(nome, data);
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deletar(item);
          }
        }, {
          text: 'Editar',
          icon: 'construct',
          handler: () => {
            this.editar(item);
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

    this.router.navigate(['detalhe-gasto', { id: this.id, nome, data }])
  }
  deletar(item: Item) {
    let contador = 0;
    let aux;
    this.user.gastosMensais[this.posicaoGasto].listaItens.forEach(iten => {
      if (item == iten) {
        aux = contador;
      }
      contador += 1;
    })
    if (aux != null) {
      this.user.gastosMensais[this.posicaoGasto].listaItens.splice(aux, 1);
    }
    this.userService.alter(this.user, this.id);
  }
  editar(item: Item) {
    this.botaoAddLista = "Editar";
    this.item = item;
    this.itemAux = item;

  }
  async adicionar() {//pega o usuario e adicionar
    if (this.botaoAddLista == "Editar") {
      this.user.gastosMensais[this.posicaoGasto].listaItens.forEach(itemLista => {
        if (this.itemAux == itemLista) {
          itemLista = this.item;
        }
      })
      this.userService.alter(this.user, this.id);
    } else {
      let aux: any = await this.userService.getById(this.id);
      this.user = aux;
      if (this.user.gastosMensais != null) {

        let verificador = false;
        this.user.gastosMensais.forEach(dado => {
          if (dado.mes == (new Date().getUTCMonth() + 1) && dado.ano == new Date().getUTCFullYear()) {
            //caso ja tenha um mes
            console.log("Tenho o mes criado")
            if (dado.listaItens != null) {
              aux = [];
              //dado.listaItens = aux;
              dado.listaItens.push(this.criarGasto());
              console.log(dado)
              this.userService.alter(this.user, this.id);
              verificador = true;
              console.log(this.user.gastosMensais.length)
            } else {
              aux = [];
              dado.listaItens = aux;
              dado.listaItens.push(this.criarGasto());
              console.log(dado)
              this.userService.alter(this.user, this.id);
              verificador = true;
              console.log(this.user.gastosMensais.length)
            }

          }
        })
        if (verificador == false) {
          let contador = this.user.gastosMensais.length;
          let gasto: Gasto = {} as Gasto;
          gasto.ano = new Date().getFullYear();
          gasto.mes = new Date().getUTCMonth() + 1;
          aux = [];
          gasto.listaItens = aux;
          gasto.listaItens.push(this.criarGasto())
          this.user.gastosMensais.push(gasto);
          this.userService.alter(this.user, this.id);

        }
      } else {
        console.log("array vazio")
        aux = [{}]
        this.user.gastosMensais = aux
        this.item = this.criarGasto();
        this.user.gastosMensais[0].ano = new Date().getUTCFullYear();
        aux = (new Date().getUTCMonth()) + 1;
        this.user.gastosMensais[0].mes = aux;
        aux = []
        this.user.gastosMensais[0].listaItens = aux;
        this.user.gastosMensais[0].listaItens.push(this.item);
        let resp = await this.userService.alter(this.user, this.id);
        console.log(resp)
      }
    }
    this.limpar();
    this.ngOnInit();
  }
  limpar() {
    this.item.nome = "";
    this.item.tipo = "";
    this.item.quantidade = null;
    this.item.precoUni = null;
  }
  criarGasto() {
    this.item.data = new Date();
    this.item.precoTotal = this.item.precoUni * this.item.quantidade;
    return this.item;
  }
  async subirMenuCompras(nome: string) {
    const actionSheet = await this.actionSheet.create({
      header: 'Deletar',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletarCompras(nome);
        }
      }, {
        text: 'Editar',
        icon: 'construct',
        handler: () => {
          this.editarCompras(nome);
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
  editarCompras(nome) {
    this.salvae = false;
    this.valorBotao = "Editar";
    let cont = 0
    this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item.forEach(item => {
      if (item.nome == nome) {
        this.itemLista = item;
        this.contadorEditar = cont;
      }
      cont += 1;
    })

  }
  deletarCompras(nome) {
    let cont = 0;
    this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item.forEach(item => {
      if (item.nome == nome) {
        let resp = this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item.splice(cont, 1);
        this.userService.alter(this.user, this.id);
      }
      cont += 1;
    })
    this.ngOnInit();
  }

  async adicionarCompras() {
    if (this.salvae == true) {
      //caso esteja salvado
      let aux: any;
      //this.item.precoTotal = 0;
      //this.item.precoUni = 0;
      if (this.user.gastosMensais == null) {

        //criar um gasto mensal e começar a adicionar

        let respLista = this.criarListaCompras();
        let respGasto = this.criaGastoCompras(respLista)
        this.aux = [];
        this.user.gastosMensais = this.aux;
        this.user.gastosMensais[0] = respGasto;
        this.userService.alter(this.user, this.id);
      } else {

        //ja tem o gasto mensal criado verificar se o mes eta aberto
        let verificador = true;
        this.user.gastosMensais.forEach(gasto => {
          if (gasto.mes == new Date().getUTCMonth() + 1 && gasto.ano == new Date().getUTCFullYear()) {
            //acho o mes
            verificador = false;
            if (gasto.listaCompras != null) {
              //se ja tem a lista criado,verificar se tem alguma pendente
              let verificadorLista = false;
              gasto.listaCompras.forEach(lista => {
                if (lista.status == "Pendente") {
                  //acho lista pendente
                  if (lista.item != null) {
                    verificadorLista = true;
                    this.itemLista.precoTotal = this.setarPrecoTotalProdutoCompras(this.itemLista);
                    lista.item.push(this.itemLista);
                    lista.valorTota += this.pegarValorTotalListaCompras(lista)
                    this.userService.alter(this.user, this.id);
                  } else {
                    verificadorLista = true;
                    aux = []
                    lista.item = aux;
                    this.itemLista.precoTotal = this.setarPrecoTotalProdutoCompras(this.itemLista);
                    lista.item.push(this.itemLista);
                    lista.valorTota = this.pegarValorTotalListaCompras(lista);
                    this.userService.alter(this.user, this.id);
                  }
                }
              })
              if (verificadorLista == false) {
                gasto.listaCompras.push(this.criarListaCompras());
                this.userService.alter(this.user, this.id);
              }
            } else {
              //nao tem listaCriado, criar lista e adicionar o produto
              this.aux = []
              gasto.listaCompras = this.aux;
              gasto.listaCompras[0] = this.criarListaCompras();
              gasto.listaCompras[0].valorTota = this.pegarValorTotalListaCompras(gasto.listaCompras[0]);
              this.userService.alter(this.user, this.id);
            }
          }
        })
        if (verificador == true) {
          //não localizou o mes, criar novo mes  
          this.user.gastosMensais.push(this.criaGastoCompras(this.criarListaCompras()));
          let valor = this.user.gastosMensais.length - 1;
          this.user.gastosMensais[valor].valorTotal = this.pegarValorTotalListaCompras(this.user.gastosMensais[valor].listaCompras[0])
          this.userService.alter(this.user, this.id);
        }
      }
    } else {
      //caso esteja Editando
      this.itemLista.precoTotal = this.setarPrecoTotalProdutoCompras(this.itemLista)
      this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item[this.contadorEditar] = this.itemLista;
      this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item[this.contadorEditar].precoTotal = this.pegarValorTotalListaCompras(this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras]);
      this.userService.alter(this.user, this.id);
    }
    this.listaCarregada = false;
    setTimeout(time => {
      this.listaCarregada = true;
    }, 3000);
    
    this.salvae = true;

    this.contadorEditar = null;
    this.valorBotao = "Adicionar";
    this.limparCompras();
    this.ngOnInit();

  }
  setarPrecoTotalProdutoCompras(item: itemLista) {
    let valor = 0;
    if (item.precoUni == null) {
      item.precoUni = 0;
    }
    valor = item.quantidade * item.precoUni;
    return valor;
  }
  pegarValorTotalListaCompras(lista: ListaCompras) {
    let soma = 0;
    lista.item.forEach(item => {
      soma += item.precoTotal;
    })
    return soma;
  }
  criarListaCompras() {
    this.lista.status = "Pendente";
    this.lista.data = new Date();
    this.aux = []
    this.lista.item = this.aux;
    this.itemLista.precoTotal = this.setarPrecoTotalProdutoCompras(this.itemLista);
    this.lista.valorTota = this.pegarValorTotalListaCompras(this.lista);
    this.lista.item.push(this.itemLista);
    return this.lista;
  }
  criaGastoCompras(lista: ListaCompras) {
    this.aux = [];
    this.gasto.mes = new Date().getUTCMonth() + 1;
    this.gasto.ano = new Date().getFullYear();
    this.gasto.listaCompras = this.aux;
    this.gasto.listaCompras[0] = lista;
    return this.gasto;
  }
  limparCompras() {
    this.itemLista.nome = "";
    this.itemLista.precoUni = null;
    this.itemLista.quantidade = null;
    this.itemLista.tipo = "";
  }
  setarPosicaoCompras() {
    this.posicaoGasto = this.user.gastosMensais.length - 1;
    if (this.user.gastosMensais[this.posicaoGasto].listaCompras != null) {
      this.posicaoListaCompras = this.user.gastosMensais[this.posicaoGasto].listaCompras.length - 1;
    }

  }
  setarValorListaCompras() {

    let soma = 0;

    if (this.user.gastosMensais != null) {
      if (this.user.gastosMensais[this.posicaoGasto].listaCompras != null) {
        if (this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item != null) {
          this.user.gastosMensais[this.posicaoGasto].listaCompras[this.posicaoListaCompras].item.forEach(item => {
            if (item.precoUni) {
              soma += item.precoUni * item.quantidade;
            }
          })
        }
      }
    }
    this.valorLista = soma.toString();
    let resp: string[] = this.valorLista.split(".");
    if (resp.length == 1) {
      this.valorLista = resp[0] + ",00"
    } else {
      let resp2: string[] = resp[1].split("");
      if (resp2.length < 2) {
        this.valorLista = resp[0] + "," + resp2[0] + "0";
      } else {
        this.valorLista = resp[0] + "," + resp2[0] + resp2[1];
      }

    }

  }
  transformarReal(valor) {
    let string = valor.toString();
    let primeiraParte = string.split(".");
    let resp;
    let segunda;
    if (primeiraParte.length == 1) {
      resp = primeiraParte[0] + ",00";
    } else {
      segunda = primeiraParte[1].split("");
      if (segunda.length < 2) {
        resp = primeiraParte[0] + "," + segunda[0] + "0";
      } else {
        resp = primeiraParte[0] + "," + segunda[0] + segunda[1];
      }
    }
    return resp;
  }
  retornaData(data) {
    let string = data.toString();
    let resp = string.split("T");
    resp = resp[0].split("-");
    resp = resp[2] + "/" + resp[1] + "/" + resp[0];
    return resp;
  }
  finalizarListaCompras(listaResp: ListaCompras) {
    let itemMaioZero = true;
    let valor = 0;
    this.user.gastosMensais[this.posicaoGasto].listaCompras.forEach(lista => {
      if (lista == listaResp) {
        if (lista.item != null) {
          lista.item.forEach(item => {
            if (item.precoTotal == 0) {
              itemMaioZero = false;
            }
          })
          if (itemMaioZero == true) {

            lista.item.forEach(item => {
              valor += item.precoTotal;
            })
            lista.status = "Finalizado";
            lista.valorTota = valor;
            this.userService.alter(this.user, this.id);

          }
          else {
            alert("Existe item sem preço da unidade na lista, adicione um valor ou exclua o item!");
          }
        } else {
          alert("Sua lista esta vazia, impossivel finalizar");
        }
      }
    })
  }

}
