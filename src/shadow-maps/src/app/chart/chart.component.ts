import { Component, AfterViewInit} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {

  constructor() { }
  width: any;
  height: any;

  margin: any;
  svg: any;

  seasons = [{"season":"Summer"},{"season":"Autumn"},{"season":"Winter"}];
  ngAfterViewInit(): void {
    // Create chart
    let graph = document.querySelector('svg');

    this.width = graph?.clientWidth;
    this.height = graph?.clientHeight;  
    this.margin = {top: 10, right: 20, bottom: 10, left: 65};
    this.svg = d3.select('svg')
      .append('g') 
      .attr('transform', 'translate(' + this.margin.left + ',' + 0 + ')')
      .style("font-size","0.75em");

      var y = d3.scaleBand()
      .domain(this.seasons.map(function(d:any) { return d.season; }))
      .rangeRound([ this.margin.top, this.height -this.margin.bottom ])

      this.svg.selectAll(".barBackground")
      .data(this.seasons)
      .enter().append("rect")
      .attr("class", "barBackground")
      .attr('x',10)
      .attr('y', function(d:any) {return y(d.season)}   )
      .attr("width",  this.width/3 + 2)
      .attr("height", 20)
      .attr("fill", "white")
      .attr("stroke","black")
      .attr("stroke-width","0.5px")
  }
  draw(values: any) {
    this.svg.selectAll(".bar").remove()
    this.svg.selectAll(".right_axis").remove()
    
    var x = d3.scaleLinear()
    .domain([0, 100])
    .range([ 0, this.width/3]);

    var y = d3.scaleBand()
      .domain(values.map(function(d:any) { return d.season; }))
      .rangeRound([  this.margin.top, this.height -this.margin.bottom  ])

    var y_right = d3.scaleBand()
      .domain(values.map(function(d:any) { return d.value.toFixed(0) + "min (" + d.percent.toFixed(0) + "percent)"; }))
      .rangeRound([ this.margin.top, this.height -this.margin.bottom])
   
    function barGraph(season: string) :string {
      switch(season){
        case "Summer":
          return "#e6b855"
        case "Autumn":
          return "  #e65555"
        default:
          return "#85b3d4"
      }
  }
  this.svg.call(d3.axisLeft(y).tickSize(0).tickSizeOuter(0))

  let x_axis_margin = this.width/3 + 10
  this.svg.selectAll(".bar")
  .data(values)
  .enter().append("rect")
  .attr("class", "bar")
  .attr('x', 10)
  .attr('y', function(d:any) {return y(d.season)}   )
  .attr("height", 21)
  .attr("width", function(d:any) {return x(d.percent); } )
  .attr("fill", function(d:any) {return barGraph(d.season)})
  .attr("stroke","black")

  this.svg.append("g").attr("class", "right_axis")
  .attr('transform', 'translate(' +  x_axis_margin + ',' + 0 + ')')
  .style("font-size","1em")
  .call(d3.axisRight(y_right).tickSize(0).tickSizeOuter(0))

  let path_style = document.querySelector('path');
  path_style?.setAttribute("style", "opacity:0")

  let path_style1 = document.querySelector('g.right_axis path.domain');
  path_style1?.setAttribute("style", "opacity:0")

}
updateValues(values: any) {
  // console.log(values);
  this.draw(values);
}
}
