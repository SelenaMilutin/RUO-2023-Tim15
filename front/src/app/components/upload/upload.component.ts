import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  ngOnInit(): void {
  }

  fileName = '';
  selectedFiles: FileList | undefined;

  uploadSuccess : boolean = false;
  uploadTried :  boolean = false;

  constructor(private readonly http: HttpClient, private uploadService: UploadService) {}

  // onFileSelected(event : any) {

  //     const file:File = event.target.files[0];

  //     if (file) {

  //         this.fileName = file.name;

  //         const formData = new FormData();

  //         formData.append("thumbnail", file);

  //         const upload$ = this.http.post("/api/thumbnail-upload", formData);

  //         upload$.subscribe();
  //     }
  // }



  upload() {
    if (this.selectedFiles != undefined ) { 
      const file = this.selectedFiles.item(0); 
      this.uploadSuccess = this.uploadService.uploadFile(file);
      this.uploadTried = true;
    }
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    this.upload()
  }

}
