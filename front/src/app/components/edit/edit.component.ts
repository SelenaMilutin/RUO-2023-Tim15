import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

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

  constructor() { }

  ngOnInit(): void {
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
