import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Album, GalleryFile } from 'src/app/models/models';
import { AlbumsService } from 'src/app/services/gallery/albums.service';
import { ViewService } from 'src/app/services/gallery/view.service';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit {

  files: GalleryFile[] = []
  subAlbums = []
  albumName: string = 'mico/root'  //TODO
  statusMessage: string = ''
  newAlbumName: string = 'New album name'

  buttons: MyButton[] = [];

  @Output() albumValueChanged = new EventEmitter<string>();
  onAlbumChange() {
    this.albumValueChanged.emit(this.newAlbumName);
  }

  constructor(private readonly viewService: ViewService, 
    private readonly albumsService: AlbumsService) { }

  ngOnInit(): void {
    this.loadFiles()
    this.loadSubAlbums()
  }

  async loadFiles() {
    try {
      this.files = await this.viewService.loadFiles(this.albumName);
      this.files.sort((a, b) => {
        const dateA = new Date(a.dateCreated);
        const dateB = new Date(b.dateCreated);
        return dateB.getTime() - dateA.getTime();
      })
      console.log(this.files)
    } catch (error) {
      console.error('Error loading items: ', error)
      this.statusMessage = 'Error loading files.'
    } 
  }

  async loadSubAlbums() {
    this.buttons = []
    try {
      let res = await this.albumsService.getSubAlbums(this.albumName);
      console.log(res)
      if (res.length === 0)  {
        this.subAlbums = []; 
        return;
      }
      else this.subAlbums = res.subAlbums
      for (let album of this.subAlbums) {
        this.buttons.push({label: album, s3Link: album})
      }
    } catch (error) {
      console.error('Error loading sub albums: ', error)
      this.statusMessage = 'Error loading sub albums.'
    } 
  }

  clickDelete(file: GalleryFile) {

  }

  clickDownload(file: GalleryFile) {

  }

  async clickAddAlbum() {
    this.statusMessage = ''
    try {
      if (this.newAlbumName.includes('/')) {
        this.statusMessage = 'Album name cannot contain "/".'
        return
      }
      await this.albumsService.createAlbum(this.albumName, this.newAlbumName);
      this.statusMessage = 'Created album.'
      this.buttons.push({label: this.newAlbumName+'/'+this.newAlbumName, s3Link: this.albumName+'/'+this.newAlbumName})
    } catch (error) {
      console.error('Error creating album: ', error)
      this.statusMessage = 'Error creating album.'
    } 
  }

  clickSubAlbum(button: MyButton) {
    this.albumName = button.s3Link
    this.onAlbumChange()
    this.loadFiles()
    this.loadSubAlbums()
  }

}

interface MyButton {
    label: string,
    s3Link: string
}