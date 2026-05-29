import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('se crea con un modo válido', () => {
    const svc = TestBed.inject(ThemeService);
    expect(['light', 'dark']).toContain(svc.mode());
  });

  it('toggle alterna entre light y dark', () => {
    const svc = TestBed.inject(ThemeService);
    svc.set('light');
    expect(svc.mode()).toBe('light');
    svc.toggle();
    expect(svc.mode()).toBe('dark');
    svc.toggle();
    expect(svc.mode()).toBe('light');
  });

  it('set fija un modo explícito', () => {
    const svc = TestBed.inject(ThemeService);
    svc.set('dark');
    expect(svc.mode()).toBe('dark');
  });
});
