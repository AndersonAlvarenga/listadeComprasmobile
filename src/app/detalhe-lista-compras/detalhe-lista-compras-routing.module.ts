import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalheListaComprasPage } from './detalhe-lista-compras.page';

const routes: Routes = [
  {
    path: '',
    component: DetalheListaComprasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalheListaComprasPageRoutingModule {}
