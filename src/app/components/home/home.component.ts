import { Component, ElementRef, ViewChild } from '@angular/core';
import { departments } from '../../constants';
import { DoctorModel } from '../../models/doctor.model';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { DxSchedulerModule } from 'devextreme-angular';
import { HttpService } from '../../services/http.service';
import { AppointmentModel } from '../../models/appointment.model';
import { CreateAppointmentModel } from '../../models/create-appointment.model';
import { FormValidateDirective } from 'form-validate-angular';
import { PatientModel } from '../../models/patient.model';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SwalService } from '../../services/swal.service';

declare const $: any; // jquery kullanabilmek icin yaptim

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DxSchedulerModule,
    FormValidateDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe],
})
export class HomeComponent {
  departments = departments;
  doctors: DoctorModel[] = [];

  @ViewChild("addModalCloseBtn") addModalCloseBtn : ElementRef<HTMLButtonElement> | undefined;

  selectedDepartmentValue: number = 0;
  selectedDoctorId: string = '';

  appointments: AppointmentModel[] = [];

  createAppointmentModel: CreateAppointmentModel = new CreateAppointmentModel();

  constructor(private http: HttpService, private date: DatePipe ,private swal :SwalService) {}

  getAllDoctor() {
    this.selectedDoctorId = '';
    if (this.selectedDepartmentValue > 0) {
      this.http.post<DoctorModel[]>(
        'Appointments/GetDoctorsByDeparments',
        { departmentValue: +this.selectedDepartmentValue },
        (res) => {
          this.doctors = res.data;
        }
      );
    }
  }

  getAllAppointments() {
    if (this.selectedDoctorId) {
      this.http.post<AppointmentModel[]>(
        'Appointments/GetAllByDoctorId',
        { doctorId: this.selectedDoctorId },
        (res) => {
          this.appointments = res.data;

        }
      );
    }
  }

  onAppointmentFormOpening(event: any) {
    event.cancel = true;
    this.createAppointmentModel.startDate =
      this.date.transform(
        event.appointmentData.startDate,
        'dd.MM.yyyy HH:mm'
      ) ?? '';
    this.createAppointmentModel.endDate =
      this.date.transform(event.appointmentData.endDate, 'dd.MM.yyyy HH:mm') ??
      '';
    this.createAppointmentModel.doctorId = this.selectedDoctorId;

    $('#addModal').modal('show');
    this.createAppointmentModel.identityNumber = '';
    this.createAppointmentModel.firstName = '';
    this.createAppointmentModel.lastName = '';
    this.createAppointmentModel.city = '';
    this.createAppointmentModel.town = '';
    this.createAppointmentModel.fullAddress = '';
    this.createAppointmentModel.patientId = '';
  }

  create(form: NgForm) {
    if (form.valid) {
      this.http.post<string>("Appointments/Create",this.createAppointmentModel,(res)=>{
          this.swal.callToast(res.data);
          this.addModalCloseBtn?.nativeElement.click();
          this.createAppointmentModel = new CreateAppointmentModel();
          this.getAllAppointments();
      })
    }
  }

  getPatient() {
    this.http.post<PatientModel>(
      'Appointments/GetPatientByIdentityNumber',
      { IndentityNumber: this.createAppointmentModel.identityNumber },
      (res) => {
        if (res.data === null) {
          this.createAppointmentModel.firstName = '';
          this.createAppointmentModel.lastName = '';
          this.createAppointmentModel.city = '';
          this.createAppointmentModel.town = '';
          this.createAppointmentModel.fullAddress = '';
          this.createAppointmentModel.patientId = null;
          return;
        }
        this.createAppointmentModel.patientId = res.data.id;
        this.createAppointmentModel.firstName = res.data.firstName;
        this.createAppointmentModel.lastName = res.data.lastName;
        this.createAppointmentModel.city = res.data.city;
        this.createAppointmentModel.town = res.data.town;
        this.createAppointmentModel.fullAddress = res.data.fullAddress;
      }
    );
  }

  onAppointmentDeleting(e:any){
    e.cancel=true;

    this.swal.callSwal("Delete appointment", `Would you like to delete ${e.appointmentData.patient.firstName} -  ${e.appointmentData.patient.lastName} appointment?`,()=>{
      this.http.post<string>("Appointments/DeleteById",{id:e.appointmentData.id},(res)=>{
          this.swal.callToast(res.data,"info");
          this.getAllAppointments();
      })
    } )
  }

  onAppointmentDeleted(e:any){
    e.cancel=true;

    
  }

  onAppointmentUpdating(e:any){
    e.cancel=true;

    const data ={
      id: e.oldData.id,
      startDate:this.date.transform(e.newData.startDate,"dd.MM.yyyy HH:mm"),
      endDate:this.date.transform(e.newData.endDate,"dd.MM.yyyy HH:mm"),
    }

    this.http.post<string>("Appointments/UpdateAppointment",data,(res)=>{
      this.swal.callToast(res.data);
      this.getAllAppointments();
    });
    
  }
}
