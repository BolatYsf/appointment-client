import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutsComponent } from './components/layouts/layouts.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { PatientsComponent } from './components/patients/patients.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    {
    // router path url de login varsa login component gidecek
    path: "login",
    component:LoginComponent

    },
    {
        path:"",
        component: LayoutsComponent,
        canActivateChild : [()=> inject(AuthService).isAuthenticated()], // bu sayede yukaridaki sart saglanmadan asagi route lara ulasilmasini engeller
        children:[
            {
                path:"",
                component:HomeComponent
            },
            {
                path:"doctors",
                component:DoctorsComponent
            },
            {
                path:"patients",
                component:PatientsComponent
            },
            {
                path:"users",
                component:UsersComponent
            }
        ]
    },
    {
        // eger path hic bir tanima uymuyorsa not-found component acacak
        path:"**",
        component:NotFoundComponent
    }
];
