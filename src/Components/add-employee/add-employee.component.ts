import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { EmployeeService } from "../../services/employee.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @Input() employee?: any; 
  @Output() saved = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  selectedEmployee: any = { name: '', code: '', values: [] };
  availableProperties: any[] = []; 
  submitted = false;

  constructor(private empService: EmployeeService,private router:Router) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.empService.getAllProperties().subscribe({
      next: (res: any) => {
        this.availableProperties = res.result || res || [];
        this.initializeForm();
      },
      error: (err) => console.error("Error loading properties:", err)
    });
  }
initializeForm() {
  const mapProperty = (sysProp: any, existingValue: string = '') => ({
    propertyId: sysProp.id || sysProp.Id,
    propertyName: sysProp.name || sysProp.Name,
    type: sysProp.type || sysProp.Type,
    // حفظ حالة الـ Required هنا
    isRequired: sysProp.isRequired || sysProp.IsRequired || false, 
    dropdownOptions: [...(sysProp.dropdownOptions || sysProp.DropdownOptions || [])],
    value: existingValue
  });

  if (this.employee) {
    this.selectedEmployee = { ...this.employee };
    const empProps = this.employee.properties || this.employee.Values || [];

    this.selectedEmployee.values = this.availableProperties.map(sysProp => {
      const sysId = sysProp.id || sysProp.Id;
      const sysName = sysProp.name || sysProp.Name;

      const existing = empProps.find((ep: any) => 
        (ep.propertyId === sysId) || 
        (ep.propertyName?.toLowerCase() === sysName?.toLowerCase()) ||
        (ep.PropertyName?.toLowerCase() === sysName?.toLowerCase())
      );

      return mapProperty(sysProp, existing ? (existing.value || existing.Value || '') : '');
    });
  } else {
    this.selectedEmployee.values = this.availableProperties.map(prop => mapProperty(prop, ''));
  }
}

  // saveEmployee() {
  //   this.submitted = true;

  //   if (!this.selectedEmployee.name || !this.selectedEmployee.code) {
  //     Swal.fire('Warning', 'Please enter Name and Code', 'warning');
  //     return;
  //   }

  //   const payload: any = {
  //     Name: this.selectedEmployee.name,
  //     Code: this.selectedEmployee.code,
  //     Values: this.selectedEmployee.values.map((v: any) => ({
  //       CustomPropertyId: v.propertyId,
  //       Value: v.value !== undefined && v.value !== null ? v.value.toString() : ""
  //     }))
  //   };

  //   if (this.selectedEmployee.id) {
  //     payload.Id = this.selectedEmployee.id;
  //     this.empService.updateEmployee(payload).subscribe({
  //       next: () => {
  //         Swal.fire('Success', 'Employee updated successfully', 'success');
  //         this.saved.emit();
  //       },
  //       error: (err) => Swal.fire('Error', 'Update failed', 'error')
  //     });
  //   } else {
  //     this.empService.add(payload).subscribe({
  //       next: () => {
  //         Swal.fire('Success', 'Employee added successfully', 'success');
  //         this.saved.emit();
  //       },
  //       error: (err) => Swal.fire('Error', 'Add failed', 'error')
  //     });
  //   }
  // }


    saveEmployee() {
  this.submitted = true;

  // 1. التحقق من الحقول الأساسية
  if (!this.selectedEmployee.name || !this.selectedEmployee.code) {
    Swal.fire('Warning', 'Please enter Name and Code', 'warning');
    return;
  }

  // 2. التحقق من الخصائص المطلوبة (The fix)
  const missingRequired = this.selectedEmployee.values.find((v: any) => 
    v.isRequired && (!v.value || v.value.toString().trim() === '')
  );

  if (missingRequired) {
    Swal.fire('Warning', `Please fill in the required field: ${missingRequired.propertyName}`, 'warning');
    return;
  }

  // 3. بناء الـ Payload والإرسال (باقي الكود كما هو)
  const payload: any = {
    Name: this.selectedEmployee.name,
    Code: this.selectedEmployee.code,
    Values: this.selectedEmployee.values.map((v: any) => ({
      CustomPropertyId: v.propertyId,
      Value: v.value !== undefined && v.value !== null ? v.value.toString() : ""
    }))
  };

  // ... استكمال كود الحفظ (updateEmployee أو add)
  if (this.selectedEmployee.id) {
    payload.Id = this.selectedEmployee.id;
    this.empService.updateEmployee(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Employee updated successfully', 'success');
        this.saved.emit();
      },
      error: (err) => Swal.fire('Error', 'Update failed', 'error')
    });
  } else {
    this.empService.add(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Employee added successfully', 'success');
        this.saved.emit();
      },
      error: (err) => Swal.fire('Error', 'Add failed', 'error')
    });
  }
}
}