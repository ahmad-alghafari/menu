import { Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DishesComponent } from './dishes/dishes.component';
import { AddDishComponent } from './add-dish/add-dish.component';
import { OrdersComponent } from './orders/orders.component';
import { CategoriesComponent } from './categories/categories.component';
import { QrcodeComponent } from './qrcode/qrcode.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { guestGuard } from './guard/guest.guard';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { DishesUserComponent } from './dishes-user/dishes-user.component';


export const routeNames = {
    login: "auth/login",
    dashboard : "dashboard",
    categories: 'dashboard/categories',
    dishes: 'dashboard/dishes',
    dishes_create: 'dashboard/dishes/create',
    orders : 'dashboard/orders',
    qrcode : 'dashboard/QRcode',
    menu: 'restuarants/:name',
    notFound: '**',
};

export const routes: Routes = [
    {
        path: 'admin', 
        component: AdminLayoutComponent,
        canActivate: [authGuard],  
        children: [
            { path: routeNames.dashboard, component: DashboardComponent },
            { path: routeNames.categories, component: CategoriesComponent },
            { path: routeNames.dishes, component: DishesComponent },
            { path: routeNames.dishes_create, component: AddDishComponent },
            { path: routeNames.orders, component: OrdersComponent },
            { path: routeNames.qrcode, component: QrcodeComponent }
        ]
    },
    {
        path: 'seless',
        component: UserLayoutComponent,
        children: [
            { path: routeNames.menu, component: DishesUserComponent },
        ]
    },
    { 
        path: routeNames.login, 
        component: LoginComponent, 
        canActivate: [guestGuard]
    },

    { 
        path: routeNames.notFound, 
        component: NotfoundComponent 
    },
];

  