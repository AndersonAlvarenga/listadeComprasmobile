import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  id = {
    "id": ""
  }
  aux: any
  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute
  ) { }
  ngOnInit() {
    this.activeRouter.params.subscribe(dado => {
      this.aux = dado;
      this.id = this.aux;
      if (Object.keys(dado).length >= 1 && this.id.id != "") {
        this.aux = dado;
        this.id = this.aux
        if (dado.nome == null) {
          this.router.navigate(['tabs', { id: this.id.id }, 'tab1', { id: this.id.id }])
        }
        // 
      } else {
        this.router.navigate([''])
      }
    })
  }
  tab1() {
    this.router.navigate(['tabs', { id: this.id.id }, 'tab1', { id: this.id.id }])
  }
  tab2() {
    this.router.navigate(['tabs', { id: this.id.id }, 'tab2', { id: this.id.id }])
  }
  tab3() {
    this.router.navigate(['tabs', { id: this.id.id }, 'tab3', { id: this.id.id }])
  }

}
