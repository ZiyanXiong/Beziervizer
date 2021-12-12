// !preview r2d3 data=c(0.3, 0.6)
//
// r2d3: https://rstudio.github.io/r2d3
//


// Define variables
const radius = 6;
var n = 100;
var t = 0.5;
var omega = t * 2;
var circles_input = [{x: 100, y:400}, {x: 300, y:600}, {x: 500, y:400}];

//data = circles_input;
normalize_points();

if(data.length >= 3){
  circles_input = data;
}

var circles = circles_input.map(d => ({x: d.y - 400, y: d.x-200, z:100}));
circles[1].z = circles[1].z * omega;
//var circles = [{x: 0, y:-100, z:100}, {x: 200, y:0, z:100 * omega}, {x: 0, y:100, z:100}];
var axis = [{x:100, y:0, z:0}, {x:0, y:100, z:0}, {x:0, y:0, z:100}, {x:0, y:0, z:0}];
var origin = [{x:circles[1].x, y:circles[1].y, z:0}];
var camera_matrix = [[0.0000000,  1.0000000,  0.0000000, -300.0000000],
                        [0.0000000,  0.0000000, 1.0000000, -300.0000000],
                        [-1.0000000, 0.0000000,  0.0000000, 900.0000000]];

var margin = {right: 50, left: 50};
width = svg.attr("width") - margin.left - margin.right;
height = svg.attr("height");
var timer;

var x = d3.scaleLinear()
    .domain([0, 2])
    .range([0, width])
    .clamp(true);

var handle_position = [{x: t * width, y:0}];

// Caculate the points and lines in projective space
var curve = quadratic_bezier_curve(n);
var rational_curve = rational_bezier_curve(n, circles_input);
var camera_rational_curve = rational_bezier_curve(n, circles);
camera_rational_curve = camera_rational_curve.map(d => ({x: d.x, y: d.y, z:100}));
camera_rational_curve = camera_rational_curve.map(multiply_camera_matrix);

// Get lines on plane w = 1
var plane = get_plane(100);
for(let i = 0; i < plane.length; i++){
  plane[i] = plane[i].map(multiply_camera_matrix);
}

var camera_curve = curve.map(multiply_camera_matrix);
var camera_axis = axis.map(multiply_camera_matrix);
var control_points = circles.map(multiply_camera_matrix);

origin = origin.map(multiply_camera_matrix);
var origin_offset = {x:origin[0].x - camera_axis[3].x,y:origin[0].y - camera_axis[3].y};
camera_axis.map(function(d){d.x += origin_offset.x; d.y += origin_offset.y;});


var axis_lines = get_axis_lines();

function normalize_points(){
  var average = {x:0,y:0};
  var point_min = {x:data[0].x, y:data[0].y};
  var point_max = {x:data[0].x, y:data[0].y};
  for(let i = 0; i < data.length; i++){
    average.x += data[i].x;
    average.y += data[i].y;
    if(data[i].x < point_min.x){
      point_min.x = data[i].x;
    }
    if(data[i].x > point_max.x){
      point_max.x = data[i].x;
    }
    if(data[i].y < point_min.y){
      point_min.y = data[i].y;
    }
    if(data[i].y > point_max.y){
      point_max.y = data[i].y;
    }
  }

  var offset = {x:average.x / data.length, y:average.y / data.length};
  var unit = Math.min(width, height * 0.4) * 0.8;
  var scalar = {x:(point_max.x - point_min.x) /unit, y:(point_max.y - point_min.y) / unit};
  data.map(function(d) {d.x = (d.x - offset.x) / scalar.x + width * 0.5; d.y = (d.y - offset.y) / scalar.y + height * 0.6});
}


