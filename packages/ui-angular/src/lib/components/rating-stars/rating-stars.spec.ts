import { TestBed } from '@angular/core/testing';
import { RatingStarsComponent } from './rating-stars';

describe('RatingStarsComponent (CVA)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  function create(): RatingStarsComponent {
    const fixture = TestBed.createComponent(RatingStarsComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('writeValue refleja el valor en el signal (form -> componente)', () => {
    const cmp = create();
    cmp.writeValue(4);
    expect(cmp.value()).toBe(4);
  });

  it('registerOnChange recibe la interacción del usuario (componente -> form)', () => {
    const cmp = create();
    let captured: number | undefined;
    cmp.registerOnChange((v) => (captured = v));
    (cmp as unknown as { pick(v: number): void }).pick(3);
    expect(captured).toBe(3);
    expect(cmp.value()).toBe(3);
  });

  it('setDisabledState deshabilita el componente', () => {
    const cmp = create();
    cmp.setDisabledState(true);
    expect((cmp as unknown as { disabled(): boolean }).disabled()).toBe(true);
  });
});
