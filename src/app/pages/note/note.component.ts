import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Note } from '../../Model';
import Swal from 'sweetalert2';
import { LazyLoadEvent, DataTable } from 'primeng/primeng';
import { AppService } from '../../app.service';
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css', '../../../../node_modules/sweetalert2/dist/sweetalert2.min.css'],
  encapsulation: ViewEncapsulation.None
})
export class NoteComponent implements OnInit {
  public onNoteForm: FormGroup;
  @ViewChild('dt') public dataTable: DataTable;
  public notes: Note[]=new Array();
  public datasource: Note[];
  public totalRecords: number;
  public loading: boolean;
  public selectedColumns: any[];
  public cols: any[];
  public colors: any[];
  public brands: any[];
  public columnOptions: any[];
  private colsTempor: any[] = [];
  data: any;
  notesList: Note[] = new Array();
  iscreate: boolean = false;
  isUpdate: boolean = false;
  isSave: boolean = false;
  submitted: boolean = false;
  filterQuery:string="";
  validation_messages = {
    'noteText': [
      { type: 'required', message: 'Note Text is Required' },
    ],
    'noteColor': [
      { type: 'required', message: 'Note Color is Required' },
    ]
  }
  constructor(public fb: FormBuilder, private appService: AppService) { }

  ngOnInit() {
    let data = localStorage.getItem("list");
    if (this.isEmpty(data)) {
      localStorage.setItem("list", JSON.stringify(this.notesList));
    }
    this.onNoteForm = this.fb.group({
      noteText: ['', Validators.compose([
        Validators.required
      ])],
      noteColor: ['', Validators.compose([
        Validators.required
      ])]
    });
    this.cols = [
      { field: 'text', header: 'Text', index: 1 },
      { field: 'color', header: 'Color', index: 2 }
    ];

    this.columnOptions = [];
    this.selectedColumns = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i] });
    }
    this.loading = true;
    setTimeout(() => {
      this.appService.getNotes().subscribe(notes => {
        this.datasource = notes;
        this.totalRecords = this.datasource.length;
        this.notes = this.datasource.slice(0, 10);
        this.loading = false;
      });
    }, 500);
  }
  onClickCreate() {
    this.isSave = true;
    this.iscreate = true;
    this.isUpdate = false;
    this.submitted = false;
    this.onNoteForm.reset();
  }
  onClickSave() {
    this.submitted = true;
    if (this.onNoteForm.valid) {
      this.submitted = false;
      let note: Note = new Note();
      note.text = this.onNoteForm.get("noteText").value;
      note.color = this.onNoteForm.get("noteColor").value;
      this.notesList = JSON.parse(localStorage.getItem("list"));
      this.notesList.push(note);
      localStorage.setItem("list", JSON.stringify(this.notesList));
      Swal.fire({
        title: 'Note Saved Successfully ',
        text: 'Note ==>  ' + note.text,
        icon: 'success',
      }).then((result) => {
        if (result.value) {
          location.reload();
        }
      });
    }
  }
  public selectionItemForFilter(e) {
    const colsTempor = e.value;
    colsTempor.sort(function (a, b) {
      return a.index - b.index;
    });
    this.cols = [];
    this.cols = colsTempor;
    if (e.value.length > 10) {
      e.value.pop();
    }
  }
  public loadLazy(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.notes = this.datasource.slice(event.first, (event.first + event.rows));
        this.search();
        this.loading = false;
      }
    }, 1000);
  }
  edit(index) {
    this.iscreate = true;
    this.isSave = false;
    this.isUpdate = true;
    this.notesList = JSON.parse(localStorage.getItem("list"));
    let data = this.notesList[index];
    this.onNoteForm.get("noteText").setValue(data.text);
    this.onNoteForm.get("noteColor").setValue(data.color);
    this.notesList.splice(index, 1);
    localStorage.setItem("list", JSON.stringify(this.notesList));
  }
  delete(index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this notes!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.notesList = JSON.parse(localStorage.getItem("list"));
        this.notesList.splice(index, 1);
        localStorage.setItem("list", JSON.stringify(this.notesList));
        location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your notes is safe :)',
          'error'
        )
      }
    })

  }
  isEmpty(value: any) {
    if (value == undefined || value == null || value == "")
      return true;
    return false;
  }
  onClickCancel() {
    this.iscreate = false;
  }
  filter() {
    if (this.datasource) {
      this.notes = this.datasource.slice(0, 10);
      this.search();
    }
  }
  search(){
    if(!this.isEmpty(this.filterQuery)){
      let data= this.notes.filter(row => (row.text.toLowerCase().indexOf(this.filterQuery.toLowerCase()) > -1 || row.color.toLowerCase().indexOf(this.filterQuery.toLowerCase()) > -1));
      this.notes=data;
    }
  }
}
