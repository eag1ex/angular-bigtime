// The service
import 'rxjs/Rx';
import {Injectable,Subject,Subscription,Subscriber} from 'rxjs/Rx';
// https://stackoverflow.com/questions/34802210/angular-2-child-component-events-broadcast-to-parent#34807012

@Injectable();
export class EventEmitService {
  private events = new Subject();
  subscribe (next,error,complete): any {
    return this.events.subscribe(next,error,complete);
  }
  next (event) {
    this.events.next(event);
  }
}
