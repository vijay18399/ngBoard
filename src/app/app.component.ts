import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { DynamicDirective } from './utils/dynamic.directive';
import { Page } from './models/page.model';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PageService } from './services/page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  page!:Page;
  componentRef : any;
  @ViewChild(DynamicDirective, { static: true }) canvasDir!: DynamicDirective;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(public pageService:PageService) {
 
  }

  ngOnInit(): void {
    this.loadComponent()
  }
  loadComponent() {
    this.page = this.pageService.getCurrentPage();
    console.log(this.canvasDir)
    const viewContainerRef = this.canvasDir.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent<CanvasComponent>(this.page.component);
    (<any>this.componentRef.instance).page =   this.page.info;
  }
  prev(){
    let data =  (<any>this.componentRef.instance).getPageData();
    this.pageService.prevPage(data);
    this.loadComponent()
  }
  next(){
    let data =  (<any>this.componentRef.instance).getPageData();
    this.pageService.nextPage(data);
    this.loadComponent()
  }
  createPage(){
    let data =  (<any>this.componentRef.instance).getPageData();
    this.pageService.createEmptyPage(data);
    this.loadComponent()
  }
  opensideNav(){
    let data =  (<any>this.componentRef.instance).getPageData();
    this.pageService.setPageData(data);
    this.sidenav.toggle();
  }
  copyPage(page:Page){
    this.pageService.copyPage(page);
    this.loadComponent()
  }
  deletePage(pageIndex:number){
    this.pageService.deletePage(pageIndex);
    this.loadComponent()
  }
  gotoPage(pageIndex:number){
    this.pageService.gotoPage(pageIndex);
    this.loadComponent()
  }
}
