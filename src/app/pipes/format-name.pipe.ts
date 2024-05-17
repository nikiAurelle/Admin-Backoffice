import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatName'
})
export class FormatNamePipe implements PipeTransform {


  transform(value: String,): String {
     if (!value) {
      return '';
    }
    if(value === "imageUrls"){
      return "Image"
    }
    if(value === "name")
      return "Nom"
    if(value === "solde_price")
      return "Prix solde"
    if(value === "regular_price")
      return "Prix régulier"
    if(value === "brand")
      return "Marque"
    if(value === "currency")
    return "Devise"
    if(value === "availability")
      return "Disponible"
    if(value === "isBestSeller")
    return "Meilleur vente"
    if(value === "isNewArrival")
    return "Nouveau arrivage"
    if(value === "availability")
    return "Disponible"
    if(value === "isSpecialOffer")
    return "En spécial"


    let newValueArray: any = value.split("_")
    newValueArray = newValueArray.map((name: String)=> value.charAt(0).toUpperCase()+name.slice(1))
    return newValueArray.join(" ");


  }

}
