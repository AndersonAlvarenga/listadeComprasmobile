import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalheListaComprasPage } from './detalhe-lista-compras.page';

describe('DetalheListaComprasPage', () => {
  let component: DetalheListaComprasPage;
  let fixture: ComponentFixture<DetalheListaComprasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheListaComprasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheListaComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
