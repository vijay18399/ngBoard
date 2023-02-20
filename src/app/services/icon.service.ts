import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(private matIconRegistry: MatIconRegistry,private domSanitizer: DomSanitizer) { 
    this.matIconRegistry.addSvgIcon(
        "pan",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/pan.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "selector",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/selector.svg")
      ); 
      this.matIconRegistry.addSvgIcon(
        "pointer",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/pointer.svg")
      ); 
      this.matIconRegistry.addSvgIcon(
        "pencil",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/pencil.svg")
      ); 
      this.matIconRegistry.addSvgIcon(
        "settings",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/settings.svg")
      ); 
      this.matIconRegistry.addSvgIcon(
        "text",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/text.svg")
      ); 
      
  }
}