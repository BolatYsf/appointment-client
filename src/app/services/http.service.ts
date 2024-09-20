import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResultModel } from '../models/result.model';
import { api } from '../constants';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  token: string | null=""

  constructor(
    private http: HttpClient,
    private error: ErrorService
  ) {
    if(localStorage.getItem("config_tk")){
      this.token = localStorage.getItem("config_tk");
    }
  }

  post<T>(
    apiUrl: string,
    body: any,
    callback: (res: ResultModel<T>) => void,
    errCallback?: (err: HttpErrorResponse) => void
  ) {
    this.http.post<ResultModel<T>>(`${api}/${apiUrl}`, body , {
      headers:{
        "Authorization":"Bearer " + this.token 
      }
    }).subscribe({
      next: (res) => {
        callback(res);
      },
      error: (err: HttpErrorResponse) => {
        this.error.errorHandler(err);
        if (errCallback != undefined) {
          errCallback(err);
        }
      },
    });
  }
}
