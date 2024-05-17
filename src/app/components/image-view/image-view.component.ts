import {Component, EventEmitter, Input, Output} from '@angular/core';
import {isImage} from "../../helpers/utlis";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.css']
})
export class ImageViewComponent {

  @Input() imageUrls: any
  @Output() emitFile = new EventEmitter<any>()
  imageUrl: any
  files : any
  availableFiles : any
  errorMessage: String = ""
  isUpdating: any = false
  assetsFolderPath: String
  selectedImage: any;


   constructor() {
    this.assetsFolderPath = `${window.location.origin}/assets`;

  }

  ngOnInit(){
     if(this.imageUrls != ""){
       this.selectedImage = environment.apiUrl + "public/images/" + this.imageUrls
       this.emitFile.emit(this.selectedImage);
     }
    console.log(this.imageUrls)
    // this.files = this.imageUrls.map((imageUrl: String)=>{
    //   return{
    //     imageUrl: imageUrl,
    //     oldImage : imageUrl,
    //     action: "OLD"
    //   }
    // })
    // this.updateFile()
  }

  selectImage(event: any) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // accepter uniquement les fichiers image

    // Gérer le changement de fichier sélectionné
    fileInput.addEventListener('change', (event: any) => {
      const file = event.target.files[0];
      if (file) {
        // Convertir le fichier en URL d'objet de données
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedImage = reader.result;
          this.emitFile.emit(this.selectedImage);
        };
      }
    });

    // Cliquez sur le bouton du champ de fichier
    fileInput.click();
  }






  onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedImage = reader.result;
      // Émettre l'image sélectionnée si nécessaire
      this.emitFile.emit(this.selectedImage);
    };
  }
}


  setImageView(url: any){
    if(url){
      this.imageUrl = url
    }
    else {
      this.imageUrl = null
    }
  }

  handleAddFile(event: any){
    const fileInput : any = document.querySelector("#file")
    fileInput.click()
  }
  addFile(event: any){
    const file = event.target.files[0];
    const self = this; // Sauvegardez une référence à 'this'

    if (!isImage(file.name)) {
      this.errorMessage = "Erreur de type de fichier !";
      return;
    }

    this.errorMessage = "";

    if (file) {
      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onerror = (error) => {
        console.error('Une erreur est survenue lors du chargement du fichier:', error);
      };
      console.log(fileReader.onload)

      fileReader.onload = () => { // Utilisez une arrow function ici
        console.log(self.isUpdating);

        if (self.isUpdating) {
          // update
          const url = self.isUpdating;
          self.files = self.files.map((fileItem: any) => {
            if (fileItem.imageUrl === url) {
              if (fileItem.action === "OLD") {
                fileItem.imageUrl = file.name;
                fileItem.file = file;
                fileItem.action = "UPDATE";
              } else {
                fileItem.imageUrl = file.name;
                fileItem.file = file;
              }
            }
            return fileItem;
          });
          self.isUpdating = false;
        } else {
          self.files.push({
            imageUrl: file.name,
            action: "ADD",
            file: file
          });
        }
        self.updateFile();
      };



      console.log(file);
    }
  }


  removeImage(url: String){
    this.files = this.files.map((fileItem: any)=>
    {
      if(fileItem.imageUrl === url){
        if(fileItem.action == "ADD"){
          fileItem.action = "REMOVE"
        }else {
          fileItem.action = "DELETE"
        }

      }
      return fileItem
    })
    this.updateFile()
  }

  updateImage(url: String){
    this.isUpdating = url
    this.handleAddFile(null)
  }

  updateFile(){
    this.files = this.files.filter((fileItem: any) => fileItem.action !== "REMOVE")
    this.availableFiles = this.files.filter((fileItem: any) => fileItem.action !== "DELETE")
    const sendFiles = this.files.filter((fileItem: any) => fileItem.action !== "OLD")
    this.emitFile.emit(sendFiles)
  }


}
