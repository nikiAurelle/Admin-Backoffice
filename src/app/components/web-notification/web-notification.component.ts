import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { generateId } from 'src/app/helpers/utlis';
import { NotificationMode } from 'src/app/models/notification-mode';
import { WebNotificationService } from 'src/app/services/web-notification.service';

@Component({
  selector: 'app-web-notification',
  templateUrl: './web-notification.component.html',
  styleUrls: ['./web-notification.component.css']
})
export class WebNotificationComponent implements OnDestroy{

  constructor(private notificationService :  WebNotificationService){}

  notifications : Array<NotificationMode> = []
  subscribes$ = new Subscription()
  ngOnInit(){
    this.subscribes$ =  this.notificationService.notification$.subscribe({
      next: (notification : NotificationMode) =>{
        notification._id = generateId()
        if(notification?.message){
          this.notifications.push(notification)
          const timeOut: any = notification.timeOut
          setTimeout(() =>{
            this.notifications = this.notifications.filter((notif : NotificationMode)=>{
              notif._id !== notification._id
            })
          },timeOut)
        }

      }
    })
  }
  closeNotif(id: String){
    this.notifications = this.notifications.filter((notif : NotificationMode)=>{
      notif._id !== id
    })
  }

  ngOnDestroy(): void {
    this.subscribes$.unsubscribe()
  }
}
