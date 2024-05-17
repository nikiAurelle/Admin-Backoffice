import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { EntityService } from "../../services/entity.service";
import { getEntityPorperties } from "../../helpers/helpers";
import { routes } from "../../helpers/route";
import {query} from "@angular/animations";
import { VoiceRecognitionService } from '../../services/voice-recognition.service'

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']

})
export class ContainerComponent implements OnInit {

  pagePath: String = "";
  pageName: String = "";
  pageNumber: Number = 1;
  pageLimit: Number = 100;
  datas: any;
  result: any;
  entityNames: Array<String> = [];
  entityNamesAll: Array<String> = [];
  isLoading: Boolean = true;
  routes: Array<any> = routes;
  query: String = ""
  displaySelectionBox:Boolean =  false


  constructor(private route: ActivatedRoute, private entityService: EntityService, public service : VoiceRecognitionService) { }

  ngOnInit() {
    this.initComp();

    this.getDatasByPage()


  }

  searchData(data: any){
    console.log(data)
    this.query = ""
    if(data){
      // this.query += data.name + "="+ data.value
      this.query = data.value

    }
    this.getDatasByPage()
    }

    getDatasByPage(){
      if(this.query){
          this.entityService.searchDatasByPage(this.pagePath,this.query,  this.pageNumber, this.pageLimit).subscribe({
          next: (data: any) => {
            if (data) {
              this.isLoading = false;
              this.datas = data;
              this.result = data;
            }
          }, error: (err: any) => {
            console.log(err)
          }
        });
      }
      else {
          this.entityService.getDatasByPage(this.pagePath, this.pageNumber, this.pageLimit).subscribe({
        next: (data: any) => {
          if (data) {
            this.isLoading = false;
            this.datas = data;
            this.result = data;
          }
        }, error: (err: any) => {
          console.log(err)
        }
      });

      }
    }


  getValue(data: any, name: String) {
    const index: any = name;
    return data[index];
  }

  initComp() {
    this.pagePath = this.route.snapshot.url[0]?.path || "product";
    const routeObject: any = this.routes.filter(route => route.path === "/" + this.pagePath);
    if (routeObject[0]) {
      let typeEntity = ""
      switch(routeObject[0]?.single){
        case "Product":
          typeEntity = "Produits"
          break
        case "Category":
          typeEntity = "Catégories"
      }
      this.pageName = typeEntity
    }

    this.entityNamesAll = getEntityPorperties(this.pagePath);

    this.entityNames = [this.entityNamesAll[0], this.entityNamesAll[1], this.entityNamesAll[2], this.entityNamesAll[3],  this.entityNamesAll[4]];
  }

  setDisplaySelectionBox(){
    this.displaySelectionBox = !this.displaySelectionBox;
  }

  setEntityNames(event:any, name:String){
    const {checked} = event.target
    if(checked){
      if(!this.entityNames.includes(name)){
        this.entityNames.push(name)
      }
    }
    else {
      this.entityNames = this.entityNames.filter((entityName: String) =>entityName !== name)
    }
  }



  startService(){
    this.service.start()
  }

  stopService(){
    this.service.stop()
  }
  protected readonly screen = screen;
}