function rational_bezier_curve(n, control_points){
  var circles = control_points;
  var rational_curve = d3.range(n).map(i => ({
    x: Math.pow((1 - i / n),2) * circles[0].x + 2 * omega *(1 - i / n) * (i / n) * circles[1].x + Math.pow(i / n, 2) * circles[2].x,
    y: Math.pow((1 - i / n),2) * circles[0].y + 2 * omega *(1 - i / n) * (i / n) * circles[1].y + Math.pow(i / n, 2) * circles[2].y,
    n: Math.pow((1 - i / n),2)  + 2 * omega * (1 - i / n) * (i / n)  + Math.pow(i / n, 2)
  }));
  rational_curve.map(function(d){d.x = d.x / d.n; d.y = d.y / d.n});
  return rational_curve;
}

function get_plane(n){
  var max_size = 1000;
  var x_axis1 = d3.range(n + 1).map(i => ({x: i / n * max_size - max_size / 2 ,y: -max_size / 2,z: 100}));
  var x_axis2 = d3.range(n + 1).map(i => ({x: i / n * max_size - max_size / 2 ,y: max_size / 2,z: 100}));
  var y_axis1 = d3.range(n + 1).map(i => ({x: max_size / 2 ,y: i / n * max_size - max_size / 2,z: 100}));
  var y_axis2 = d3.range(n + 1).map(i => ({x: - max_size / 2 ,y: i / n * max_size -max_size / 2,z: 100}));
  return [x_axis1, x_axis2, y_axis1, y_axis2];
}

function get_axis_lines(){
    var line0 = d3.path();
    var line1 = d3.path();
    var line2 = d3.path();
    //line0.moveTo(camera_axis[3].x, camera_axis[3].y);
    //line0.moveTo(control_points[1].x,control_points[1].y);
    line0.moveTo(camera_axis[3].x, camera_axis[3].y);
    line0.lineTo(camera_axis[0].x, camera_axis[0].y);
    line1.moveTo(camera_axis[3].x, camera_axis[3].y);
    line1.lineTo(camera_axis[1].x, camera_axis[1].y);
    line2.moveTo(camera_axis[3].x, camera_axis[3].y);
    line2.lineTo(camera_axis[2].x, camera_axis[2].y);
    return axis_lines = [line0, line1, line2];
}

// Map a point to projective space
function multiply_camera_matrix(point){
  var camera_point = {x: 0, y:0, w:0};
  var w;
  var homo_coordinate = [point.x, point.y, point.z, 1];
  camera_point.w = camera_matrix[2].reduce((sum, elem, i) => sum + elem * homo_coordinate[i], 0);
  camera_point.x = camera_matrix[0].reduce((sum, elem, i) => sum + elem * homo_coordinate[i], 0) / camera_point.w * 600 + width * 0.8;
  camera_point.y = -camera_matrix[1].reduce((sum, elem, i) => sum + elem * homo_coordinate[i], 0) / camera_point.w * 600;
  return camera_point;
}

// Generate qurdratic bezier curve
function quadratic_bezier_curve(n) {
  var quadratic_curve = d3.range(n).map(i => ({
    x: Math.pow((1 - i / n),2) * circles[0].x + 2 * (1 - i / n) * (i / n) * circles[1].x + Math.pow(i / n, 2) * circles[2].x,
    y: Math.pow((1 - i / n),2) * circles[0].y + 2 * (1 - i / n) * (i / n) * circles[1].y + Math.pow(i / n, 2) * circles[2].y,
    z: Math.pow((1 - i / n),2) * circles[0].z + 2 * (1 - i / n) * (i / n) * circles[1].z + Math.pow(i / n, 2) * circles[2].z,
  }));
  return quadratic_curve;
}

// Response function for control points
function dragstarted(event, d) {
  d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
  d3.select(this).attr("cx", d.x = event.x).attr("cy", d.y = event.y);

  if(event.y <= 320){
    d3.select(this).attr("cy", d.y = 320);
  }

  if(event.y >= 650){
    d3.select(this).attr("cy", d.y = 650);
  }
}

function dragended(event, d) {
  d3.select(this).attr("stroke", null);
}


