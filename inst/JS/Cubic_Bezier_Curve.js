// !preview r2d3 data=c(0.3, 0.6, 0.8)
//
// r2d3: https://rstudio.github.io/r2d3
//

  const radius = 6;
  var midpoints;
  var paths;
  var midlines;
  var circles = d3.range(4).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
    t: 0.3,
  }));

  if(data.length >= 4){
    circles = data;
  }

  function get_midpoints(){
    var t = circles[0].t;
    var p00 = {x: (1 - t) * circles[0].x + t * circles[1].x, y: (1 - t) * circles[0].y + t * circles[1].y};
    var p01 = {x: (1 - t) * circles[1].x + t * circles[2].x, y: (1 - t) * circles[1].y + t * circles[2].y};
    var p02 = {x: (1 - t) * circles[2].x + t * circles[3].x, y: (1 - t) * circles[2].y + t * circles[3].y};
    var p10 = {x: (1 - t) *  p00.x + t * p01.x, y: (1 - t) *  p00.y + t * p01.y};
    var p11 = {x: (1 - t) *  p01.x + t * p02.x, y: (1 - t) *  p01.y + t * p02.y};
    var p20 = {x: (1 - t) *  p10.x + t * p11.x, y: (1 - t) *  p10.y + t * p11.y};
    midpoints = [p00, p01, p02, p10, p11, p20];
  }

  function get_midlines(){
    var line0 = d3.path();
    var line1 = d3.path();
    var line2 = d3.path();
    line0.moveTo(midpoints[3].x, midpoints[3].y);
    line0.lineTo(midpoints[4].x, midpoints[4].y);
    line1.moveTo(midpoints[0].x, midpoints[0].y);
    line1.lineTo(midpoints[1].x, midpoints[1].y);
    line2.moveTo(midpoints[1].x, midpoints[1].y);
    line2.lineTo(midpoints[2].x, midpoints[2].y);
    midlines = [line0, line1, line2];
  }

  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event, d) {
    d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
    Shiny.setInputValue(
        "circle_clicked",
        circles,
        {priority: "event"}
        );
  }

  function update() {
    get_lines();
    svg.select("#bezier").selectAll("path")
        .data(paths)
        .attr('d', d => d);
    get_midpoints();
    get_midlines();
    svg.select("#decasteljau").selectAll("circle")
        .data(midpoints)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    svg.select("#decasteljau").selectAll("path")
        .data(midlines)
        .attr('d', d => d);
  }


  function get_lines(){
    var path = d3.path();
    path.moveTo(circles[0].x, circles[0].y);
    path.bezierCurveTo(circles[1].x, circles[1].y,circles[2].x, circles[2].y, circles[3].x, circles[3].y);
    var line0 = d3.path();
    var line1 = d3.path();
    var line2 = d3.path();
    line0.moveTo(circles[0].x, circles[0].y);
    line0.lineTo(circles[1].x, circles[1].y);
    line1.moveTo(circles[1].x, circles[1].y);
    line1.lineTo(circles[2].x, circles[2].y);
    line2.moveTo(circles[2].x, circles[2].y);
    line2.lineTo(circles[3].x, circles[3].y);
    paths = [path, line0, line1, line2];
  }


  get_lines();
  get_midpoints();
  get_midlines();

  svg.append("g")
      .attr("id","bezier")

    svg.append("g")
      .attr("id","decasteljau")

  svg.select("#bezier").selectAll("path")
    .data(paths)
    .join("path")
    .attr('d', d => d)
    .attr('stroke', d3.schemeCategory10[4])
    .attr('stroke-width', '2.5px')
    // with multiple points defined, if you leave out fill:none,
    // the overlapping space defined by the points is filled with
    // the default value of 'black'
    .attr('fill', 'none');

  svg.select("#bezier").select("path")
    .attr('stroke', 'black')

  svg.select("#decasteljau").selectAll("path")
    .data(midlines)
    .join("path")
    .attr('d', d => d)
    .attr('stroke', d3.schemeCategory10[1])
    .attr('stroke-width', '2.5px')
    .attr('fill', 'none');

  svg.select("#decasteljau").select("path")
    .attr('stroke', d3.schemeCategory10[3])

  var decasteljau_points = svg.select("#decasteljau").selectAll("circle")
    .data(midpoints)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", d3.schemeCategory10[1]);

  d3.select(decasteljau_points.nodes()[5]).attr("fill", "black");
  d3.select(decasteljau_points.nodes()[3]).attr("fill", d3.schemeCategory10[3]);
  d3.select(decasteljau_points.nodes()[4]).attr("fill", d3.schemeCategory10[3]);

  svg.select("#bezier").selectAll("circle")
    .data(circles)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("d", function(d){return d.x;})
      .attr("r", radius)
      .attr("fill", (d, i) => d3.schemeCategory10[4])
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.update drag.update end.update", update));

