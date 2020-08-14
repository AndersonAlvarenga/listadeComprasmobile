import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalheGastoPageRoutingModule } from './detalhe-gasto-routing.module';

import { DetalheGastoPage } from './detalhe-gasto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalheGastoPageRoutingModule
  ],
  declarations: [DetalheGastoPage]
})
export class DetalheGastoPageModule {}
