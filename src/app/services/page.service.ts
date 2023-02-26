import { Injectable } from '@angular/core';
import { CanvasComponent } from '../components/canvas/canvas.component';
import { Page } from '../models/page.model';
import * as _ from "lodash";
import * as R from 'ramda'
import { Subject } from 'rxjs';
@Injectable()
export class PageService {

  pages: Page[] = [];
  currentIndex! :number;
  constructor(){
    this.createEmptyPage(null);
  }
  createEmptyPage(data:any){
    if(data){
      this.setPageData(data)
    }
    let page = new Page(CanvasComponent, {  id: Date.now(), pageData: null,  preview: 'assets/white.png' })
    this.pages.push(page)
    this.setIndex();
  }
  getCurrentPage(){
    return this.pages[this.currentIndex];
  }
  setIndex(){
   this.currentIndex = this.pages.length-1;
  }
  nextPage(data:any){
    if(data){
      this.setPageData(data)
    }
    this.currentIndex++;
  }
  prevPage(data:any){
    if(data){
      this.setPageData(data)
    }
    this.currentIndex--;
  }
  gotoPage(index: number){
    this.currentIndex = index;
  }
  setPageData(data:any){
     this.pages[this.currentIndex].info.pageData = data.canvasData;
     this.pages[this.currentIndex].info.preview = data.preview;
  }
  copyPage(page:Page){
    let pageClone = R.clone(page);
    pageClone.info.id = Date.now();
    this.pages.push(pageClone);
    this.setIndex();
  }
  deletePage(pageIndex:number){
    this.pages.splice(pageIndex, 1);
    this.setIndex();
    if(this.pages.length ==0){
      this.createEmptyPage(null);
    }
  }

}
