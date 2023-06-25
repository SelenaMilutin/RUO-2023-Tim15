import { Component, Input, OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { UploadRequest } from 'src/app/models/models';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  ngOnInit(): void {
  }

  fileName: string = '';
  fileDescription: string = '';
  selectedFiles: FileList | undefined;
  file: any;

  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = []

  uploadSuccess : boolean = false;
  uploadTried :  boolean = false;

  uploadStatusMessage : string = '';

  @Input()
  currentAlbumName : string = localStorage.getItem('user') + '/' + 'root';

  constructor(private readonly uploadService: UploadService) {}


  async upload() {
    if (this.validateFileName() === false) {
      this.uploadStatusMessage = 'Invalid file name. Cannot be blank. Characters "/" and "-" are not permitted and are replaced with "_".'
      this.transformFileName()
    }
    let owner = localStorage.getItem('user')
    if (owner == undefined) owner = "mico" // for testing

    let fileContent = ''
    try {
      fileContent = await this.readFileAsBase64(this.file);
    } catch {
      this.uploadStatusMessage = "Error. File too large or invalid type."
      return;
    }
    let req : UploadRequest = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ''
      },
      body: {
        fileName: this.fileName,
        fileType: this.file.type,
        fileSize: this.file.size,
        description: this.fileDescription,
        tags: this.tags,
        owner: owner,
        hasAccess: owner,
        albumName: this.currentAlbumName,
        file: fileContent
      }
    }
    console.log(req)
    let res = await this.uploadService.uploadFile(req);
    this.uploadStatusMessage = res.substring(1, res.length - 1);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles != undefined ) { 
      const file = this.selectedFiles.item(0); 
      if (file != undefined)
      {
        this.fileName = file.name;
        this.file = file;
        this.transformFileName();
        this.uploadStatusMessage = ""
        this.fileDescription = ""
        this.tags = []
      }
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

  async readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        console.log(arrayBuffer);
        resolve(arrayBuffer);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}
