import { Injectable, Injector, ComponentFactoryResolver, ApplicationRef, ComponentRef } from '@angular/core';
declare const jsPDF: any;
import { CanvasComponent } from '../components/canvas.component';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class ExportService {

  constructor(
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef
  ) {}

  generateImages(pages: Page[]): Promise<string[]> {
    const imagePromises = pages.map(page => this.createCanvasAndGenerateImage(page));
    return Promise.all(imagePromises);
  }

  private createCanvasAndGenerateImage(page: Page): Promise<string> {
    return new Promise((resolve) => {
      const factory = this.resolver.resolveComponentFactory(CanvasComponent);
      const componentRef = factory.create(this.injector);
      this.appRef.attachView(componentRef.hostView);

      const canvasComponent = componentRef.instance as CanvasComponent;
      canvasComponent.page = page.info;
      canvasComponent.initFabricCanvas(() => {
        const imgData = canvasComponent._canvas.toDataURL('image/png');
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        resolve(imgData);
      })

    });
  }

  async downloadAsImages(pages: Page[]) {
    const images = await this.generateImages(pages);
    images.forEach((imgData, index) => {
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `canvas_page_${index + 1}.png`;
      a.click();
    });
  }

  async downloadAsPDF(pages: Page[]) {
    const pdf = new jsPDF();
    const images = await this.generateImages(pages);

    images.forEach((imgData, index) => {
      if (index > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    });

    pdf.save(`canvas_pages_${Date.now()}.pdf`);
  }
}
