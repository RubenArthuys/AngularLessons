import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppareilService {

  appareilSubject = new Subject<any []>();

  private appareils = [];

  constructor(private httpClient: HttpClient) {}

  emitAppareilSubject() {
    this.appareilSubject.next(this.appareils.slice());
  }

  getAppareilById(id: number) {
    const appareil = this.appareils.find(
      (appareilObject) => {
        return appareilObject.id === id;
      }
    );
    return appareil;
  }

  switchOnAll(){
    for(let appareil of this.appareils) {
      appareil.status = 'on';
    }
    this.emitAppareilSubject();
  }

  switchOffall() {
    for(let appareil of this.appareils) {
      appareil.status = 'off';
    }
    this.emitAppareilSubject();
  }

  switchOnOne(index: number) {
    this.appareils[index].status = 'on';
    this.emitAppareilSubject();
  }

  swithcOffOne(index: number) {
    this.appareils[index].status = 'off';
    this.emitAppareilSubject();
  }

  addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
    this.appareils.push(appareilObject);
    this.emitAppareilSubject();
  }

  saveAppareilToserver() {
    this.httpClient
    .put('https://http-client-demo-1645f.firebaseio.com/appareils.json', this.appareils)
    .subscribe(
      () => {
        console.log('Good');
      },
      (error) => {
        console.log('Error saving' + error);
      }
    )
  }

  getAppareilsFromServer() {
    this.httpClient
      .get<any[]>('https://http-client-demo-1645f.firebaseio.com/appareils.json')
      .subscribe(
        (response) => {
          this.appareils = response;
          this.emitAppareilSubject();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
}

  
}