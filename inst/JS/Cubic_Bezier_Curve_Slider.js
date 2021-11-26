// !preview r2d3 data=c(0.3, 0.6, 0.8)
//
// r2d3: https://rstudio.github.io/r2d3
//

var margin = {right: 50, left: 50};
width = svg.attr("width") - margin.left - margin.right;
height = svg.attr("height");
var timer;


var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width])
    .clamp(true);

var t = 0.5;
var handle_position = [{x: t * width, y:0}];


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
    if(t == 0 || t == 1){
      svg.select("#bezier").raise();
    } else {
      svg.select("#bezier").lower();
    }
  }


  function get_lines(){
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

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * 0.9 + ")");

slider.append("text")
      .attr("class","t")
      .attr("transform", "translate(" + width / 2 + "," + 65 + ")")
      .style("font", "25px sans-serif")
      .style("text-anchor", "middle")
      .style("user-select", "none")
      .text("t: " + t.toFixed(2));

var play_button = slider.append("g")
      .attr("class", "button")
      .attr("transform", "translate(0," + 40 + ")");

play_button.append("text")
        .attr("x", 35)
        .attr("y", 22)
        .style("font", "18px sans-serif")
        .style("text-anchor", "middle")
        .style("user-select", "none")
        .text("Play");

play_button.append("rect")
      .attr('width', 70)
      .attr('height', 30)
      .attr('fill', "#ffad8a")
      .attr("stroke", "black")
      .style("opacity", 0.3)
      .on("mousedown", function(){d3.select(this).attr('fill', "#6e6060")})
      .on("mouseup", function(){d3.select(this).attr('fill', "#ffad8a")})
      .on("click", onClick);

slider.append("line")
    .attr("class", "track-inset")
    .attr("x1", x.range()[0])
    .attr("x2", t * width)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "#3b99fc")
    .attr("stroke-width", "10px")
    .attr("stroke-linecap", "round");

slider.append("line")
    .attr("class", "track-overlay")
    .attr("x1", t * width)
    .attr("x2", x.range()[1])
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "#cccccc")
    .attr("stroke-width", "10px")
    .attr("stroke-linecap", "round");

slider.insert("g")
    .attr("transform", "translate(0," + 25 + ")")
  .selectAll("text")
  .data(x.ticks(10))
  .enter().append("text")
    .style("font", "15px sans-serif")
    .attr("x", x)
    .style("text-anchor", "middle")
    .style("user-select", "none")
    .text(function(d) { return d; });

var handle = slider.selectAll("circle")
    .data(handle_position)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 8)
      .attr("fill", "white")
      .attr("stroke", "gray")
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", handle_dragged)
      .on("end", handle_dragended)
      .on("start.update drag.update end.update", handle_update));

function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}

function handle_dragged(event, d) {
    d3.select(this).attr("cx", d.x = event.x);
    if(event.x < 0){
      d3.select(this).attr("cx", d.x = 0);
    }else if(event.x > width){
      d3.select(this).attr("cx", d.x = width);
    }
}

function handle_dragended(event, d) {
    d3.select(this).attr("stroke", "#cccccc");
    Shiny.setInputValue(
        "circle_clicked",
        circles,
        {priority: "event"}
        );
}

function handle_update() {
  t = handle_position[0].x * 1.0 / width;
  slider.select(".track-inset").attr("x2",t * width);
  slider.select(".track-overlay").attr("x1",t * width);
  slider.select(".t").text("t: " + t.toFixed(2));
  update();
}

function onClick(){
  if(play_button.select("text").text() == "Play"){
    play_button.select("text").text("Pause");
    timer = d3.interval(time_update, 100);
  } else{
    play_button.select("text").text("Play");
    timer.stop();
  }
}

function time_update(){
  t += 0.01;
  t = t % 1;
  slider.select(".track-inset").attr("x2",t * width);
  slider.select(".track-overlay").attr("x1",t * width);
  slider.select(".t").text("t: " + t.toFixed(2));
  handle_position[0].x = t * width;
  handle.attr("cx", t * width);
  update();
}
