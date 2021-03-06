import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APPCONFIG } from '../constantes.module';
import { Divisa } from '../modelos/divisa';

@Injectable({
  providedIn: "root",
})
export class TipoCambioService {
  url = APPCONFIG.BASE_URL + "divisa";
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) {}

  getDivisas(): Observable<Divisa[]> {
    return this.http
      .get<Divisa[]>(this.url)
      .pipe(
        catchError((err) =>
          this.handleError(err, "Error al obtener las divisas")
        )
      );
  }

  getDivisa(codDivisa: number): Observable<Divisa> {
    return this.http
      .get<Divisa>(this.url + `/${codDivisa}`)
      .pipe(
        catchError((err) =>
          this.handleError(err, "Error al obtener la divisa.")
        )
      );
  }
  updateDivisa(Divisa: Divisa): Observable<any> {
    return this.http
      .put(this.url + `/${Divisa.codDivisa}`, Divisa, this.httpOptions)
      .pipe(
        catchError((err) =>
          this.handleError(err, "Error al actualizar la divisa")
        )
      );
  }

  private handleError(error: HttpErrorResponse, msj: string) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status == 600) {
        msj = error.error;
      }
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(msj);
  }
}
