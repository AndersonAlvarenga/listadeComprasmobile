import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetalheGastoMesPage } from './detalhe-gasto-mes.page';

describe('DetalheGastoMesPage', () => {
  let component: DetalheGastoMesPage;
  let fixture: ComponentFixture<DetalheGastoMesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalheGastoMesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheGastoMesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