// Update function for user input response
function update() {
  var new_bezier = d3.path();
  new_bezier.moveTo(circles_input[0].x, circles_input[0].y);
  new_bezier.quadraticCurveTo(circles_input[1].x, circles_input[1].y,circles_input[2].x, circles_input[2].y);
  paths = [new_bezier];
  svg.select("#bezier").selectAll("path")
      .data(paths)
      .attr('d', d => d);

  circles = circles_input.map(d => ({x: d.y - 400, y: d.x-200, z:100}));
  circles[1].z = circles[1].z * omega;

  origin = [{x:circles[1].x, y:circles[1].y, z:0}];
  origin = origin.map(multiply_camera_matrix);
  origin_offset = {x:origin[0].x - camera_axis[3].x,y:origin[0].y - camera_axis[3].y};
  camera_axis.map(function(d){d.x += origin_offset.x; d.y += origin_offset.y;});
  axis_lines = get_axis_lines();
  axis_nodes.data(axis_lines).attr('d', d => d);


  curve = quadratic_bezier_curve(n);
  control_points = circles.map(multiply_camera_matrix);

  svg.select("#control_points").selectAll("line")
    .data(control_points)
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i){if(i < 2){return control_points[i+1].x} else {return d.x}})
      .attr("y2", function(d,i){if(i < 2){return control_points[i+1].y} else {return d.y}});

  svg.select("#control_points").selectAll("circle")
    .data(control_points)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

  camera_curve = curve.map(multiply_camera_matrix);
  svg.select("#curve_cam").selectAll("line")
    .data(camera_curve)
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i){if(i < n - 1){return camera_curve[i+1].x} else {return d.x}})
      .attr("y2", function(d,i){if(i < n - 1){return camera_curve[i+1].y} else {return d.y}});

  svg.select("#surface").selectAll("line")
    .data(camera_curve)
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", camera_axis[3].x)
      .attr("y2", camera_axis[3].y);


  rational_curve = rational_bezier_curve(n, circles_input);

  camera_rational_curve = rational_bezier_curve(n, circles);
  camera_rational_curve = camera_rational_curve.map(d => ({x: d.x, y: d.y, z:100}));
  camera_rational_curve = camera_rational_curve.map(multiply_camera_matrix);
  svg.select("#rational").selectAll("circle")
    .data(rational_curve)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)

  svg.select("#rational").selectAll("line")
    .data(camera_rational_curve)
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i) {if(i % 1 == 0){return camera_curve[i].x} else {return d.x}})
      .attr("y2", function(d,i) {if(i % 1 == 0){return camera_curve[i].y} else {return d.y}})

  if(omega > 1){
  svg.select("#rational").raise();
  svg.select("#control_points").raise();
  }else{
  svg.select("#rational").lower();
  svg.select("#control_points").lower();
  }
  svg.select("#intersects").selectAll("circle")
    .data(camera_rational_curve)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
  svg.select("#bezier").raise();

}

var path = d3.path();
path.moveTo(circles_input[0].x, circles_input[0].y);
path.quadraticCurveTo(circles_input[1].x, circles_input[1].y,circles_input[2].x, circles_input[2].y);
paths = [path]

// Add elements to svg Object
svg.append("g")
    .attr("id","bezier");

svg.append("g")
    .attr("id","control_points");

svg.append("g")
    .attr("id","curve_cam");

svg.append("g")
    .attr("id","axis");

svg.append("g")
    .attr("id","plane1x");

svg.append("g")
    .attr("id","plane1y");

svg.append("g")
    .attr("id","surface");

svg.append("g")
    .attr("id","rational");

svg.append("g")
    .attr("id","intersects");

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


svg.select("#bezier").selectAll("circle")
    .data(circles_input)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", radius)
      .attr("fill", (d, i) => d3.schemeCategory10[4])
      .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.update drag.update end.update", update));

svg.select("#control_points").selectAll("line")
    .data(control_points)
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i){if(i < 2){return control_points[i+1].x} else {return d.x}})
      .attr("y2", function(d,i){if(i < 2){return control_points[i+1].y} else {return d.y}})
      .attr("stroke", d3.schemeCategory10[0])
      .attr("stroke-width", "2.5px")
      .attr("opacity", "0.8");

