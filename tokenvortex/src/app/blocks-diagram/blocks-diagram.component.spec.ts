import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlocksDiagramComponent } from './blocks-diagram.component';

describe('BlocksDiagramComponent', () => {
  let component: BlocksDiagramComponent;
  let fixture: ComponentFixture<BlocksDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlocksDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlocksDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
