import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withI18nSupport } from '@angular/platform-browser';

import { HttpClient  , HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader , TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]) 
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withI18nSupport()),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader:{
          provide : TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps:[HttpClient]
        }
      })
    )
  ]
};
