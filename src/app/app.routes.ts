import { Routes } from '@angular/router';
import { LoginComponent } from '../Components/login/login.component';
import { RegisterComponent } from '../Components/register/register.component';
import { DashboardComponent } from '../Components/dashboard/dashboard.component';
import { authGuard } from '../guards/auth.guard';
import { EmployeesComponent } from '../Components/employees/employees.component';
import { PropertiesComponent } from '../Components/properties/properties.component';
import { AddEmployeeComponent } from '../Components/add-employee/add-employee.component';

export const routes: Routes = [
    { path:'login', component:LoginComponent },

{ path:'register', component:RegisterComponent },

{ path:'dashboard', component:DashboardComponent,canActivate:[authGuard] },
{ path:'employees', component:EmployeesComponent,canActivate:[authGuard] },
{ path: 'properties', component:PropertiesComponent,canActivate:[authGuard] },
{path :"add-employee",component:AddEmployeeComponent, canActivate:[authGuard]},
{ path:'', redirectTo:'login', pathMatch:'full'}
];
