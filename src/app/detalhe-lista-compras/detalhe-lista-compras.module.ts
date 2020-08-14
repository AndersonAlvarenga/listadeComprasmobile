import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalheListaComprasPageRoutingModule } from './detalhe-lista-compras-routing.module';

import { DetalheListaComprasPage } from './detalhe-lista-compras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalheListaComprasPageRoutingModule
  ],
  declarations: [DetalheListaComprasPage]
})
export class DetalheListaComprasPageModule {}
