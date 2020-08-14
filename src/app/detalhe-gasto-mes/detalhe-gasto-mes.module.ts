import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalheGastoMesPageRoutingModule } from './detalhe-gasto-mes-routing.module';

import { DetalheGastoMesPage } from './detalhe-gasto-mes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalheGastoMesPageRoutingModule
  ],
  declarations: [DetalheGastoMesPage]
})
export class DetalheGastoMesPageModule {}
