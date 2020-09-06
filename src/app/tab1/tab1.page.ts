import { Component } from '@angular/core';
import { itemLista } from '../interface/itemLista';
import { User } from '../interface/user';
import { Item } from '../interface/item';
import { UserService } from '../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaCompras } from '../interface/lista';
import { Gasto } from '../interface/gasto';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { IfStmt } from '@angular/compiler';





@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  alternancia = true;
  item: Item = {} as Item;
  progress = true;
  user: User;
  listaCarregada = false;
  itemLista: itemLista = {} as itemLista
  aux: any;
  id: number;
  nomeRota: string;
  dataRota: Date;
  posicaoGasto: number;
  posicaoGastoCompra: number;
  posicaoLista: number;
  posicaoListaCompras: number;
  itemGastoAux: Item;
  itemListaAux: itemLista;
  botao = "Adicionar"
  posicaoGastoAux: number;
  posicaoListaAux: number;
  posicaoItemAux: number;
  valorLista: number;
  constructor(
    private userService: UserService,
    private activeRouter: ActivatedRoute,
    private actionSheet: ActionSheetController,
    private router: Router,
    private toast: ToastController
  ) { }
  async ionViewWillEnter() {
    this.alternancia = true;
    this.progress = true;
    this.activeRouter.params.subscribe(dado => {
      this.id = dado.id;
      if (dado.nome != null) {
        this.nomeRota = dado.nome;
      }
      if (dado.data != null) {
        this.dataRota = dado.data;
      }
      if (dado.alternancia != null) {
        if (dado.alternancia == "true") {
          this.alternancia = true
        }
        else {
          this.alternancia = false;
        }

      }
    })
    this.carregarUser();
  }
  ngOnInit() {

  }
  verificarConexao() {
    let resp: boolean;
    if (navigator.onLine == true) {
      //conectado
      resp = true;
    } else {
      //sem conexão
      resp = false;
    }
    return resp;
  }
  async carregarUser() {
    let mensagem = "";
    if (this.verificarConexao() == true) {
      await this.userService.getById(this.id)
        .then(resp => {
          this.aux = resp;
          this.user = this.aux;
          this.setarValorlista();
          this.progress = false;
          this.setarPosicao()
        })
        .catch(error => {
          //fazer metodo que caso nao carregue o usuario exiba erro ao usuario de falha na conexão
        });
    } else {
      this.progress = false;
      this.presentToast("Falha na conexão");
    }

  }
  async adicionar() {
    let mensagem = "";
    this.aux = [];
    if (this.alternancia == true) {
      //adcionar gasto
      if (this.botao == "Adicionar") {
        //Adicionar
        if (this.user.gastosMensais == null) {
          //não tem lista de gastos criada
          this.aux = [];
          this.user.gastosMensais = this.aux;
          this.user.gastosMensais[0] = this.criarGasto();
          this.user.gastosMensais[0].listaItens = this.aux;
          this.user.gastosMensais[0].listaItens[0] = this.itemGasto();
        } else {
          //tem lista de gastos criada
          let posicao = this.user.gastosMensais.length - 1;
          if (this.user.gastosMensais[posicao].mes == (new Date().getUTCMonth() + 1) && this.user.gastosMensais[posicao].ano == new Date().getUTCFullYear()) {
            //estou no mesmo mes
            if (this.user.gastosMensais[posicao].listaItens == null) {
              //nao tem lista de compras criada
              this.user.gastosMensais[posicao].listaItens = this.aux;
              this.user.gastosMensais[posicao].listaItens[0] = this.itemGasto();
            } else {
              //possui lista criada
              this.user.gastosMensais[posicao].listaItens.push(this.itemGasto());
            }
          } else {
            //tem que criar um novo gasto
            this.user.gastosMensais.push(this.criarGasto());
            this.user.gastosMensais[posicao + 1].listaItens = this.aux;
            this.user.gastosMensais[posicao + 1].listaItens[0] = this.itemGasto();
            console.log("crio um novo gasto")
            console.log(this.user)
          }

        }
        mensagem = "Gasto adicionado!";
      } else {
        //Editar gasto
        this.user.gastosMensais[this.posicaoGastoAux].listaItens[this.posicaoListaAux] = this.item;
        mensagem = "Dado editado!"

      }

    } else {
      //adicionar lista de compras
      if (this.user.gastosMensais == null) {
        // nao temos gasto criado
        this.user.gastosMensais = this.aux;
        this.user.gastosMensais[0] = this.criarGasto();
        this.user.gastosMensais[0].listaCompras[0] = this.criarListaDeCompras();
        this.user.gastosMensais[0].listaCompras[0].item = this.aux;
        this.user.gastosMensais[0].listaCompras[0].item[0] = this.setarItemLista();
        mensagem = "Item adicionado a lista de compras!"
      } else {
        //temos o gasto criado
        if (this.botao == "Adicionar") {
          if (this.posicaoGastoCompra == null) {
            this.posicaoGastoCompra = this.user.gastosMensais.length - 1;
          }
          if (this.user.gastosMensais[this.posicaoGastoCompra].ano == new Date().getUTCFullYear() && this.user.gastosMensais[this.posicaoGastoCompra].mes == (new Date().getUTCMonth() + 1)) {
            if (this.user.gastosMensais[this.posicaoGastoCompra].listaCompras == null) {
              //não tem lista de compras criada
              this.user.gastosMensais[this.posicaoGastoCompra].listaCompras = this.aux;
              this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[0] = this.criarListaDeCompras();
              this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[0].item = this.aux;
              this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[0].item[0] = this.setarItemLista();
              mensagem = "Item adicionado a lista de compras!";
            }
            else {
              //tem lista de compra criada
              if (this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[this.posicaoListaCompras].status == "Pendente") {
                if (this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[this.posicaoListaCompras].item == null) {
                  //nao tem lista de item criado
                  this.aux = [];
                  this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[this.posicaoListaCompras].item = this.aux;
                  this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[this.posicaoListaCompras].item[0] = this.setarItemLista();
                  mensagem = "Item Adicionado a lista de compras!"
                } else {
                  //tem lista de item criada
                  this.user.gastosMensais[this.posicaoGastoCompra].listaCompras[this.posicaoListaCompras].item.push(this.setarItemLista());
                  mensagem = "Item Adicionado a lista de compras!";
                }
              } else {
                this.aux = [];
                this.user.gastosMensais[this.posicaoGastoCompra].listaCompras.push(this.criarListaDeCompras());
                this.posicaoListaCompras = this.user.gastosMensais[this.posicaoGastoCompra].listaCompras.length - 1;

                this.user.gastosMensais[this.posicaoListaCompras].listaCompras[this.posicaoListaCompras].item[0] = this.setarItemLista();
                mensagem = "Item Adicionado a lista de compras!";
                //this.salvarUser(mensagem);
              }

            }
          } else {
            //abriu outro mes
            this.user.gastosMensais.push(this.criarGasto());
            let posicao = this.user.gastosMensais.length - 1;
            this.user.gastosMensais[posicao].listaCompras = this.aux;
            this.user.gastosMensais[posicao].listaCompras[0] = this.criarListaDeCompras();
            this.user.gastosMensais[posicao].listaCompras[0].item[0] = this.setarItemLista();
            mensagem = "Item adicionado a lista de compras!"
          }
        } else {
          this.itemLista.precoTotal = this.itemLista.precoUni * this.itemLista.quantidade;
          mensagem = "Dado Editado!";
          //this.salvarUser(mensagem);
        }


      }
    }
    this.progress = true;
    this.somarTotal();
    this.somarLista();
    this.botao = "Adicionar";
    await this.userService.alter(this.user, this.id)
      .then(resp => {
        this.carregarUser();
        this.limpar();
        this.presentToast(mensagem);
        //alert("Criar toast na aletela pra informar ao usuario que o dado foi salvo ou editado")
      })
      .catch(error => {
        //alert("Error ao Salvare, desenvolver toast para avisar ao usuario que o dado não foi salvo")
        mensagem = error;
        this.presentToast(mensagem);
        this.carregarUser();
      })
  }
  setarValorlista() {
    if (this.user.gastosMensais != null) {
      this.user.gastosMensais.forEach(gasto => {
        if (gasto.listaCompras != null) {
          gasto.listaCompras.forEach(lista => {

            if (lista.status == "Pendente") {
              this.valorLista = lista.valorTota;
            }
          })
        }

      })

    }
    if (this.valorLista == null) {
      this.valorLista = 0;
    }
  }
  async subirMenu(dado) {
    if (this.alternancia == true) {
      const actionSheet = await this.actionSheet.create({
        header: '',
        buttons: [
          {
            text: 'Detalhe',
            role: 'destructive',
            icon: 'search',
            handler: () => {
              this.detalhar(dado);
            }
          }, {
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.deletar(dado);
            }
          }, {
            text: 'Editar',
            icon: 'construct',
            handler: () => {
              this.editar(dado);
            }
          }, {
            text: 'Cancelar',
            icon: 'close-circle',
            handler: () => {
            }

          }]
      });
      await actionSheet.present();
    } else {
      const actionSheet = await this.actionSheet.create({
        header: '',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              this.deletar(dado);
            }
          }, {
            text: 'Editar',
            icon: 'construct',
            handler: () => {
              this.editar(dado);
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


  }
  detalhar(dado) {
    if (this.alternancia == true) {
      //lista de gastos
      let nome = dado.nome;
      let data = dado.data
      this.router.navigate(['detalhe-gasto', { id: this.id, nome, data }])
    }
  }

  deletar(dado) {
    if (this.alternancia == true) {
      this.user.gastosMensais.forEach(gasto => {
        let cont = 0;
        gasto.listaItens.forEach(lista => {
          if (lista.data == dado.data && lista.nome == dado.nome) {
            gasto.listaItens.splice(cont, 1);
            let mensagem = "Dado deletado!";
            this.salvarUser(mensagem);
          }
          cont += 1;
        })
      })
    } else {
      this.user.gastosMensais.forEach(gasto => {
        gasto.listaCompras.forEach(lista => {
          if (lista.status == "Pendente") {
            let cont = 0;
            if (lista.item != null) {
              lista.item.forEach(item => {
                if (item.nome == dado) {
                  lista.item.splice(cont, 1);
                  let mensagem = "Dado deletado!";
                  this.salvarUser(mensagem);
                }
                cont += 1;
              })
            }

          }
        })
      })

    }
  }
  salvarUser(messagem) {
    if (this.verificarConexao() == true) {
      this.somarTotal();
      this.somarLista();
      this.userService.alter(this.user, this.id)
        .then(resp => {
          this.progress = true;
          this.carregarUser();
          this.limpar();
          this.presentToast(messagem);
        })
        .catch(error => {
          this.presentToast("Erro ao salvar: " + error);
        })
    } else {
      this.presentToast("Falha na conexão!")
    }

  }
  editar(dado) {
    if (this.alternancia == true) {
      //editar gasto
      let contGasto = 0;
      this.user.gastosMensais.forEach(gasto => {
        let contLista = 0;
        gasto.listaItens.forEach(item => {
          if (item.nome == dado.nome && dado.data == item.data) {
            this.posicaoGastoAux = contGasto;
            this.posicaoListaAux = contLista;
            this.item = dado;
            this.botao = "Editar";
          }
          contLista += 1;
        })
        contGasto += 1;
      })

    } else {
      //editar item lista de compra
      let contGasto = 0;

      this.user.gastosMensais.forEach(gasto => {
        let contLista = 0;
        gasto.listaCompras.forEach(lista => {
          if (lista.status == "Pendente") {
            let contItem = 0;
            if (lista.item != null) {
              lista.item.forEach(item => {
                if (item.nome == dado) {

                  this.posicaoGastoAux = contGasto;
                  this.posicaoListaAux = contLista;
                  this.posicaoItemAux = contItem;
                  this.itemLista = item;
                  this.botao = "Editar";
                }
              })
            }

            contItem += 1;
          }
          contLista += 1;
        })
        contGasto += 1;
      })
    }
  }

  somarTotal() {
    this.user.gastosMensais.forEach(gasto => {
      let valorGasto = 0;
      if (gasto.status == "Pendente") {
        if (gasto.listaCompras != null) {
          gasto.listaCompras.forEach(item => {
            valorGasto += item.valorTota;
          })
        }

        if (gasto.listaItens != null) {
          gasto.listaItens.forEach(item => {
            valorGasto += item.precoTotal;
          })
        }

        gasto.valorTotal = valorGasto;
      }
    })
  }
  somarLista() {
    this.user.gastosMensais.forEach(gasto => {
      if (gasto.listaCompras != null){
        gasto.listaCompras.forEach(lista => {
          if (lista.item != null) {
            if (lista.status == "Pendente") {
              let soma = 0;
              lista.item.forEach(item => {
                soma += item.precoTotal;
              })
              this.valorLista = soma;
              lista.valorTota = soma;
            }
          }
        })
      }
    })
  }
  limpar() {
    this.item.nome = "";
    this.item.data = null;
    this.item.precoTotal = null;
    this.item.precoUni = null;
    this.item.quantidade = null;
    this.item.tipo = "";
    this.itemLista.nome = "";
    this.itemLista.precoTotal = null;
    this.itemLista.precoUni = null;
    this.itemLista.quantidade = null;
    this.itemLista.tipo = "";

  }
  itemGasto() {
    this.item.data = new Date();
    this.item.precoTotal = this.item.precoUni * this.item.quantidade;
    return this.item;
  }
  setarItemLista() {
    if (this.itemLista.precoUni == null) {
      this.itemLista.precoUni = 0;
    }
    this.itemLista.precoTotal = this.itemLista.precoUni * this.itemLista.quantidade;
    return this.itemLista;
  }
  criarGasto() {
    this.aux = [];
    let gasto: Gasto = {} as Gasto;
    gasto.ano = new Date().getUTCFullYear();
    gasto.mes = (new Date().getUTCMonth() + 1);
    gasto.status = "Pendente";
    gasto.valorTotal = 0;
    return gasto;
  }
  criarListaDeCompras() {
    this.aux = [];
    let lista: ListaCompras = {} as ListaCompras;
    lista.data = new Date();
    lista.item = this.aux;
    lista.status = "Pendente";
    lista.valorTota = 0;
    return lista;
  }
  setarPosicao() {
    this.posicaoGasto = this.user.gastosMensais.length - 1;
    this.posicaoLista = this.user.gastosMensais[this.posicaoGasto].listaItens.length - 1;
    this.posicaoListaCompras = this.user.gastosMensais[this.posicaoGasto].listaCompras.length - 1;
    if (this.nomeRota != null && this.dataRota != null) {
      if (this.alternancia == true) {
        //carregar lista de gasto
        this.botao = "Editar";
        let valorGasto = 0;
        this.user.gastosMensais.forEach(gasto => {
          let valorLista = 0;
          gasto.listaItens.forEach(lista => {
            if (lista.data == this.dataRota && lista.nome == this.nomeRota) {
              this.posicaoGasto = valorGasto;
              this.posicaoLista = valorLista;
              this.item = lista;
              this.itemGastoAux = lista;
            }
            valorLista += 1;
          })

          valorGasto += 1;
        })

      }
    }
    let valorGasto = 0;
    this.user.gastosMensais.forEach(gasto => {
      let valorLista = 0;
      gasto.listaCompras.forEach(lista => {
        if (lista.status == "Pendente") {
          this.posicaoGastoCompra = valorGasto;
          this.posicaoListaCompras = valorLista;
        }
        valorLista += 1;
      })
      valorGasto += 1;
    })
  }
  transformarReal(valor) {
    if (valor == null) {
      valor = 0;
    }
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

  finalizarListaDeCompras() {
    let messagem = "";
    this.user.gastosMensais.forEach(gasto => {
      gasto.listaCompras.forEach(lista => {
        if (lista.status == "Pendente") {
          let finalizado = true;
          if (lista.item != null) {
            lista.item.forEach(item => {
              if (item.precoTotal == 0 || item.precoTotal == null) {
                finalizado = false;
              }
            })
          }

          if (finalizado == true) {
            let soma = 0
            lista.item.forEach(item => {
              soma += item.precoTotal;
            })
            lista.valorTota = soma;
            lista.status = "Finalizado";
            messagem = "Lista de compras finalizada"


          } else {
            messagem = "Existe itens com valor zerado";
          }

        }
      })
    })
    this.somarTotal();
    this.salvarUser(messagem);
  }
  async presentToast(messagem) {
    const toast = await this.toast.create({
      message: messagem,
      duration: 2000
    });
    toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toast.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }
}
