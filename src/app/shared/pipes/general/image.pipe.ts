import { Pipe, PipeTransform } from '@angular/core';
import {SafeUrl} from "@angular/platform-browser";
import {StorageService} from "@shared/services/general/storage.service";
import {Observable} from "rxjs/index";

@Pipe({
  name: 'nbImage'
})
export class ImagePipe implements PipeTransform {

  constructor(private storageService: StorageService) { }

  transform(url): Observable<SafeUrl> {
    return this.storageService
      .getPicture(url);
  }

}
