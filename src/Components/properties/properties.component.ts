
import { Component } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// توحيد الـ Property interface
export interface Property {
  Name: string;
  Type: number;
  IsRequired: boolean;
  DropdownOptions?: string[] | null;
  id?: number;
}

@Component({
  selector: 'app-properties',
  imports: [FormsModule, CommonModule],
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent {
  properties: Property[] = [];
  isEditMode = false;

  submitted = false;

  editProperty(p: Property) {
    this.isEditMode = true;
    // this.newProperty = { ...p };
    this.newProperty = JSON.parse(JSON.stringify(p));

  // التأكد من أن المصفوفة موجودة
  if (this.newProperty.Type === 4 && !this.newProperty.DropdownOptions) {
    this.newProperty.DropdownOptions = [];
  }
    if (this.newProperty.Type === 4 && !this.newProperty.DropdownOptions) {
      this.newProperty.DropdownOptions = [];
    }
  }
  newProperty: Property = {

    Name: '',
    Type: 1,
    IsRequired: false,
    DropdownOptions: []
  };

  dropdownValue = '';

  types = [
    { value: 1, name: 'String' },
    { value: 2, name: 'Integer' },
    { value: 3, name: 'Date' },
    { value: 4, name: 'Dropdown' }
  ];

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
    this.loadProperties();
  }
  loadProperties() {
    this.propertyService.getAll().subscribe((res: any) => {

      this.properties = res.result.map((p: any) => ({
        id: p.id,
        Name: p.name,
        Type: p.type,
        IsRequired: p.isRequired,
        DropdownOptions: p.dropdownOptions ?? []
      }));

    });
  }
  addDropdownValue() {

    if (!this.dropdownValue.trim()) return;
    if (!this.newProperty.DropdownOptions) {
      this.newProperty.DropdownOptions = [];
    }

    this.newProperty.DropdownOptions.push(this.dropdownValue.trim());

    this.dropdownValue = '';

    console.log("Current DropdownOptions:", this.newProperty.DropdownOptions);
  }
  resetForm() {
    this.isEditMode = false;
    this.submitted = false;
    this.dropdownValue = '';
    this.newProperty = {
      Name: '',
      Type: 1,
      IsRequired: false,
      DropdownOptions: []
    };
  }
  removeDropdownValue(index: number) {
    this.newProperty.DropdownOptions?.splice(index, 1);
  }



  saveProperty() {
    const typeNumber = +this.newProperty.Type;
    this.submitted = true;
   const isDropdownInvalid = +this.newProperty.Type === 4 && 
                            (!this.newProperty.DropdownOptions || this.newProperty.DropdownOptions.length === 0);

 
  if (!this.newProperty.Name || isDropdownInvalid) {
    console.log("Validation failed!");
    return; 
  }
    const payload: Property = {
      Name: this.newProperty.Name,
      Type: typeNumber,
      IsRequired: this.newProperty.IsRequired,
      DropdownOptions: typeNumber === 4
        ? this.newProperty.DropdownOptions
        : null
    };

    console.log("Payload sent to API:", payload);

    if (this.isEditMode && this.newProperty.id) {
      payload.id = this.newProperty.id;

      this.propertyService.update(payload).subscribe({
        next: () => {
          Swal.fire('Updated', 'Property updated successfully', 'success');
          this.finalizeSave();
          console.log("updated prop: ", this.newProperty)
        },
        error: err => console.error(err)
      });
    } else {
      // حالة الإضافة الجديدة
      this.propertyService.add(payload).subscribe({
        next: () => {
          Swal.fire('Success', 'Property Added', 'success');
          this.finalizeSave();
        },
        error: err => console.error(err)
      });
    }
  }
  finalizeSave() {
    document.getElementById('closeModalBtn')?.click();
    this.loadProperties();
    this.resetForm();
  }
  deleteProperty(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {
      if (result.isConfirmed) {
        this.propertyService.delete(id).subscribe(() => {
          this.loadProperties();
        });
      }
    });
  }

  goBack() {
    // افترضي أن مسار الداشبورد هو '/dashboard'
    this.router.navigate(['/dashboard']);

  }
}