import {Component, EventEmitter, Input, Output} from '@angular/core';
import {generateId} from "../../../helpers/utlis";

@Component({
  selector: 'app-option-form',
  templateUrl: './option-form.component.html',
  styleUrls: ['./option-form.component.css']
})
export class OptionFormComponent {

  @Input() options: any;
  @Output() emitOption = new EventEmitter<any>()


  constructor() {
  }

  ngOnInit(){
    this.options = this.options ? this.options: []
  }

  addOption(){
    this.options.push({
      _id: generateId(),
      name: "Nom de l'option",
      values: [
        {
          _id: generateId(),
          name: "valeur de l'option"
        }
      ]
    })
  }

  addOptionValue(optionId: String){
    this.options = this.options.map((option: any)=>{
      if(option._id === optionId){
        console.log(option._id)
        option.values.push({
          _id: generateId(),
          name: "Valeur de l'option"
        })
      }
      return option
    })
  }

  updateOption(event: any, optionId: String){
    const {value} = event.target
    this.options = this.options.map((option: any)=>{
      if(option._id === optionId){
        option.name = value
      }
      return option
    })
    this.emitOption.emit(this.options)
  }

  updateOptionValue(event: any, optionId: String, valueId: String){
  const {value} = event.target
      this.options = this.options.map((option: any)=>{
        if(option._id === optionId){
          option.values = option.values.map((valueItem:any)=>{
            if(valueItem._id === valueId){
              valueItem.name = value
            }
            return valueItem
          })
        }
        return option
      })
      this.emitOption.emit(this.options)

  }


  removeOption(optionId: String){
    this.options = this.options.filter((option: any) => option._id !== optionId)
      this.emitOption.emit(this.options)

  }
  removeOptionValue(optionId: String, valueId: String){
    this.options = this.options.map((option: any) =>{
      if (option._id === optionId){
        option.values = option.values.filter((item: any)=> item._id !== valueId)
      }
      return option
    })
      this.emitOption.emit(this.options)

  }


  protected readonly event = event;
}
