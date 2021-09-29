// write your javascript code here.
// feel free to change the preset attributes as you see fit

let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 35
  },
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// first visualization
let svg1 = d3.select('#vis1')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

let census = d3.csv("data/population_spain.csv")
census.then(function(data){
  let colorScale = {
    "Female" : "Orange",
    "Male" : "Blue"
  }
  var subgroups = data.columns.slice(1)
  var groups = new Map(data, function(d){return(d.Year)}).keys()
  console.log(groups);

  // SVG
  var svg = svg1.append('svg')
      .attr('height',height + margin.top + margin.bottom)
      .attr('width',width + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([1, 80])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Year) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });
  
})



/*
var bar = graph.selectAll("g") 
   .data(data)
   .enter()
   .append("g")
   .attr("transform", function(d, i) {
      return "translate(0," + i * barHeight + ")";
   });
*/
// second visualization
let svg2 = d3.select('#vis2')
  .append('svg')
  .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of its parent element and the page.
  .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
  .style('background-color', '#ccc') // change the background color to light gray
  .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

let iris = d3.csv("data/iris.csv")
iris.then(function(data) {
  // Scales
  let colorScale = {
    "Iris-setosa": "red",
    "Iris-versicolor": "green",
    "Iris-virginica": "blue"
  }
  var xScale = d3.scaleLinear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d.PetalWidthCm })]),
      d3.max([0,d3.max(data,function (d) { return d.PetalWidthCm })])
      ])
    .range([0,width])
  var yScale = d3.scaleLinear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d.SepalLengthCm })]),
      d3.max([0,d3.max(data,function (d) { return d.SepalLengthCm })])
      ])
    .range([height,0])
  // SVG
  var svg = svg2.append('svg')
      .attr('height',height + margin.top + margin.bottom)
      .attr('width',width + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.axisBottom(xScale);
  // Y-axis
  var yAxis = d3.axisLeft(yScale);
  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.PetalWidthCm) })
      .attr('cy',function (d) { return yScale(d.SepalLengthCm) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale[d.Species] })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',20)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',10)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
    .text(function (d) { return d.Species +
                           '\nPetal Width: ' + d.PetalWidthCm +
                           '\nSepal Length: ' + d.SepalLengthCm });
                           
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',width)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Petal Width')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Sepal Length')
})

