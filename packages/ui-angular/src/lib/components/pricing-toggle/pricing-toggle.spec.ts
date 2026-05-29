import { TestBed } from '@angular/core/testing';
import { PricingToggleComponent } from './pricing-toggle';

describe('PricingToggleComponent (CVA)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  function create(): PricingToggleComponent {
    const fixture = TestBed.createComponent(PricingToggleComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('writeValue refleja el valor en el signal (form -> componente)', () => {
    const cmp = create();
    cmp.writeValue('yearly');
    expect(cmp.period()).toBe('yearly');
  });

  it('registerOnChange recibe la interacción del usuario (componente -> form)', () => {
    const cmp = create();
    let captured: string | undefined;
    cmp.registerOnChange((v) => (captured = v));
    (cmp as unknown as { select(v: 'monthly' | 'yearly'): void }).select('yearly');
    expect(captured).toBe('yearly');
    expect(cmp.period()).toBe('yearly');
  });

  it('setDisabledState deshabilita el componente', () => {
    const cmp = create();
    cmp.setDisabledState(true);
    expect((cmp as unknown as { disabled(): boolean }).disabled()).toBe(true);
  });
});
