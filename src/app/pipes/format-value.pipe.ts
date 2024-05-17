import {Pipe, PipeTransform} from '@angular/core';
import {environment} from "../../environments/environment";

@Pipe({
  name: 'formatValue'
})
export class FormatValuePipe implements PipeTransform {


  transform(value: any, args: Array<any>): unknown{
  let newvalue = value
  let name = args[0]
  let data = args[1]
    let type = ""

  if(name == "imageUrls"){

     newvalue = `<img [src]="${environment.apiUrl + "public/images/"} ${value}" alt="image">`;
    console.log(environment.apiUrl + "public/images/" +{value})
  }

  // if(newvalue.length > 50){
  //   newvalue = newvalue.substring(0, 50) + "...";
  // }

  return newvalue
  }
}
