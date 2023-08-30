import { Component } from '@angular/core';

@Component({
  selector: 'app-report-generation',
  templateUrl: './report-generation.component.html',
  styleUrls: ['./report-generation.component.css'],
})
export class ReportGenerationComponent {
  reportText: string = '';

  generateReport() {
    // Implement report generation logic using the reportText input
  }
}
