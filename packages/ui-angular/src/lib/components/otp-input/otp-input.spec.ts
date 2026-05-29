import { TestBed } from '@angular/core/testing';
import { OtpInputComponent } from './otp-input';

describe('OtpInputComponent (CVA)', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  function create(): OtpInputComponent {
    const fixture = TestBed.createComponent(OtpInputComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('writeValue refleja el valor en el signal (form -> componente)', () => {
    const cmp = create();
    cmp.writeValue('123456');
    expect(cmp.value()).toBe('123456');
  });

  it('registerOnChange recibe la interacción del usuario (componente -> form)', () => {
    const cmp = create();
    let captured: string | undefined;
    cmp.registerOnChange((v) => (captured = v));
    (cmp as unknown as { commit(v: string): void }).commit('246810');
    expect(captured).toBe('246810');
    expect(cmp.value()).toBe('246810');
  });

  it('setDisabledState deshabilita el componente', () => {
    const cmp = create();
    cmp.setDisabledState(true);
    expect((cmp as unknown as { disabled(): boolean }).disabled()).toBe(true);
  });
});
