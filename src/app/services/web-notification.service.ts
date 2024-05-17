import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationMode } from '../models/notification-mode';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {

  notif = new NotificationMode()
  notification$ = new BehaviorSubject<NotificationMode>(this.notif)

  constructor() { }

  emitNotification(notification: any){
    const notif = new NotificationMode()
    notif.message = notification?.message ? notification?.message : notif.message
    notif.status = notification?.status ? notification?.status : notif.status
    notif.title = notification?.title ? notification?.title : notif.title
    notif.timeOut = notification?.timeOut ? notification?.timeOut : notif.timeOut

    this.notification$.next(notif)
  }
}
