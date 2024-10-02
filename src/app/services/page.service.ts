import { Injectable } from '@angular/core';
import { Page } from '../models/page.model';
import * as _ from 'lodash';

@Injectable()
export class PageService {
  private readonly storage: Storage;
  pages: Page[] = [];
  currentIndex: number = 0;

  constructor() {
    this.storage = window.localStorage;
    const pageServiceData = this.storage.getItem('pageServiceData');

    if (pageServiceData) {
      const pageData = JSON.parse(pageServiceData);
      this.pages = pageData.pages;
      this.currentIndex = pageData.currentIndex;
    } else {
      this.createEmptyPage();
    }
  }

  createEmptyPage(data: any = null) {
    if (data) this.setPageData(data);

    const newPage = new Page({
      id: Date.now(),
      pageData: null,
      preview: '../assets/white.png',
    });

    this.pages.push(newPage);
    this.setIndex();
  }

  getCurrentPage(): Page {
    return this.pages[this.currentIndex];
  }

  setIndex() {
    this.currentIndex = this.pages.length - 1;
    this.savePage();
  }

  gotoPage(index: number) {
    if (index >= 0 && index < this.pages.length) {
      this.currentIndex = index;
      this.savePage();
    }
  }

  setPageData(data: any) {
    if (data) {
      _.assign(this.pages[this.currentIndex].info, {
        pageData: data.canvasData,
        preview: data.preview,
      });
      this.savePage();
    }
  }

  copyPage(page: Page) {
    const pageClone = _.cloneDeep(page);
    pageClone.info.id = Date.now();
    this.pages.push(pageClone);
    this.setIndex();
  }

  savePage() {
    const pageData = {
      pages: this.pages,
      currentIndex: this.currentIndex,
    };
    this.storage.setItem('pageServiceData', JSON.stringify(pageData));
  }

  deletePage(pageIndex: number = this.currentIndex) {
    this.pages.splice(pageIndex, 1);
    if (this.pages.length === 0) {
      this.createEmptyPage();
    } else if (this.currentIndex >= this.pages.length) {
      this.setIndex();
    }
    this.savePage();
  }
}
