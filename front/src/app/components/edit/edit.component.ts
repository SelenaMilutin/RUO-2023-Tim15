import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { GalleryFile } from 'src/app/models/models';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  fileName: string = '';
  fileDescription: string = '';

  tagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = []

  file: GalleryFile | null = null

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      this.file = params
      console.log(this.file)
      this.fileName = this.file!.fileName
      this.fileDescription = this.file!.description
      this.tags = this.file!.tags
    });
  }

  edit(): void {

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

}
