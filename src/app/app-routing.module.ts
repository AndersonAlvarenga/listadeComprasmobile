import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)//import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'detalhe-gasto-mes',
    loadChildren: () => import('./detalhe-gasto-mes/detalhe-gasto-mes.module').then( m => m.DetalheGastoMesPageModule)
  },
  {
    path: 'detalhe-gasto',
    loadChildren: () => import('./detalhe-gasto/detalhe-gasto.module').then( m => m.DetalheGastoPageModule)
  },
  {
    path: 'detalhe-lista-compras',
    loadChildren: () => import('./detalhe-lista-compras/detalhe-lista-compras.module').then( m => m.DetalheListaComprasPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
