import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  constructor() { }

  ask() {

  }

}


export interface Message {
  text: string;
  sent: boolean;
}
