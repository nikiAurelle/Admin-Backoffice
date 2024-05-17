import { Component } from '@angular/core';
import {routes} from "../../helpers/route";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {

  routes: Array<any> = routes

  constructor() {
  }

  ngOnInit(){

  }
}
