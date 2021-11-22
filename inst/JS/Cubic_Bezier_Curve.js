// !preview r2d3 data=c(0.3, 0.6, 0.8)
//
// r2d3: https://rstudio.github.io/r2d3
//

  const radius = 6;

  var circles = d3.range(4).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
    t: 0.5,
  }));

  if(data.length >= 4){
    circles = data;
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
    var new_path = d3.path();
    var new_line0 = d3.path();
    var new_line1 = d3.path();
    var new_line2 = d3.path();
    new_line0.moveTo(circles[0].x, circles[0].y);
    new_line0.lineTo(circles[1].x, circles[1].y);
    new_line1.moveTo(circles[1].x, circles[1].y);
    new_line1.lineTo(circles[2].x, circles[2].y);
    new_line2.moveTo(circles[2].x, circles[2].y);
    new_line2.lineTo(circles[3].x, circles[3].y);
    new_path.moveTo(circles[0].x, circles[0].y);
    new_path.bezierCurveTo(circles[1].x, circles[1].y,circles[2].x, circles[2].y, circles[3].x, circles[3].y);
    new_paths = [new_path, new_line0, new_line1, new_line2];
    //svg.select("path").attr('d', new_path);
    svg.selectAll("path")
        .data(new_paths)
        .attr('d', d => d);
  }

  var path = d3.path();
  path.moveTo(circles[0].x, circles[0].y);
  path.bezierCurveTo(circles[1].x, circles[1].y,circles[2].x, circles[2].y, circles[3].x, circles[3].y)

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

  svg.selectAll("path")
    .data(paths)
    .join("path")
    .attr('d', d => d)
    .attr('stroke', d3.schemeCategory10[9])
    .attr('stroke-width', '2.5px')
    // with multiple points defined, if you leave out fill:none,
    // the overlapping space defined by the points is filled with
    // the default value of 'black'
    .attr('fill', 'none');

  svg.select("path")
    .attr('stroke', 'black')

  svg.selectAll("circle")
    .data(circles)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("d", function(d){return d.x;})
      .attr("r", radius)
      .attr("fill", (d, i) => d3.schemeCategory10[i % 10])
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.update drag.update end.update", update));

