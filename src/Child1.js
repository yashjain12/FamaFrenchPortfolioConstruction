import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  
  state = {
  };

  componentDidMount() {
    this.chart()
  }

  componentDidUpdate() {
    this.chart()
  }
  chart() {
    const data = this.props.csv_data;

    const margin = { top: 20, right: 150, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(".child1").selectAll("svg").data([0]).join("svg").attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg.selectAll("g").data([0]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`)
    const keys = Object.keys(data[0]).filter((key) => key !== "Date");
    const stack = d3.stack().keys(keys).offset(d3.stackOffsetSilhouette);
    const stackedSeries = stack(data);

    const y_min = d3.min(stackedSeries, layer =>
        d3.min(layer, d => d[0])
      );
      
      const y_max = d3.max(stackedSeries, layer =>
        d3.max(layer, d => d[1]) 
      );

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Date))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([y_min, y_max])
      .range([height, 0]);

    const colors = d3.scaleOrdinal()
      .domain(["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"])
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    const areaGen = d3.area().x((d) => xScale(d.data.Date))
      .y0((d) => yScale(d[0])).y1((d) => yScale(d[1]))
      .curve(d3.curveCatmullRom);

      g.selectAll(".area").data(stackedSeries).join("path").attr("class", "area").attr("d", d => areaGen(d)).attr("fill", d => colors(d.key))
      .on("mouseenter", function (event, d) {

        tooltip.style("display", "block")
          const title = d.key;
          const dataBar = data.map(row => ({Date: row.Date, Value: row[title]}))
  
          const widthBar = 300, heightBar = 150;
          const svgBar = tooltip.selectAll("svg").join("svg").data([0]).join("svg").attr("width", widthBar + 50).attr("height", heightBar + 30)
          .style("overflow", "visible")
  
          const xBar = d3.scaleBand()
          .domain(dataBar.map(d => d.Date))
          .range([0, widthBar])
          .padding(0.1);
  
          const yBar = d3.scaleLinear().domain([0, d3.max(dataBar, d => d.Value)])
          .range([heightBar, 0])
  
          svgBar.selectAll("rect").data(dataBar).join("rect").attr("x", d => xBar(d.Date) + 35).attr("y", d => yBar(d.Value))
          .attr("width", xBar.bandwidth()).attr("height", d => heightBar - yBar(d.Value))
          .attr("transform", `translate(0, 15)`)
          .transition().duration(600).attr("fill", colors(title))
          
          svgBar.selectAll(".x-axis").data([0]).join("g").attr("class", "x-axis")
          .attr("transform", `translate(35, ${15 + heightBar})`).call(d3.axisBottom(xBar).tickFormat(d3.timeFormat("%b")))
  
          svgBar.selectAll(".y-axis").data([0]).join("g").attr("class", "y-axis").attr("transform", `translate(35, 15)`)
          .call(d3.axisLeft(yBar))
      }).on("mousemove", function (event) {
        tooltip.style("left", `${event.pageX - 150}px`).style("top", `${event.pageY + 10}px`);
      })
      .on("mouseleave", function () {
        tooltip.style("display", "none");
      });
  
    g.selectAll(".x-axis")
      .data([0])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")));

    const legend = svg
      .selectAll(".legend")
      .data([0])
      .join("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 100}, ${height/2 - margin.top - margin.bottom})`);

    legend
      .selectAll("rect").data(keys).join("rect").attr("x", 0).attr("y", (d, i) => i * 30)
      .attr("width", 25).attr("height", 25).attr("fill", d => colors(d));
    
    legend
      .selectAll("text").data(keys).join("text").attr("x", 30)
      .attr("y", (d, i) => i * 30 + 15).text(d => d).style("font-size", "12px").attr("font-family", "sans-serif");

      const tooltip = d3.select(".child1").selectAll(".tooltip").data([0]).join("div").attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#d3d3d3")
    .style("padding", "10px")
    .style("border-radius", "3px")
    .style("display", "none")

}

  render() {
    return (
      <div className="child1">
      </div>
    );
  }
}

export default Child1;
