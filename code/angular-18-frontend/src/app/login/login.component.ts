import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Login } from '../shared/login';
import { FormsModule, NgForm , NgModel} from '@angular/forms';


@Component({
    selector: 'app-login',
    imports: [TranslateModule , FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    authService = inject(AuthService);
    data = new Login();

    login(form : NgForm){
        if(form.valid && this.passCheck(this.data.password)){
            this.authService.login(this.data);
        }
        else{

        }
    }

    passCheck(password : string){
        return password.length >= 8 && password.length <= 32;
    }
}
