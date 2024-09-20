import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { DoctorModel } from '../../models/doctor.model';
import { CommonModule } from '@angular/common';
import { departments } from '../../constants';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { SwalService } from '../../services/swal.service';
import { DoctorPipe } from '../../pipe/doctor.pipe';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [RouterLink,CommonModule,FormsModule,FormValidateDirective,DoctorPipe],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit{

  doctors:DoctorModel[] =[];
  departments= departments ;

  @ViewChild("addModalCloseBtn") addModalCloseBtn:ElementRef<HTMLButtonElement> | undefined ;
  @ViewChild("updateModalCloseBtn") updateModalCloseBtn:ElementRef<HTMLButtonElement> | undefined ;

  createModel :DoctorModel = new DoctorModel();
  updateModel :DoctorModel = new DoctorModel();

  search: string="";

  constructor(
  private http:HttpService ,
  private toast:SwalService
 ){}
  ngOnInit(): void {
    this.getAll();
  }

 getAll(){
  this.http.post<DoctorModel[]>("Doctors/GetAll",{},(res)=>{
    this.doctors = res.data;
  })
 }

 add(form:NgForm){
  if(form.valid){
    this.http.post<string>("Doctors/Create",this.createModel,(res)=>{
      this.toast.callToast(res.data,"success");
      this.getAll();
      this.addModalCloseBtn?.nativeElement.click();
      this.createModel = new DoctorModel();
      
    });
  }
 }

 delete(id:string,fullName:string){
  this.toast.callSwal(`Delete Doctor`,`You wanna delete ${fullName}!`,()=>{
    this.http.post<string>("Doctors/DeleteById",{id:id},(res)=>{
      this.toast.callToast(res.data,"info");
      this.getAll();
    })
  })
 }

get(data:DoctorModel){
  this.updateModel = {...data};
  this.updateModel.departmentValue = data.department.value;
}

 update(form:NgForm){
  if(form.valid){
    this.http.post<string>("Doctors/UpdateById",this.updateModel,(res)=>{
      this.toast.callToast(res.data,"success");
      this.getAll();
      this.updateModalCloseBtn?.nativeElement.click();
            
    });
  }
 }

}
