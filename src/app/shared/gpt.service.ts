import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  constructor(
    private _http: HttpClient
  ) { }

  async ask(question: string, jobName: string = ''): Promise<string> {

    const req = this._http.post<any>('https://ghj8bqsdmj.execute-api.us-east-2.amazonaws.com/prod/ask-jules', {
      question,
      jobName
    });


    const res = await firstValueFrom(req);
    const answ = res;
    return answ;

  }

}