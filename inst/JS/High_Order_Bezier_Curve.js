// !preview r2d3 data=c(0.3, 0.6, 0.8)
//
// r2d3: https://rstudio.github.io/r2d3
//


// Define variables
  const radius = 6;
  var iter_times = 5;
  var circles = d3.range(20).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
  }));
  if(Number.isInteger(data)){
    circles = d3.range(data).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
    }));
    data = circles;
  }
  var margin = {right: 50, left: 50};
  width = svg.attr("width") - margin.left - margin.right;
  height = svg.attr("height");
  var timer;
  var x = d3.scaleLinear()
    .domain([3, 10])
    .range([0, width])
    .clamp(true);

  var handle_position = [{x: (iter_times - 3) / 7 * width, y:0}];

  normalize_points();
  if(data.length >= 4){
    circles = data;
  }

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
    var unit = Math.min(width, height) * 0.9;
    var scalar = {x:(point_max.x - point_min.x) /unit, y:(point_max.y - point_min.y) / unit};
    data.map(function(d) {d.x = (d.x - offset.x) / scalar.x + width * 0.6; d.y = (d.y - offset.y) / scalar.y + height * 0.4});
  }

// Response function for control points
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
    sub_points = recursive_subdivision(circles, iter_times);
    flattened = sub_points.reduce(function(a, b) { return a.concat(b);},[]);
    svg.select("#subdivision").selectAll("circle").remove();

    svg.select("#subdivision").selectAll("circle")
    .data(flattened)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 2.5)
      .attr("fill", "black")
  }

// Subdivide original Bezier Curve
  function subdivision(points){
    var n = circles.length;
    var front_points = JSON.parse(JSON.stringify(points));
    var back_points = JSON.parse(JSON.stringify(points));
    var iterate_points = JSON.parse(JSON.stringify(points));
    for (let i = 1; i < n ; i++) {
      let temp_points = JSON.parse(JSON.stringify(iterate_points));
      for (let j = 0; j < n - i; j++){
        iterate_points[j] = {x:(temp_points[j].x + temp_points[j+1].x)/2,
                             y:(temp_points[j].y + temp_points[j+1].y)/2};
      }
      front_points[i] = JSON.parse(JSON.stringify(iterate_points[0]));
      back_points[n-1-i] = JSON.parse(JSON.stringify(iterate_points[n-1-i]));
    }
    return [front_points, back_points];
  }

  function recursive_subdivision(points, times){
    if (times == 0)
      {return [points]};
    times -= 1;
    var tem_result = subdivision(points);
    var left_result = recursive_subdivision(tem_result[0], times);
    var right_result = recursive_subdivision(tem_result[1], times);
    return left_result.concat(right_result);
  }

  var sub_points = subdivision(circles);
  var sub_points = recursive_subdivision(circles, iter_times);
  var flattened = sub_points.reduce(function(a, b) { return a.concat(b);},[]);

// Add element to svg object
  svg.append("g")
      .attr("id","bezier")

  svg.select("#bezier").selectAll("circle")
    .data(circles)
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

  svg.append("g")
      .attr("id","subdivision")

  svg.select("#subdivision").selectAll("circle")
    .data(flattened)
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 2.5)
      .attr("fill", "black")

  svg.select("#bezier").raise()

// Code for slider
// Add the element for slider to svg

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + height * 0.9 + ")");

slider.append("text")
      .attr("class","t")
      .attr("transform", "translate(" + width / 2 + "," + -20 + ")")
      .style("font", "25px sans-serif")
      .style("text-anchor", "middle")
      .style("user-select", "none")
      .text("Iterate times: " + iter_times);

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
    .attr("x2", handle_position[0].x)
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "#3b99fc")
    .attr("stroke-width", "10px")
    .attr("stroke-linecap", "round");

slider.append("line")
    .attr("class", "track-overlay")
    .attr("x1", handle_position[0].x)
    .attr("x2", x.range()[1])
    .attr("y1", 0)
    .attr("y2", 0)
    .attr("stroke", "#cccccc")
    .attr("stroke-width", "10px")
    .attr("stroke-linecap", "round");

slider.insert("g")
    .attr("transform", "translate(0," + 25 + ")")
  .selectAll("text")
  .data(x.ticks(7))
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

// Response function for slider

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
    handle_position[0].x = (iter_times - 3) / 7 * width;
    handle.attr("cx", handle_position[0].x);
    slider.select(".track-inset").attr("x2", handle_position[0].x);
    slider.select(".track-overlay").attr("x1", handle_position[0].x);
    Shiny.setInputValue(
        "circle_clicked",
        circles,
        {priority: "event"}
        );
}

function handle_update() {
  var old_iter_times = iter_times;
  iter_times = Math.round(handle_position[0].x / width * 7 + 3);
  slider.select(".track-inset").attr("x2",handle_position[0].x);
  slider.select(".track-overlay").attr("x1",handle_position[0].x);
  slider.select(".t").text("Iterate times: " + iter_times);
  if(old_iter_times != iter_times){
    update();
  }
}

function onClick(){
  if(play_button.select("text").text() == "Play"){
    play_button.select("text").text("Pause");
    timer = d3.interval(time_update, 1000);
  } else{
    play_button.select("text").text("Play");
    timer.stop();
  }
}

function time_update(){
  iter_times += 1;
  iter_times = iter_times % 11;
  if (iter_times < 3){
    iter_times = 3;
  }
  handle_position[0].x = (iter_times - 3) / 7 * width;
  slider.select(".track-inset").attr("x2", handle_position[0].x);
  slider.select(".track-overlay").attr("x1", handle_position[0].x);
  slider.select(".t").text("Iterate times: " + iter_times);
  handle.attr("cx", handle_position[0].x);
  update();
}
