import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  @Input() title: string = '';
  @Input() subtitle: string = '';
}
