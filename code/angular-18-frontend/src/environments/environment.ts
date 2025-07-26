const port:string = '8000';
const protocol = 'http';
const domain = '127.0.0.1';
const baseUrl = protocol + '://' + domain + ':' + port ;
const apiUrl = baseUrl + '/api';
export const environment = {
    production: false,
    example : apiUrl + '/example',
    dataUrl : {
        dishesUrl : apiUrl + '/dishes' ,
        ordersUrl : apiUrl + '/orders',
        categories : apiUrl + '/categories',
        qrcodeUrl : apiUrl + '/QRcode',
        resturantUrl : apiUrl + '/resturants',
    },
    authUrl : {
        loginUrl : apiUrl + '/login',
        registerUrl : apiUrl + '/register',
        logoutUrl : apiUrl + '/logout'
    }
};