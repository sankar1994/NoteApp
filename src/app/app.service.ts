import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';
import 'rxjs/add/observable/of';

@Injectable()
export class AppService {

    constructor(private http: HttpClient) { }

    public getNotes(): Observable<any> {
       let json= localStorage.getItem("list");
      return Observable.of(JSON.parse(json)).pipe(delay(1000));
    }
}