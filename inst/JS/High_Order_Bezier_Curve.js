// !preview r2d3 data=c(0.3, 0.6, 0.8)
//
// r2d3: https://rstudio.github.io/r2d3
//

  const radius = 6;
  var iter_times = 5;
  var circles = d3.range(25).map(i => ({
    x: Math.random() * (width - radius * 2) + radius,
    y: Math.random() * (height - radius * 2) + radius,
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
    sub_points = recursive_subdivision(circles, iter_times);
    flattened = sub_points.reduce(function(a, b) { return a.concat(b);},[]);
    svg.select("#subdivision").selectAll("circle")
        .data(flattened)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
  }


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
      .attr("r", 2)
      .attr("fill", (d, i) => d3.schemeCategory10[5])

  svg.select("#bezier").raise()
