import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ViewsettingComponent } from '../viewsetting/viewsetting.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { routeNames } from '../app.routes';
import { AuthService } from '../services/auth.service';
import { DataRepositoryService } from '../services/data-repository.service';



@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
      RouterOutlet, 
      RouterLink, 
      NavbarComponent, 
      FooterComponent, 
      ViewsettingComponent , 
      TranslateModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements AfterViewInit {

  routeNames = routeNames;
  authService = inject(AuthService);
  dataRepository = inject(DataRepositoryService);
  isLoggedIn = false;

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if(isLoggedIn){
        this.dataRepository.initializeData();
      }
    });

  }
  

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const defaultLang = localStorage.getItem('local') || `ar`;
      this.translate.setDefaultLang(defaultLang);
      this.translate.use(defaultLang);
      this.applyFluidLayout();
      this.applyNavbarStyle();
    }
  }

  changeLanguage(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('local', lang);
    }
    this.translate.use(lang);
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
