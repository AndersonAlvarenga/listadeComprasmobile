import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalheGastoPage } from './detalhe-gasto.page';

const routes: Routes = [
  {
    path: '',
    component: DetalheGastoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalheGastoPageRoutingModule {}
