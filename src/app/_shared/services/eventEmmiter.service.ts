
// The service
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import {Subject,Subscription,Subscriber} from 'rxjs/Rx';
// https://stackoverflow.com/questions/34802210/angular-2-child-component-events-broadcast-to-parent#34807012

/**
 * used to transmit data globally thru out the app!
 */
@Injectable({
providedIn: 'root'
})
export class EventEmitService {
  private events = new Subject();
  subscribe (next,error,complete): any {
    return this.events.subscribe(next,error,complete);
  }
  next (event) {
    this.events.next(event);
  }
}
