import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports:[CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  extraCards = [
    { title: 'Reports', action: () => this.navigate('reports'), color: 'card-purple' },
    { title: 'Analytics', action: () => this.navigate('analytics'), color: 'card-orange' },
    { title: 'Settings', action: () => this.navigate('settings'), color: 'card-pink' },
    { title: 'Notifications', action: () => this.navigate('notifications'), color: 'card-teal' },
    { title: 'Tasks', action: () => this.navigate('tasks'), color: 'card-yellow' },
    { title: 'Reports', action: () => this.navigate('reports'), color: 'card-red' },
    { title: 'Analytics', action: () => this.navigate('analytics'), color: 'card-gray' },
  ];

  constructor(private router: Router) {}

  manageEmployee() {
    this.navigate('employees');
  }

  manageProperties() {
    this.navigate('properties');
  }

  navigate(route: string) {
    console.log('Navigate to', route);
     this.router.navigate([route]); // uncomment to enable routing
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}