import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {createXYZ} from 'ol/tilegrid';
import RasterSource from 'ol/source/Raster';
import {transform, toLonLat} from 'ol/proj';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit {
  season:string='chi-dec-21'     // default
  mousePosition: any;
  @Output() childToParent = new EventEmitter<any>();  
  // toggle = true;
  // status = 'Enable'; 
  shadow_data: any = [{"season":"Summer", "value": 0, "percent":0}, {"season":"Autumn", "value": 0, "percent":0}, {"season":"Winter", "value": 0, "percent":0}]


  WinterhandleClick() { 
    // this.toggle = !this.toggle;
    // this.status = this.toggle ? 'Enable' : 'Disable';
    this.map.dispose();
    this.season = 'chi-dec-21';
    this.ngAfterViewInit();
  } 
  SummerhandleClick() { 
    this.map.dispose();
    this.season = 'chi-jun-21';
    this.ngAfterViewInit();
  } 
  AutumnhandleClick() { 
    this.map.dispose();
    this.season = 'chi-sep-22';
    this.ngAfterViewInit();
  } 

  // constructor() { }
  map : Map ;
  // @Input() keyword:string;
  ngAfterViewInit(): void {
    // Create map
    let source_season = new RasterSource({
      sources: [
        new XYZ({
        url: `${environment.filesurl}${this.season}/{z}/{x}/{y}.png`,
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
        })
      ],
      operation: function(pixels: any, data: any): any {
        let pixel = [0,0,0,0];
        let val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
                
        return pixel;
      },
    });
    this.map = new Map({  
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        // new ImageLayer({  // shadow layer
        //   source: source,
        //   zIndex: 1,
        // }), // end of layer
      ],
      target: 'ol-map',
      view: new View({
        center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13,
      })
    });

    let layerSummer = new ImageLayer({
      source: source_season,
      zIndex: 0,
    });

    let layerWinter = new ImageLayer({
      source: source_season,
      zIndex: 1,
    });

    let layerAutumn = new ImageLayer({
      source: source_season,
      zIndex: 0,
    });

    this.map.on('pointermove', (evt: any) => {
      this.mousePosition = evt.pixel;
      this.map.render();
    });

    this.map.on('pointermove', (evt: any) => {
      this.mousePosition = evt.pixel;
      this.map.render();
      // console.log(this.mousePosition);
      // this.updateValues();
    });

    layerSummer.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var val_summer = (data[3] /255) * 720;
        this.shadow_data[2].value = val_summer;
        this.shadow_data[2].percent = val_summer * 100/720
        this.updateValues(this.shadow_data);

       }
    });
  
    layerAutumn.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var val_autumn = (data[3] /255) * 540;
        this.shadow_data[1].value = val_autumn;
        this.shadow_data[1].percent = val_autumn * 100/540
        this.updateValues(this.shadow_data);

       }
    });

    layerWinter.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;

      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        var val_winter = (data[3] /255) * 360;
        this.shadow_data[0].value = val_winter;
        this.shadow_data[0].percent = val_winter * 100/360
        this.updateValues(this.shadow_data);

       }
    });
    this.map.addLayer(layerSummer)
    this.map.addLayer(layerAutumn)
    this.map.addLayer(layerWinter)
    
  }

  updateValues(values: any) {
    // Emit new values to chart component
    this.childToParent.emit(values);

  }

}
