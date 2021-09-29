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

  let speciesFormatted = {
    "Iris-setosa": "Iris setosa",
    "Iris-versicolor": "Iris versicolor",
    "Iris-virginica": "Iris virginica"
  }
  var xScale = d3.scaleLinear()
    .domain([
      d3.min(data,function (d) { return d.PetalWidthCm })-0.1,
      d3.max(data,function (d) { return d.PetalWidthCm })
      ])
    .range([0,width])
  console.log("AQUI")
  console.log(d3.min(data,function (d) { return d.SepalLengthCm }))
  var yScale = d3.scaleLinear()
    .domain([
      d3.min(data,function (d) { return d.SepalLengthCm })-0.1,
      d3.max(data,function (d) { return d.SepalLengthCm })
      ])
    .range([height,0])
  // SVG
  var g = svg2.append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  g.append('text')
        .attr('x', width/2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', 32)
        .text('Size of Iris Species');
  // X-axis
  var xAxis = d3.axisBottom(xScale);
  // Y-axis
  var yAxis = d3.axisLeft(yScale);
  // Circles
  var circles = g.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.PetalWidthCm) })
      .attr('cy',function (d) { return yScale(d.SepalLengthCm) })
      .attr('r',7.5)
      .attr('class','point')
      .style('fill',function (d,i) { return colorScale[d.Species] })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('class','selected')
          .attr('stroke-width',2)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('class', 'point')
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
    .text(function (d) { return 'Species: ' + speciesFormatted[d.Species] +
                           '\nPetal Width: ' + d.PetalWidthCm +
                           '\nSepal Length: ' + d.SepalLengthCm });
                           
  // X-axis
  g.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  g.append('text') // X-axis Label
      .attr('class','axisLabel')
      .attr('y',height-20)
      .attr('x',width)
      .attr('dy','.6em')
      .style('text-anchor','end')
      .text('Petal Width')
  // Y-axis
  g.append('g')
      .attr('class', 'axis')
      .call(yAxis)
  g.append('text') // y-axis Label
      .attr('class','axisLabel')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','1em')
      .style('text-anchor','end')
      .text('Sepal Length')
})

