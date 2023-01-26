import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import View from 'ol/View.js';
import XYZ from 'ol/source/XYZ.js';
import {createXYZ} from 'ol/tilegrid';
import {transform, toLonLat} from 'ol/proj';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  // constructor() { }
  map : Map ;
  ngOnInit(): void {
  this.map = new Map({
    layers: [
      new TileLayer({
        source: new OSM()
  //     }),
  //     new ImageLayer({  // shadow layer
  //       source: new XYZ({
  //  // end of source    
      }), // end of layer
    ],
    target: 'ol-map',
    view: new View({
      center: transform([0, 0], 'EPSG:4326', 'EPSG:3857'),
      zoom: 2
    })
  });  
}}


