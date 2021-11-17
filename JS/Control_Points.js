// !preview r2d3 data=c(0.3, 0.6, 0.8, 0.95, 0.40, 0.20)
//
// r2d3: https://rstudio.github.io/r2d3
//



radius = 32;

  const circles = d3.range(4).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
  }));

  svg.selectAll("circle")
    .data(circles)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.update drag.update end.update", update));



  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event, d) {
    d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
  }

  function update() {

  }
