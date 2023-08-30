import { ChatComponent } from './chat/chat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';


const routes: Routes = [
  { path: 'file-upload', component: FileUploadComponent },
  { path: 'report-generation', component: ReportGenerationComponent },
  { path: 'chat', component: ChatComponent },
  { path: '', redirectTo: '/header', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
