import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {

  @Input() current: number = 1
   @Input() paginateLength: number = 7
  @Input() allCount: number = 5
  @Input() pageLimit: number = 5
  @Input() next: number|null = 2
  @Input() previous: number|null = null

  // items: Array<number|String> []
  min: number = 1
  max: number = 1
  constructor() {}

  ngOnInit(){
    // console.log({current: this.current,
    //   allCount: this.allCount,
    //   pageLimit: this.pageLimit,
    //   next: this.next,
    //   previous: this.previous
    // })
  }

  initPagination(){
    this.min = 1
    this.max = Math.ceil(this.allCount / this.pageLimit)
  }

}
