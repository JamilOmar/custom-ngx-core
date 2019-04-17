import { TestBed } from '@angular/core/testing';

import { WindowService } from './window.service';

describe('Windows.UtilsService', () => {
  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [
        WindowService
      ]
    });
    const windows: WindowService = TestBed.get(WindowService);
    expect(windows).toBeTruthy();
  });

  it('should be created with custom object for extension', () => {
    const spy = jasmine.createSpyObj('SpecialWindowsService', ['nativeWindow']);
    TestBed.configureTestingModule({
      providers: [
       {provide: WindowService , useValue:spy}
      ]
    });
    const windows: WindowService = TestBed.get(WindowService);
    expect( windows.nativeWindow).toBeDefined();
  });
});
