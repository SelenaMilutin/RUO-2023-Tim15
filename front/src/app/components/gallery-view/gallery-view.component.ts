import { Component, OnInit } from '@angular/core';
import { GalleryFile } from 'src/app/models/models';
import { ViewService } from 'src/app/services/gallery/view.service';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit {

  files: GalleryFile[] = []
  albumName: string = 'mico/root'
  statusMessage: string = ''

  constructor(private readonly viewService: ViewService) { }

  ngOnInit(): void {
    this.loadFiles()
  }

  async loadFiles() {
    try {
      this.files = await this.viewService.loadFiles(this.albumName);
    } catch (error) {
      console.error('Error loading items: ', error)
      this.statusMessage = 'Error loading files.'
    } 
  }

  clickDelete(file: GalleryFile) {

  }

  clickDownload(file: GalleryFile) {

  }

}
