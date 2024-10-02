import { CanvasComponent } from "./components/canvas.component";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from "./app-routing.module";
import { WhiteboardComponent } from './components/whiteboard/whiteboard.component';
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./pages/home/home.component";
import { CommonModule } from "@angular/common";
import { PagesDialogComponent } from "./components/pages-dialog.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActionControlsComponent } from "./components/action-controls.component";
import { ToolBarComponent } from "./components/tool-bar/tool-bar.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        WhiteboardComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        CommonModule,
        ActionControlsComponent,
        ToolBarComponent,
        CanvasComponent,
        PagesDialogComponent,
        MatTooltipModule,
        BrowserAnimationsModule
    ],
    providers: [
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }

