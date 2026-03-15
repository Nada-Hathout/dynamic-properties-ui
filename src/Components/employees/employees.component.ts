import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEmployeeComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  allSystemProperties: any[] = []; // قائمة بكل الخصائص المتاحة في النظام لثبات الجدول
  selectedEmployee: any = null;
  showForm: boolean = false;

  constructor(private empService: EmployeeService,private router:Router) {}

  ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    // 1. جلب كل الخصائص أولاً لترتيب الجدول
    this.empService.getAllProperties().subscribe(props => {
      this.allSystemProperties = props.result || props || [];
      // 2. بعد جلب الخصائص، نجلب الموظفين
      this.loadEmployees();
    });
  }

  loadEmployees() {
    this.empService.getAll().subscribe({
      next: (res: any) => {
        this.employees = res.result || res || [];
      },
      error: err => console.error('Load Error:', err)
    });
  }

  // دالة ذكية لإيجاد قيمة الخاصية للموظف بناءً على اسم العمود
  getPropertyValue(employee: any, propName: string): string {
    if (!employee.properties) return '---';
    const found = employee.properties.find((p: any) => 
      p.propertyName?.toLowerCase() === propName.toLowerCase() || 
      p.PropertyName?.toLowerCase() === propName.toLowerCase()
    );
    return found ? found.value : '---';
  }

  openForm(employee: any = null) {
    this.selectedEmployee = employee ? { ...employee } : null;
    this.showForm = true;
  }

  handleSave() {
    this.showForm = false;
    this.loadEmployees();
  }

  deleteEmployee(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empService.delete(id).subscribe(() => {
          Swal.fire('Deleted!', '', 'success');
          this.loadEmployees();
        });
      }
    });
  }
    goBack() {
    // افترضي أن مسار الداشبورد هو '/dashboard'
    this.router.navigate(['/dashboard']);

  }
}