import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { UserPipe } from '../../pipe/user.pipe';
import { RouterLink } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { HttpService } from '../../services/http.service';
import { SwalService } from '../../services/swal.service';
import { RoleModel } from '../../models/rol.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule,FormValidateDirective,UserPipe,RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users:UserModel[] =[];
  roles:RoleModel[] =[];
  

  @ViewChild("addModalCloseBtn") addModalCloseBtn:ElementRef<HTMLButtonElement> | undefined ;
  @ViewChild("updateModalCloseBtn") updateModalCloseBtn:ElementRef<HTMLButtonElement> | undefined ;

  createModel :UserModel = new UserModel();
  updateModel :UserModel = new UserModel();

  search: string="";

  constructor(
  private http:HttpService ,
  private toast:SwalService
 ){}
  ngOnInit(): void {
    this.getAll();
    this.getAllRoles();
  }

 getAll(){
  this.http.post<UserModel[]>("Users/GetAll",{},(res)=>{
    this.users = res.data;
  })
 }

 getAllRoles(){
   this.http.post<RoleModel>("Users/GetAllRoles",{},(res)=>{
     this.roles = res.data;
   })
 }

 add(form:NgForm){
  if(form.valid){
    this.http.post<string>("Users/Create",this.createModel,(res)=>{
      this.toast.callToast(res.data,"success");
      this.getAll();
      this.addModalCloseBtn?.nativeElement.click();
      this.createModel = new UserModel();
      
    });
  }
 }

 delete(id:string,fullName:string){
  this.toast.callSwal(`Delete User`,`You wanna delete ${fullName}!`,()=>{
    this.http.post<string>("Users/DeleteById",{id:id},(res)=>{
      this.toast.callToast(res.data,"info");
      this.getAll();
    })
  })
 }

get(data:UserModel){
  this.updateModel = {...data};
  
}

 update(form:NgForm){
  if(form.valid){
    this.http.post<string>("Users/Update",this.updateModel,(res)=>{
      this.toast.callToast(res.data,"success");
      this.getAll();
      this.updateModalCloseBtn?.nativeElement.click();
            
    });
  }
 }
}
