import {Pipe, PipeTransform} from '@angular/core';

 enum Type{
  INPUT= "INPUT", //champ de saisi
  SELECT = "SELECT", // champ select
  TEXT = "TEXT",// champ de texte
  IMAGE = "IMAGE", //Affichage image
  OPTION = "OPTION",
   SELECT_CATEGORIES = "SELECT_CATEGORIES",
   CURRENCY = "CURRENCY"
}
@Pipe({
  name: 'formatType'
})



export class FormatTypePipe implements PipeTransform {


  transform(name: any, data: any) {
    let type = Type.INPUT
    let selectDatas = ["status", "availability", "isBestSeller", "isNewArrival", "isSpecialOffer", "isFeatured"]
    if(selectDatas.includes(name)){
      type = Type.SELECT
    }

    if(name === "imageUrls"){
      type = Type.IMAGE
    }

     if(name === "options"){
      type = Type.OPTION
    }
     if(name === "currency"){
      type = Type.CURRENCY
    }
      if(name === "categories"){
      type = Type.SELECT_CATEGORIES
    }

    return type

  }

}
