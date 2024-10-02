import { Component, Input, Renderer2, ViewChild } from '@angular/core';
import { CanvasComponent } from '../canvas.component';
import { Page } from '../../models/page.model';
import { PageService } from '../../services/page.service';
import { PagesDialogComponent } from '../pages-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'whiteboard-app',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
  providers:[PageService]
})
export class WhiteboardComponent {
  currentPage!: Page;
  sideNavOpen = false;
  exportMenu = false;
  @ViewChild(CanvasComponent) canvasComponent!: CanvasComponent;
  constructor(
    private dialog: MatDialog,
    public pageService: PageService) {}
  ngAfterContentInit(): void {
    this.loadComponent();
  }
  loadComponent() {
    var currentPage = this.pageService.getCurrentPage();
    console.log(currentPage)
    this.currentPage = currentPage;
  }
  createPage() {
    let data = (this.canvasComponent).getPageData();
    this.pageService.createEmptyPage(data);
    this.loadComponent()
  }
  savePage(){
    let data = (this.canvasComponent).getPageData();
    this.pageService.setPageData(data);
  }
  openSideNav() {
    this.savePage()
    this.sideNavOpen = ! this.sideNavOpen;
  }
  copyPage(page: Page) {
    this.pageService.copyPage(page);
    this.loadComponent()
  }
  deletePage(pageIndex?: number) {
    this.pageService.deletePage(pageIndex);
    this.loadComponent()
  }
  gotoPage(pageIndex: any) {
    this.pageService.gotoPage(pageIndex);
    this.loadComponent()
    this.sideNavOpen = false;
  }
  toggleExportMenu(){
    this.exportMenu = !this.exportMenu;
  }

  handleFileInput(imageUrl: string) {
    this.addImage(imageUrl)
  }
  addImage(imageUrl:string){
    (this.canvasComponent).addImage(imageUrl);
  }
  openPagesDialog() {
    this.savePage()
    const dialogRef = this.dialog.open(PagesDialogComponent, {
      maxWidth: '600px',
      maxHeight: '90svh',
      height: '100%',
      width: '90%',
      panelClass: 'page-dialog-modal',
      data: {
        pages: this.pageService.pages,
        copyPage: (page: Page) => this.copyPage(page),
        deletePage: (index: number) => this.deletePage(index),
        createPage: () => this.createPage(),
        gotoPage: (index: number) => this.gotoPage(index),
       }
    });
  }
}
