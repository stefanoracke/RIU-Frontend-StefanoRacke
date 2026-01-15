import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonTable } from './skeleton-table';

describe('SkeletonTable', () => {
  let component: SkeletonTable;
  let fixture: ComponentFixture<SkeletonTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonTable], // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate displayedColumns based on columns input', () => {
    component.columns = 3;
    component.rows = 2;

    component.ngOnChanges();

    expect(component.displayedColumns).toEqual(['col1', 'col2', 'col3']);
  });

  it('should generate skeletonData based on rows input', () => {
    component.columns = 2;
    component.rows = 5;

    component.ngOnChanges();

    expect(component.skeletonData.length).toBe(5);
  });

  it('should update columns and rows when inputs change', () => {
    component.columns = 4;
    component.rows = 4;
    component.ngOnChanges();

    expect(component.displayedColumns.length).toBe(4);
    expect(component.skeletonData.length).toBe(4);

    component.columns = 6;
    component.rows = 2;
    component.ngOnChanges();

    expect(component.displayedColumns).toEqual(['col1', 'col2', 'col3', 'col4', 'col5', 'col6']);
    expect(component.skeletonData.length).toBe(2);
  });
});
