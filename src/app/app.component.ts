import { Component, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DynamicDirective } from './utils/dynamic.directive';
import { Page } from './models/page.model';
import { CanvasComponent } from './components/canvas/canvas.component';
import { PageService } from './services/page.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  page!: Page;
  componentRef: any;
  sideNavOpen = false;
  isDarkMode = false;
  @ViewChild(DynamicDirective, { static: true }) canvasDir!: DynamicDirective;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor(public pageService: PageService, public dialog: MatDialog, private renderer: Renderer2) { }
  ngOnInit(): void {
    this.loadComponent();
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  
  }
  loadComponent() {
    this.page = this.pageService.getCurrentPage();
    const viewContainerRef = this.canvasDir.viewContainerRef;
    viewContainerRef.clear();
    this.componentRef = viewContainerRef.createComponent<CanvasComponent>(this.page.component);
    (<any>this.componentRef.instance).page = this.page.info;
    (<any>this.componentRef.instance).mouseDown.subscribe(() => {
      this.sideNavOpen = false;
    });
  }
  prev() {
    let data = (<any>this.componentRef.instance).getPageData();
    this.pageService.prevPage(data);
    this.loadComponent()
  }
  next() {
    let data = (<any>this.componentRef.instance).getPageData();
    this.pageService.nextPage(data);
    this.loadComponent()
  }
  createPage() {
    let data = (<any>this.componentRef.instance).getPageData();
    this.pageService.createEmptyPage(data);
    this.loadComponent()
  }
  opensideNav() {
    this.sideNavOpen = !this.sideNavOpen;
    let data = (<any>this.componentRef.instance).getPageData();
    this.pageService.setPageData(data);
  }
  copyPage(page: Page) {
    this.pageService.copyPage(page);
    this.loadComponent()
  }
  deletePage(pageIndex: number) {
    this.pageService.deletePage(pageIndex);
    this.loadComponent()
  }
  gotoPage(pageIndex: number) {
    this.pageService.gotoPage(pageIndex);
    this.loadComponent()
  }
  changeTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }

}
