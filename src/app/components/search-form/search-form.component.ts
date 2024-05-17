import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EntityService} from "../../services/entity.service";


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent {

  @Input() name: any = "name"
  @Input() entity : any
  @Output() newValue = new EventEmitter<String>()

  value: String = ""
  results : any
  constructor(private entityService: EntityService) {
  }

  ngOnInit(){

  }

  handleSubmit(event: any){
    event.preventDefault()
    if (this.value){
      const data: any = {name: this.name, value: this.value}
      this.newValue.emit(data)
      console.log(data)
    }

  }

    searchProducts(event:any) {
    if (event.target.value.length > 0) {
      this.entityService.searchDatasByPage(this.entity, event.target.value).subscribe(
        (response) => {
          this.results = response;
          console.log(this.results)
        },
        (error) => {
          console.error('Une erreur est survenue :', error);
        }
      );
    } else {
      this.results = [];
    }
  }

  send(event: any){

    const searchBar = document.getElementById('search') as HTMLInputElement;
    searchBar.value = event.target.innerText
    console.log(event.target.innerText)
    // const searchBar = document.getElementById('search');
    // if(searchBar)
    //    searchBar.innerText = "event.target.innerText"
    console.log(event.target.innerText)
    const data: any = {name: this.name, value: event.target.innerText}
    this.newValue.emit(data)

    const table = document.getElementById('tableSearch') as HTMLInputElement;
    table.innerText = ""
  }


}
