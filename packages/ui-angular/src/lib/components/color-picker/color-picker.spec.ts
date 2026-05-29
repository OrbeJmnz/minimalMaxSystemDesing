import { TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker';

describe('ColorPickerComponent (CVA)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  function create(): ColorPickerComponent {
    const fixture = TestBed.createComponent(ColorPickerComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('writeValue refleja el valor en el signal (form -> componente)', () => {
    const cmp = create();
    cmp.writeValue('#ea5ec1');
    expect(cmp.value()).toBe('#ea5ec1');
  });

  it('registerOnChange recibe la interacción del usuario (componente -> form)', () => {
    const cmp = create();
    let captured: string | undefined;
    cmp.registerOnChange((v) => (captured = v));
    (cmp as unknown as { commit(v: string): void }).commit('#10b981');
    expect(captured).toBe('#10b981');
    expect(cmp.value()).toBe('#10b981');
  });

  it('setDisabledState deshabilita el componente', () => {
    const cmp = create();
    cmp.setDisabledState(true);
    expect((cmp as unknown as { disabled(): boolean }).disabled()).toBe(true);
  });
});
