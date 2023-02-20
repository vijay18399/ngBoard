import { Component, Input } from '@angular/core';
import { fabric } from 'fabric';
import { IconService } from 'src/app/services/icon.service';
import { ToolService } from 'src/app/services/tool.service';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  @Input() page: any;
  _canvas!: fabric.Canvas;
  loading = true;
  constructor(public toolService: ToolService, public iconService:IconService) {
  }
  public ngOnInit(): void {
    this.loading = true;
    setTimeout(()=>{
      this._canvas = new fabric.Canvas('fabricCanavs', {
        width: window.innerWidth,
        height: window.innerHeight,
        isDrawingMode: true,
        backgroundColor:"white"
      });
      if(this.page.pageData){
        this._canvas.loadFromJSON(this.page.pageData,(done:any)=>{
         this.loading = false;
        })
     }
     else{
       this.loading = false;
     }
    },10);
    console.log(this._canvas)

  }
  public getPageData(){
   return {
     canvasData: this._canvas.toJSON(),
     preview : this._canvas.toDataURL()
   }
  }
}
