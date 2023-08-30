import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReportGenerationComponent } from './report-generation/report-generation.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MainContentComponent } from './main-content/main-content.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'file-upload', component: FileUploadComponent },
  { path: 'report-generation', component: ReportGenerationComponent },
  { path: '', redirectTo: '/file-upload', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, FileUploadComponent, ReportGenerationComponent, NavigationComponent, MainContentComponent, ChatComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
