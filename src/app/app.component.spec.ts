import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';

import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Store, StoreModule } from '@ngrx/store';

// Load the implementations that should be tested
import { AppComponent } from './app.component';

import { HostWindowState } from './shared/host-window.reducer';
import { HostWindowResizeAction } from './shared/host-window.actions';

import { MetadataService } from './core/metadata/metadata.service';

import { GLOBAL_CONFIG, ENV_CONFIG } from '../config';
import { NativeWindowRef, NativeWindowService } from './shared/services/window.service';

import { MockTranslateLoader } from './shared/mocks/mock-translate-loader';
import { MockMetadataService } from './shared/mocks/mock-metadata-service';
import { PlatformServiceStub } from './shared/testing/platform-service-stub';
import { PlatformService } from './shared/services/platform.service';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de: DebugElement;
let el: HTMLElement;

describe('App component', () => {

  // async beforeEach
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [AppComponent], // declare the test component
      providers: [
        { provide: GLOBAL_CONFIG, useValue: ENV_CONFIG },
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: MetadataService, useValue: new MockMetadataService() },
        { provide: PlatformService, useValue: new PlatformServiceStub() },
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    comp = fixture.componentInstance; // component test instance

    // query for the <div class='outer-wrapper'> by CSS element selector
    de = fixture.debugElement.query(By.css('div.outer-wrapper'));
    el = de.nativeElement;
  });

  it('should create component', inject([AppComponent], (app: AppComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

  describe('when the window is resized', () => {
    let width: number;
    let height: number;
    let store: Store<HostWindowState>;

    beforeEach(() => {
      store = fixture.debugElement.injector.get(Store);
      spyOn(store, 'dispatch');

      window.dispatchEvent(new Event('resize'));
      width = window.innerWidth;
      height = window.innerHeight;
    });

    it('should dispatch a HostWindowResizeAction with the width and height of the window as its payload', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new HostWindowResizeAction(width, height));
    });

  });
});
