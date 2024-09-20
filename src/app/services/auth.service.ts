
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenModel } from '../models/token.model';
import { JwtPayload, jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenDecode : TokenModel = new TokenModel();
  constructor(
    private router : Router
  ) { }

  isAuthenticated(){
    const token  : string | null= localStorage.getItem("config_tk"); // localstroge token varmi yokmu onu kontrol edecegim bu string yada null doner
    if(token){
      const decode : JwtPayload | any =jwtDecode(token); // donus jwtpayload olacak token parcaliyorum .. any koyuyorum ki payload degerleri alabileyim
      
      const exp = decode.exp;
      const now =new Date().getTime() / 1000 ; // token daki exp date tipinde yakaliyorum
      console.log(now);
      console.log(token);
      
      if(now > exp){
        localStorage.removeItem("config_tk");
        this.router.navigateByUrl("/login");
        return false;
        
      } 
      
      this.tokenDecode.id = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.tokenDecode.name = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      this.tokenDecode.email = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email"];
      this.tokenDecode.userName = decode["UserName"];
      this.tokenDecode.roles =JSON.parse(decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      
      return true;
    }

    this.router.navigateByUrl("/login");
    return false;

  }



}