svg.select("#control_points").selectAll("circle")
    .data(control_points)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 6)
      .attr("fill", (d, i) => d3.schemeCategory10[4])
      .attr("stroke", "black")
      .style("opacity", "0.5");

var axis_nodes = svg.select("#axis").selectAll("path")
    .data(axis_lines)
    .join("path")
    .attr('d', d => d)
    .attr('stroke', "red")
    .attr('stroke-width', '3.5px')
    .attr('fill', 'none');

d3.select(axis_nodes.nodes()[1]).attr("stroke", "blue");
d3.select(axis_nodes.nodes()[2]).attr("stroke", "#FFBF00");

svg.select("#curve_cam").selectAll("line")
    .data(camera_curve)
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i){if(i < n - 1){return camera_curve[i+1].x} else {return d.x}})
      .attr("y2", function(d,i){if(i < n - 1){return camera_curve[i+1].y} else {return d.y}})
      .attr("stroke", "black")
      .attr("stroke-width", "2.5px");

svg.select("#surface").selectAll("line")
    .data(camera_curve)
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", camera_axis[3].x)
      .attr("y2", camera_axis[3].y)
      .attr("stroke", "black")
      .attr("stroke-width", "1.5px")
      .attr("opacity", "0.2");

svg.select("#intersects").selectAll("circle")
    .data(camera_rational_curve)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 1.5)
      .attr("fill", d3.schemeCategory10[3]);

svg.select("#plane1x").selectAll("line")
    .data(plane[0])
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i) {return plane[1][i].x})
      .attr("y2", function(d,i) {return plane[1][i].y})
      .attr("stroke", "gray")
      .attr("stroke-width", "1.5px")
      .attr("opacity", "0.9");

svg.select("#plane1y").selectAll("line")
    .data(plane[2])
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i) {return plane[3][i].x})
      .attr("y2", function(d,i) {return plane[3][i].y})
      .attr("stroke", "gray")
      .attr("stroke-width", "1.5px")
      .attr("opacity", "0.9");

svg.select("#rational").selectAll("circle")
    .data(rational_curve)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 2)
      .attr("fill", d3.schemeCategory10[3])

svg.select("#rational").selectAll("line")
    .data(camera_rational_curve)
    .join("line")
      .attr("x1", d => d.x)
      .attr("y1", d => d.y)
      .attr("x2", function(d,i) {return camera_curve[i].x})
      .attr("y2", function(d,i) {return camera_curve[i].y})
      .attr("stroke-width", "2.5px")
      .attr("stroke", d3.schemeCategory10[9])
      .attr("opacity", "1");

svg.select("#curve_cam").raise();
svg.select("#control_points").raise();
svg.select("#surface").lower();
if(omega > 1){
  svg.select("#rational").raise();
}else{
  svg.select("#rational").lower();
}
svg.select("#intersects").raise();
svg.select("#bezier").raise();


// Code for Sliders

// Add elements to svg Object
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * 0.9 + ")");

slider.append("text")
      .attr("class","t")
      .attr("transform", "translate(" + width / 2 + "," + -20 + ")")
      .style("font", "25px sans-serif")
      .style("text-anchor", "middle")
      .style("user-select", "none")
      .text("w: " + (t * 2).toFixed(2));

var play_button = slider.append("g")
      .attr("class", "button")
      .attr("transform", "translate(0," + -40 + ")");

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

// Create Handle
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

// Handle behaveior functions
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
  slider.select(".t").text("w: " + (t * 2).toFixed(2));
  omega = t * 2;
  update();
}

function onClick(){
  if(play_button.select("text").text() == "Play"){
    play_button.select("text").text("Pause");
    timer = d3.interval(time_update, 50);
  } else{
    play_button.select("text").text("Play");
    timer.stop();
  }
}

function time_update(){
  t += 0.005;
  t = t % 1;
  slider.select(".track-inset").attr("x2",t * width);
  slider.select(".track-overlay").attr("x1",t * width);
  slider.select(".t").text("w: " + (t * 2).toFixed(2));
  handle_position[0].x = t * width;
  handle.attr("cx", t * width);
  omega = t * 2;
  update();
}
