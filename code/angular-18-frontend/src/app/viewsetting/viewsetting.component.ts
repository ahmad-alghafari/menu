import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-viewsetting',
    imports: [TranslateModule],
    templateUrl: './viewsetting.component.html',
    styleUrl: './viewsetting.component.css'
})
export class ViewsettingComponent {

     constructor(
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: object
      ) {}

    //   ngAfterViewInit(): void {
    //       if (isPlatformBrowser(this.platformId)) {
    //         this.applyFluidLayout();
    //         this.applyNavbarStyle();
    //       }
    //     }
      
    setLocale(){
        const currentLocal = localStorage.getItem('local') || 'en';
        var newLocal;
        if(currentLocal == 'en'){
            newLocal = 'ar';
        }else{
            newLocal = 'en'
        }
        this.translate.setDefaultLang(newLocal);
        this.translate.use(newLocal);
        localStorage.setItem('local' , newLocal);
    }

    private applyFluidLayout(): void {
        const isFluid: boolean | null = JSON.parse(localStorage.getItem('isFluid') || 'null');
        if (isFluid) {
          const container = document.querySelector('[data-layout]') as HTMLElement | null;
          if (container) {
            container.classList.remove('container');
            container.classList.add('container-fluid');
          }
        }
      }
    
      private applyNavbarStyle(): void {
        const navbarStyle = localStorage.getItem("navbarStyle");
        if (navbarStyle && navbarStyle !== 'transparent') {
          const navbar = document.querySelector('.navbar-vertical') as HTMLElement | null;
          if (navbar) {
            navbar.classList.add(`navbar-${navbarStyle}`);
          }
        }
      }
}
