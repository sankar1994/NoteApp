import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NoteComponent } from './pages/note/note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from './app.service';
import { HttpClientModule }    from '@angular/common/http';
import { MultiSelectModule, DropdownModule, SliderModule} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NoteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TableModule, BrowserAnimationsModule, 
    MultiSelectModule, 
    DropdownModule,
    SliderModule ,
    RouterModule.forRoot([
      {
         path: 'note',
         component: NoteComponent
      }
   ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
