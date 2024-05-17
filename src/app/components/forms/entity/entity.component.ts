import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup} from "@angular/forms";
import {EntityService} from "../../../services/entity.service";
import {lastValueFrom} from "rxjs";
import * as $ from 'jquery';
import 'select2';
import { WebNotificationService } from 'src/app/services/web-notification.service';
import { NotificationMode } from 'src/app/models/notification-mode';
import {actions} from "../../../helpers/actions";

// @ts-ignore
@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent {

  //on récupère les arguments
  @Input() entityNames: Array<string> = []
  @Input() data : any;
  @Input() action : any;
  @Input() entity: any
  form: any;
  formData: any = {}
  categories: any
  categoriesSelected: any
  categoriesView :any
  files: any
  invalidInput: boolean = true;
  messageError: any
  @Output() formEmit = new EventEmitter<any>()
  btn: String = ""


  constructor(private fb: FormBuilder,
              private entityService: EntityService,
              private notificationService: WebNotificationService) {
  }

  async ngOnInit(){
    console.log(this.data)
    this.entityNames = this.entityNames.filter((name:String) =>{
      return !(name === 'created_at' || name === "updated_at");
    })

    if(this.entityNames.includes("categories")){


      this.categories = await lastValueFrom(this.entityService.getDatas("category"))
      // this.categories = data
        // this.categories = data.results
      this.categoriesSelected = this.categories
      this.categoriesView = this.data.categories

    }
    this.initForm()

    this.initSelect()
  }

  initForm(){
    if(this.action == 'edit')
      this.btn = "Modifier"
    else if(this.action == 'add')
      this.btn = "Ajouter"
    let formObject = {}
    this.entityNames.forEach((name: any) =>{

      const value = this.data[name]
      // const value = this.data[0][name]

      formObject = {...formObject, [name]: this.fb.control(value,[Validators.required])}
    })
    this.form = this.fb.group(formObject)
  }

  initSelect(){
    const self = this
    $(function (){
      $('.select-categories').select2();
      $('.single-select').select2();
      $('.select-categories').on('select2:select', function (event: any){
        // @ts-ignore
        const values = $(this).val(); // Utilisez $(this) pour faire référence à l'élément actuel
        self.formData["categories"] = values;
      });
      $('.select-categories').on('select2:unselect', function (event: any){
        // @ts-ignore
        const values = $(this).val();
        self.formData["categories"] = values;
      });
       $('.single-select').on('select2:select', function (event: any){
         const {name, value} = event.target
         self.formData[name] = value
      });
    });
  }
  handelSubmit(){

    this.initSelect()

    this.formData = this.form.value;
    this.formData["categories"] = $('.select-categories').val(); // Ajoutez les catégories sélectionnées à formData


    this.formData = this.form.value
    this.formData["imageUrls"] = this.files

    let data;
    const donnes = this.form.value
    if(donnes.name.trim() == "") {
          const notif = new NotificationMode()
          const message = "Le champ nom est requis."
          const status = "danger"
          this.notificationService.emitNotification({message, status})
          this.invalidInput = false
        }
        if(donnes.description.trim()  == "") {
          const notif = new NotificationMode()
          const message = "Le champ description est requis."
          const status = "danger"
          this.notificationService.emitNotification({message, status})
          this.invalidInput = false

        }
     if(this.entity == "product"){

        // if(!this.estEntier(donnes.stock)) {
        //   const notif = new NotificationMode()
        //   const message = "Le champ stock est invalid."
        //   const status = "danger"
        //   this.notificationService.emitNotification({message, status})
        //   this.invalidInput = false
        // }
        // if(!this.estDouble(donnes.regular_price) || !this.estEntier(donnes.regular_price)) {
        //   const notif = new NotificationMode()
        //   const message = "Le champ prix régulier est invalid."
        //   const status = "danger"
        //   this.notificationService.emitNotification({message, status})

        //   this.invalidInput = false
        // }


        if (!donnes.imageUrls ) {
          const notif = new NotificationMode()
          const message = "Au moins une image est requise."
          const status = "danger"
          this.notificationService.emitNotification({message, status})
          this.invalidInput = false
        }
     }




    Object.keys(this.formData).forEach(key => {
      if (typeof this.formData[key] === 'string' && (this.formData[key] === 'true' || this.formData[key] === 'false')) {
          this.formData[key] = this.convetirEnBoolean(this.formData[key]);
      }

      if(key === 'regular_price' || key === "solde_price")
        this.formData[key] = parseFloat(this.formData[key]);

      if(key === "stock")
        this.formData[key] = parseInt(this.formData[key]);
  });


    if(this.invalidInput){
      data = {...this.form.value, ...this.formData}
      if(this.files?.length){
        data["files"] = this.files
      }
      // ... destructure

      this.formData["image"] = this.files
      console.log(this.formData)

      this.formEmit.emit(this.formData)
    }

    this.invalidInput = true

  }

  handelOption(data: any){
    this.formData["options"] = data
    console.log(this.formData)
  }

  handleChangeFile(files: any){
    this.formData["image"] = files
    this.files = files
  }

  estEntier(element: any) {
    return /^-?[0-9]+$/.test(element.toString());
}

estDouble(element: any) {
    return /^-?[0-9]+(\.[0-9]+)?$/.test(element.toString());
}


  convetirEnBoolean(value: String){
    return Boolean(value)
  }

}
