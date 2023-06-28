import { Component, OnInit } from '@angular/core';
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
  subAlbums: Album[] = []
  albumName: string = 'mico/root'  //TODO
  statusMessage: string = ''
  newAlbumName: string = 'New album name'

  buttons = [
    { label: 'Button 1', s3link: ''},
    { label: 'Button 2', s3link: 'settings' },
    { label: 'Button 3', s3link: 'account_circle' },
  ];

  constructor(private readonly viewService: ViewService, 
    private readonly albumsService: AlbumsService) { }

  ngOnInit(): void {
    this.loadFiles()
    //this.loadSubAlbums()
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
    try {
      this.subAlbums = await this.albumsService.getSubAlbums(this.albumName);
      console.log(this.subAlbums)
      for (let album of this.subAlbums) {
        this.buttons.push({label: album.albumName, s3link: album.s3Link})
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
    } catch (error) {
      console.error('Error creating album: ', error)
      this.statusMessage = 'Error creating album.'
    } 
  }

}
