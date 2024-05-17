import { Component, OnDestroy } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {routes} from "../../helpers/route";
import {actions} from "../../helpers/actions";
import {formatToCamelCase} from "../../helpers/utlis";
import {EntityService} from "../../services/entity.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {getEntity, getEntityPorperties} from "../../helpers/helpers";
import { NotificationMode } from 'src/app/models/notification-mode';
import { WebNotificationService } from 'src/app/services/web-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrls: ['./data-manager.component.css']
})
export class DataManagerComponent implements OnDestroy{
  entity: any;
  entityId: any;
  action: any;
  data: any;
  result: any;
  pageName: any;
  entityNamesAll: any;
  routes: Array<any> = routes
  actions: Array<String> = actions
  getDataById$ = new Subscription()

  constructor(private route: ActivatedRoute,
              private routeur: Router,
              private entityService: EntityService,
            private notificationService: WebNotificationService) {}


  ngOnInit(){
    window.scrollTo(0,0)
    const urls = this.route.snapshot.url
    if(urls.length < 2){
      this.routeur.navigate(['/error'])
    }

    if(urls.length == 3){
      this.entity = urls[0]?.path
      this.entityId = urls[1].path
      this.action = urls[2].path
    }
    else if(urls.length == 2){
      this.entity = urls[0]?.path
      this.action = urls[1].path
    }



    const isEntityExist = routes.filter((route:any)=> route.path === "/"+this.entity)
    if(!isEntityExist || !isEntityExist[0]){
      this.routeur.navigate(['/error'])
    }
    if(!this.actions.includes(this.action)){
      this.routeur.navigate(['/error'])
    }

    const routeObject: any = this.routes.filter(route => route.path === "/" + this.entity);
    if (routeObject[0]) {
      let text = ""
      let typeEntity = ""

      switch(this.action){
        case "edit":
          text = "Modification"
          break
        case "add":
          text = "Ajouter"
          break
        case "view":
          text = ""
      }

      switch(routeObject[0]?.single){
        case "Product":
          typeEntity = "du produit"
          break
        case "Category":
          typeEntity = "de la catégorie"
      }


      this.pageName = formatToCamelCase(text)+" "+ typeEntity;
     }

    this.entityNamesAll = getEntityPorperties(this.entity)
    if(["view", "edit"].includes(this.action)){
      this.getDataById()
    }
    else if(this.action == "add"){
      this.data = getEntity(this.entity)
    }
    else if(this.action == "delete"){
      this.entityService.deleteDatasById(this.entity, this.entityId).subscribe({
      next: (value: any)=>{
        let route = "/"+this.entity
        this.routeur.navigate([route]);
        const notif = new NotificationMode()
            const message = "La suppression a été effectué avec success."
            const status = "success"
            this.notificationService.emitNotification({message, status})

    },
      error:( error: any) =>{
      console.log(error())
    }
    })
    }


  }
















  getDataById(){
    this.getDataById$ = this.entityService.getDatasById(this.entity, this.entityId).subscribe({
      next: (value: any)=>{
        this.result = value
        this.data = value[0]

    },
      error:( error: any) =>{
      console.log(error())
    }
    })
  }

  getValue(name: any){
    return this.data[name]
  }


  handelFormChange(data: any){
    const entity: any = this.entity
    let formData: any = {}


     if(data?.files && data?.files?.length){
         console.log(data.files)
       // upload file
       const files = data.files
       delete data.file
       formData = new FormData()
      //  formData.append([entity], JSON.stringify(data))

       //ADD or UPDATE
       files.filter((fileItem: any)=> fileItem.action !== "DELETE").forEach((fileItem: any)=>
       {
         formData.append("file", fileItem.file)
       })

       //DELETE
       const deleteFiles = files.filter((fileItem: any)=> fileItem.action === "DELETE")
         .map((fileItem: any) => fileItem.oldImage)
        // formData.append("deleteFiles", JSON.stringify(deleteFiles))

        for (const img of files) {

          if (img.action === "ADD") {
            data.imageUrls.push(img.imageUrl);
          } else if (img.action === "UPDATE")
          data.imageUrls.push(img.imageUrl);
          if(img.action === "UPDATE" || img.action === "DELETE")
            data.imageUrls = data.imageUrls.filter((url: string) => url !== img.oldImage);
      }



      formData = data
      console.log(formData);

      // delete formData.product.files

     }
     else {
       // Normal
       formData[entity] = data
     }


    console.log(data)
    console.log(formData)
     if (formData)
     {
      if(this.action == "edit"){

        this.entityService.updateData(this.entity, this.entityId, formData).subscribe({
          next: (data:any) =>{
            let route = "/"+entity
            this.routeur.navigate([route]);
            const notif = new NotificationMode()
            const message = "La mise à jour a été effectué avec success."
            const status = "success"
            this.notificationService.emitNotification({message, status})
          },
        error : (error: any)=>{
          const notif = new NotificationMode()
            const message = "Erreur de mise à jour."
            const status = "danger"
            this.notificationService.emitNotification({message, status})
        }
      })
      }
      else if(this.action == "add"){
        this.entityService.addData(this.entity, formData).subscribe({
        next: (value: any) =>{
            let route = "/"+entity
            this.routeur.navigate([route]);
            const notif = new NotificationMode()
            const message = "Ajout effectué avec success."
            const status = "success"
            this.notificationService.emitNotification({message, status})
        }
      })
      }
     }
  }

  ngOnDestroy(): void{
    this.getDataById$.unsubscribe()
  }

}
