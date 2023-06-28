import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Album, GalleryFile, UploadRequest } from 'src/app/models/models';
import { Router } from '@angular/router';
import { AlbumsService } from 'src/app/services/gallery/albums.service';
import { DeleteService } from 'src/app/services/gallery/delete.service';
import { ViewService } from 'src/app/services/gallery/view.service';
import { keys } from 'src/environments/keys';
import { of } from 'rxjs';

@Component({
  selector: 'app-gallery-view',
  templateUrl: './gallery-view.component.html',
  styleUrls: ['./gallery-view.component.css']
})
export class GalleryViewComponent implements OnInit {

  files: GalleryFile[] = []
  subAlbums: string[] = []
  albumName: string = localStorage.getItem('username') + '/root'  //TODO
  statusMessage: string = ''
  newAlbumName: string = 'New album name'

  buttons: MyButton[] = []
  albumOptions = []
  selectedAlbum: any

  @Output() albumValueChanged = new EventEmitter<string>();
  onAlbumChange() {
    this.albumValueChanged.emit(this.newAlbumName);
  }

  constructor(private readonly viewService: ViewService, 
    private readonly albumsService: AlbumsService,
    private readonly deleteService: DeleteService,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFiles()
    this.loadSubAlbums()
    this.loadOtherAlbums()
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
    // this.buttons = []
    // try {
    //   let res = await this.albumsService.getSubAlbums(this.albumName);
    //   console.log(res)
    //   if (res.length === 0)  {
    //     this.subAlbums = []; 
    //     return;
    //   }
    //   else this.subAlbums = res.subAlbums
    //   for (let album of this.subAlbums) {
    //     this.buttons.push({label: album, s3Link: album})
    //   }
    // } catch (error) {
    //   console.error('Error loading sub albums: ', error)
    //   this.statusMessage = 'Error loading sub albums.'
    // } 

    console.log(this.albumName)
    const params = {
      sub: this.albumName,
      type: "ALBUM"
    }

    let albums: any = await this.http.post(keys.apiGateway + 'getAlbumsOrFiles', params).toPromise()
    let nextIdx: number = this.albumName.split("\/").length
    console.log(nextIdx)

    this.subAlbums = []

    albums.forEach((album: any) => {
      let fullName: string = album.s3Link
      if (fullName == this.albumName)
        return

      let next: string = this.albumName + "/" + fullName.split("\/")[nextIdx]
      console.log(next)
      this.subAlbums.push(next)
    });

    this.buttons = []
    for (let album of this.subAlbums)
      this.buttons.push({label: album, s3Link: album})

  }

  async clickDelete(file: GalleryFile) {
    const request:UploadRequest = {method: "post",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': ""
        },
      body: {
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          dateCreated: file.dateCreated,
          dateModified: file.dateModified,
          description: file.description,
          tags: file.tags,
          fileOwner: file.fileOwner,
          hasAccess: file.hasAccess,
          s3Name: file.s3Name,
          albumName: file.albumName,
          file: "any"
      }}

    try {
      this.files = await this.deleteService.delete(request);
      alert("Deleted file")
      console.log(this.files)
    } catch (error) {
      console.error('Error loading items: ', error)
      this.statusMessage = 'Error loading files.'
    } 
  }

  clickDownload(file: GalleryFile) {

  }

  edit(file: GalleryFile) {
    console.log(file)
    this.router.navigate(['/edit', file]);
  }

  async deleteAlbum(albumName: string): Promise<void> {

    if (albumName.endsWith("root")) {
      alert("ne moze root da se brise")
      return
    }

    console.log(albumName)

    const params1 = {
      sub: albumName,
      type: "ALBUM"
    }

    const params2 = {
      sub: albumName,
      type: "FILE"
    }

    let albums: any = await this.http.post(keys.apiGateway + 'getAlbumsOrFiles', params1).toPromise()
    let files: any = await this.http.post(keys.apiGateway + 'getAlbumsOrFiles', params2).toPromise()

    console.log(albums)
    console.log(files)

    // files.forEach(async (file: any) => {
    //   await this.clickDelete(file)
    // });

    // albums.forEach(async (album: any) => {
    //   const params = {
    //     s3Link: album.s3Link
    //   }
    //   await this.http.post(keys.apiGateway + 'deleteAlbum', params).toPromise()
    //   console.log("deleted album")
    // })

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
      this.buttons.push({label: this.albumName+'/'+this.newAlbumName, s3Link: this.albumName+'/'+this.newAlbumName})
    } catch (error) {
      this.statusMessage = 'Error creating album.'
    } 
  }

  clickSubAlbum(button: MyButton) {
    this.albumName = button.s3Link
    this.onAlbumChange()
    this.loadFiles()
    this.loadSubAlbums()
  }

  async clickMove(file: GalleryFile) {
    this.statusMessage = ''
    try {
      let res = await this.albumsService.moveFile(file, this.selectedAlbum);
      console.log(res)
      this.statusMessage = res.body
    } catch (error) {
      this.statusMessage = 'Error moving file.'
    } 
  }

  async loadOtherAlbums() {
    try {
      let res = await this.albumsService.getOtherAlbums(this.albumName);
      console.log(res)
      if (res.length === 0)  {
        this.albumOptions = []; 
        return;
      }
      else this.albumOptions = res
      this.selectedAlbum = this.albumOptions[0]
    } catch (error) {
      console.error('Error loading other albums: ', error)
      this.statusMessage = 'Error loading other albums.'
    } 
  }

}

interface MyButton {
    label: string,
    s3Link: string
}