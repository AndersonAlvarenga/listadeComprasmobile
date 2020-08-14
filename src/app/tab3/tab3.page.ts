import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../interface/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user: User;
  id: string;
  aux: any;
  progress = true;
  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }
  async ngOnInit() {
    this.activeRouter.params.subscribe(dado => {
      this.id = dado.id;
    })
    setTimeout(time => {
      this.progress = false;
    }, 3000);

    this.aux = await this.userService.getById(this.id);
    this.user = this.aux;

  }
  sair() {
    this.router.navigate(["/"]);  
  }


}
