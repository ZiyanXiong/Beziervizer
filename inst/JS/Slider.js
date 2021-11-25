// !preview r2d3 data=c(0.3, 0.6, 0.8, 0.95, 0.40, 0.20)
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
      .on("drag", dragged)
      .on("end", dragended)
      .on("start.update drag.update end.update", update));

function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black");
}

function dragged(event, d) {
    d3.select(this).attr("cx", d.x = event.x);
    if(event.x < 0){
      d3.select(this).attr("cx", d.x = 0);
    }else if(event.x > width){
      d3.select(this).attr("cx", d.x = width);
    }
}

function dragended(event, d) {
    d3.select(this).attr("stroke", "#cccccc");
    Shiny.setInputValue(
        "circle_clicked",
        circles,
        {priority: "event"}
        );
}

function update() {
  t = handle_position[0].x * 1.0 / width;
  slider.select(".track-inset").attr("x2",t * width);
  slider.select(".track-overlay").attr("x1",t * width);
  slider.select(".t").text("t: " + t.toFixed(2));
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
}
