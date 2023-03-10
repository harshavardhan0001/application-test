import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { BaseService } from './services/base.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { AddProductComponent } from './products/add-product/add-product.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule,AgGridModule], 
      declarations: [
        AppComponent,
        ProductsComponent,
        AddProductComponent
      ],
      providers: [
        BaseService 
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'frontend'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Product List');
  });
});
