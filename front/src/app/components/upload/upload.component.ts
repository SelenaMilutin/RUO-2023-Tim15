import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  ngOnInit(): void {
  }

  fileName: string | undefined = '';
  selectedFiles: FileList | undefined;

  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = []

  uploadSuccess : boolean = false;
  uploadTried :  boolean = false;

  uploadStatusMessage : string = '';

  @Input()
  currentAlbumName : string = localStorage.getItem('user') + '-' + 'root';

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
    if (this.validateFileName() === false) {
      this.uploadStatusMessage = 'Invalid file name. Cannot be blank. Characters "/" and "-" are not permitted and are replaced with "_".'
      this.transformFileName()
    }
    // this.uploadSuccess = this.uploadService.uploadFile(file, this.currentAlbumName);
    // this.uploadTried = true;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles != undefined ) { 
      const file = this.selectedFiles.item(0); 
      this.fileName = file?.name;
      this.transformFileName();
    }
  }

  removeTag(t: string): void {
    const index = this.tags.indexOf(t);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }

    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  transformFileName() {
    this.fileName = this.fileName?.split("/").join("_")
    this.fileName = this.fileName?.split("-").join("_")
  }

  validateFileName(): boolean {
    if (this.fileName === "" || this.fileName?.includes('/') || this.fileName?.includes('-')) return false;
    return true;
  }


}
