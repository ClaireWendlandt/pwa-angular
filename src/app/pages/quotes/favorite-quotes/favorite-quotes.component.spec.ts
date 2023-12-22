import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteQuotesComponent } from './favorite-quotes.component';

describe('FavoriteQuotesComponent', () => {
  let component: FavoriteQuotesComponent;
  let fixture: ComponentFixture<FavoriteQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteQuotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
