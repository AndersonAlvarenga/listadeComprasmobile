import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalheGastoMesPage } from './detalhe-gasto-mes.page';

const routes: Routes = [
  {
    path: '',
    component: DetalheGastoMesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalheGastoMesPageRoutingModule {}
