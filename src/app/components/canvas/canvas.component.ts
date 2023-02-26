import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fabric } from 'fabric';
import { setCustoms } from 'src/app/brushes/fabric.customs';
import toolConfig from 'src/app/config/tools.config';
import { IconService } from 'src/app/services/icon.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
   colors: string[] = ['#0099D6','#FFE800','#E72853','#EB7418','#783060','#000000'];
   fontFamilies:string[]=['Tahoma','sans-serif','Times New Roman','Courier New','Arial','Helvetica','Lucida Console']
   fontSizes=[10,20,30,40,50,60,80];
  @Input() page: any;
  @Output() mouseDown = new EventEmitter();
  _canvas!: fabric.Canvas;
  loading = true;
  settingMenuOpened: boolean=false;
  activeObject: any = undefined;
  fontFamily: string | undefined;
  zoom: number=1;
  toolConfig = toolConfig;

  constructor(public toolService: ToolService, public iconService: IconService,public dialog: MatDialog) {
  }
  public ngOnInit(): void {

    this.loading = true;
    setTimeout(() => {
      this._canvas = new fabric.Canvas('fabricCanavs', {
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: "white"
      });
      this.toolService.initCanvas(this._canvas);
      setCustoms('#129642',this._canvas)
      this._canvas.on('mouse:down', ()=>{ 
        this.mouseDown.emit() 
        this.settingMenuOpened = false;
      });
      if (this.page.pageData) {
        this._canvas.loadFromJSON(this.page.pageData, this._canvas.renderAll.bind(this._canvas))
        this.loading = false;
      }
      else {
        this.loading = false;
      }
    }, 10);
    console.log(this._canvas)

  }
  public getPageData() {
    return {
      canvasData: this._canvas.toJSON(),
      preview: this._canvas.toDataURL()
    }
  }
  onToolChange(tool: string) {
    this.toolService.updateTool(tool)
  }
  clearAll(){
    this._canvas.clear();
  }
  onZoom(num:number){
    this.zoom = this._canvas.getZoom();
    this.zoom *= 0.999 ** num;
    if (this.zoom > 4) this.zoom = 4;
    if (this.zoom < 1) this.zoom = 1;
    this._canvas.setZoom(this.zoom);
  }
  setOrigin(){
    this._canvas.setZoom(1);
  }
  handleFileInput(event: any) {
    let files = event.target.files;
    const file = files.item(0);
    const reader = new FileReader();
    if(!file){
       return;
    }
    reader.readAsDataURL(file);
    reader.onload = () => {
      let imageUrl = reader.result as string;
      console.log(imageUrl)
      fabric.Image.fromURL(imageUrl, (img) => {
        img.set({
          left: window.innerWidth/4,
          top: window.innerHeight/4,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
          scaleX: 0.25,
          scaleY: 0.25
        });
        this._canvas.add(img);
        this._canvas.setActiveObject(img);
        
        this.toolService.updateTool('selector');
      });

    };
  }
  isBrushActive(){
    return  this.toolConfig.brushes.some(tool=>{ return  tool.code == this.toolService.properties.tool }); 
  }
  isShapeActive(){
    return  this.toolConfig.shapes.some(tool=>{ return  tool.code == this.toolService.properties.tool  }); 
  }
  openSettingMenu(){
    this.settingMenuOpened = !this.settingMenuOpened ;
  }
  updateColor(color: string) {
    this.toolService.updateColor(color)
  }
  updateWidth(width: any) {
    this.toolService.updateWidth(Number(width))
  }
  updateFontFamily(ff:string){
    this.activeObject = this._canvas.getActiveObject();
     if(this.activeObject && this.activeObject.type =='i-text'){
       this.activeObject.set({
         fontFamily : ff
       })
       this._canvas.renderAll();
     }
    this.toolService.updatefontFamily(ff);
   }


}
