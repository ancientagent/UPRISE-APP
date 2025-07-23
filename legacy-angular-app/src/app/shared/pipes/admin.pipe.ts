import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class AdminPipe implements PipeTransform {

  transform(duration: any) {
    var m: any = Math.floor((duration % 3600) / 60)
      .toString()
      .padStart(2, "0");
    var s: any = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");

    return m + ":" + s;
  }

}
