import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'defaultTo'
})
export class DefaultToPipe implements PipeTransform {
  public transform(value: string, defaultValue?: string): string {
    return value ? value : ( defaultValue !== undefined ? defaultValue : '-' );
  }
}
