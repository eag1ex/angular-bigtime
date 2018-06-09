
// The service
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Subject, Subscription, Subscriber } from 'rxjs/Rx';
import { MyGlobals } from '../../_shared/myglobals';
/**
 * used to transmit data globally thru out the app!
 */
@Injectable({
  providedIn: 'root'
})
export class EventEmitService {
  private events = new Subject();
  public _globals: MyGlobals;
  constructor() {

  }

  subscribe(next, error, complete, globs: MyGlobals & any = false): any {
    this._globals = this._globals || globs
    return this.events.subscribe(next, error, complete);
  }
  next(event, SubscriberName: any = false, subscriptionsArray: Array<any> = []) {

    if (SubscriberName === 'unsubscribe') {
      subscriptionsArray.map((itemSubscription, inx) => {
        var subscriptionExists = this._globals.glob[itemSubscription];
        if (subscriptionExists) subscriptionExists.unsubscribe();
      })
      return;
    }

    this.events.next(event);

    // unsubscribe from old
    setTimeout(() => {
      if (SubscriberName) {
        var subscriptionExists = this._globals.glob[SubscriberName];
        if (subscriptionExists) {
          subscriptionExists.unsubscribe();
          //  console.log(`-- unsubscribed from ${SubscriberName}`)
        }
      }
    }, 500)
  }
}
