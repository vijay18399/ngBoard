import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { PageService } from '../services/page.service';
import { MatCardModule } from '@angular/material/card';
import { Page } from '../models/page.model';

@Component({
  selector: 'pages-dialog',
  standalone: true,
  providers: [PageService],
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    CommonModule,
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>Pages</h2>
      <button mat-button color="primary" (click)="createPage()" class="add-page-btn">
      <mat-icon>add</mat-icon>
      Add Page
      </button>
    </div>
    <mat-dialog-content>
      <div class="page-list">
        <div
          class="page"
          *ngFor="let page of data.pages; let i = index"
          (click)="gotoPage(i)"
        >
          <mat-card appearance="outlined" class="page-card">
            <div class="page-content">
              <p class="page-number">{{ i + 1 }}.</p>
              <img
                [src]="page.info.preview"
                alt="Page Preview"
                class="page-preview"
              />
            </div>

            <div class="page-options">
              <mat-icon (click)="copyPage(page)">content_copy</mat-icon>
              <mat-icon color="warn" (click)="deletePage(i)">delete</mat-icon>
            </div>
          </mat-card>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .add-page-btn {
        margin-right: 8px;
      }

      .page-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 10px 0;
      }

      .page {
        cursor: pointer;
      }

      .page-card {
        padding: 0px;
        display: flex;
        border-radius: 12px;
        transition: transform 0.3s, box-shadow 0.3s;
        box-shadow: none;
        width: 100%;
        background: white;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
      }
      .page-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .page-number {
        font-weight: bold;
        margin: 0;
        margin: 0 10px;
      }

      .page-preview {
        width: 80px;
        height: 45px;
        border-radius: 12px;
        object-fit: cover;
        background-color: #ffffff;
        border: 1px solid #00000021;
        margin: 2px;
      }

      .page-options {
        display: flex;
        gap: 8px;
      }
      mat-dialog-content{
        height:100%;
      }
    `,
  ],
})
export class PagesDialogComponent {
  constructor(
    public pageService: PageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PagesDialogComponent>
  ) {}

  createPage() {
    this.data.createPage();
  }

  copyPage(page: Page) {
    this.data.copyPage(page);
  }

  deletePage(index: number) {
    this.data.deletePage(index);
  }

  gotoPage(index: number) {
    this.data.gotoPage(index);
    this.dialogRef.close();
  }
}
