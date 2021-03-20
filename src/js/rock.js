/****************************************/
/*****  Data   *****/
/****************************************/
const topRockAlbums = [
  { artist: "Queen", title: "Greatest Hits", eq_albums: 929000 },
  { artist: "Elton John", title: "Diamonds", eq_albums: 743000 },
  { artist: "Fleetwood Mac", title: "Rumours", eq_albums: 721000 },
  { artist: "CCR", title: "The 20 Greatest Hits", eq_albums: 630000 },
  { artist: "Journey", title: "Journey's Greatest Hits", eq_albums: 561000 }
];

const topRockSongs = [
  { artist: "Fleetwod Mac", title: "Dreams", sales_and_streams: 1882000 },
  { artist: "AJR", title: "Bang!", sales_and_streams: 1627000 },
  { artist: "Imagine Dragons", title: "Believer", sales_and_streams: 1571000 },
  { artist: "Journey", title: "Don't Stop Believin'", sales_and_streams: 1497000 },
  { artist: "Eagles", title: "Hotel California", sales_and_streams: 1393000 }
];

/****************************************/
/*****  Top Rock Albums   *****/
/****************************************/
const topAlbumsWrapper = d3.select('#top-albums');

// Append a simple title
topAlbumsWrapper
  .append('h3')
    .text('Top Rock Albums');

// Append svg element. Inspect the html to see if it appeared as expected.
const barChartWidth = 500;
const barChartHeight = 130;
const paddingLeft = 200;
const barChart = topAlbumsWrapper
  .append('svg')
    .attr('viewbox', [0, 0, barChartWidth, barChartHeight])
    .attr('width', barChartWidth)
    .attr('height', barChartHeight);

// Add left border, an svg line
barChart
  .append('line')
    .attr('x1', paddingLeft)
    .attr('y1', 0)
    .attr('x2', paddingLeft)
    .attr('y2', barChartHeight)
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

// Add a group for the bars. This will help keep the html easy to inspect and allow to style elements in batch
const barsGroup = barChart
  .append('g')
    .attr('class', 'bars-group');

// Finally add the bars
const barThickness = 20;
const barPadding = 5;
const barLenghtScale = d3.scaleLinear()
  .domain([0, 1000000]) // Our values can be from 0 to close to 1000000
  .range([0, barChartWidth - paddingLeft - 100]); // Based on the space that we have on screen
barsGroup.selectAll('rect')
  .data(topRockAlbums)
  .join('rect')
    .attr('x', paddingLeft + 1)
    .attr('y', (d, i) => barPadding + (barThickness + barPadding) * i)
    .attr('width', d => {
      console.log(d);
      console.log(barLenghtScale(d.eq_albums));
      // Show how to check that data is bount to html elements
      return barLenghtScale(d.eq_albums);
    })
    .attr('height', barThickness)
    .attr('fill', '#a6d854');

// Add values at the end of each bar
barsGroup.selectAll('.label-value')
  .data(topRockAlbums)
  .join('text')
    .attr('class', 'label label-value')
    .attr('x', d => paddingLeft + barLenghtScale(d.eq_albums) + 10)
    .attr('y', (d, i) => (barPadding + (barThickness + barPadding) * i) + 14)
    .text(d => d.eq_albums / 1000000 + 'M');

// Add albums titles
barsGroup.selectAll('.label-album')
  .data(topRockAlbums)
  .join('text')
    .attr('class', 'label label-album')
    .attr('x', d => paddingLeft - 5)
    .attr('y', (d, i) => (barPadding + (barThickness + barPadding) * i) + 14)
    .attr('text-anchor', 'end')
    .text(d => `${d.artist}, ${d.title}`);

// Lot's of repetition! We'll bind data in a more elegant way in the next section


/****************************************/
/*****  Top Rock Songs   *****/
/****************************************/
const topSongsWrapper = d3.select('#top-songs');

// Append a simple title
topSongsWrapper
  .append('h3')
    .text('Top Rock Songs');

// Append svg element. Inspect the html to see if it appeared as expected.
const circlesChartWidth = 550;
const circlesChartHeight = 130;
const circlesChart = topSongsWrapper
  .append('svg')
    .attr('viewbox', [0, 0, circlesChartWidth, circlesChartHeight])
    .attr('width', circlesChartWidth)
    .attr('height', circlesChartHeight);

// Add bottom border, an svg line
circlesChart
  .append('line')
    .attr('x1', 0)
    .attr('y1', circlesChartHeight / 2)
    .attr('x2', circlesChartWidth)
    .attr('y2', circlesChartHeight / 2)
    .attr('stroke', '#333')
    .attr('stroke-width', 2);

// We will now prepare to append our circles. 
// This time, we will structure our code so that it's a little more DRY, using groups to bind data only once
const circlesChartGroup = circlesChart
    .append('g')
    .selectAll('.circle-group')
    .data(topRockSongs)
    .join('g')
      .attr('class', 'circle-group'); // You should now have 5 groups with the class 'circle-group'

// The data is now bount to each group and we can append them shapes and labels
// First, the circles, for which we will need a scale
// Circles should always be sized based on their area, not their radius!
const radiusMin = 25;
const radiusMax = 40;
const circlesScale = d3.scaleLinear()
    .domain([d3.min(topRockSongs, d => d.sales_and_streams), d3.max(topRockSongs, d => d.sales_and_streams)])
    .range([Math.PI * Math.pow(radiusMin, 2), Math.PI * Math.pow(radiusMax, 2)]);

// We can now append circles
const circlesPadding = 15;
circlesChartGroup
  .append('circle')
    .attr('r', d => Math.sqrt(circlesScale(d.sales_and_streams) / Math.PI))
    .attr('cx', (d, i) => radiusMax + circlesPadding + (i * 2 * (radiusMax + circlesPadding)))
    .attr('cy', circlesChartHeight / 2)
    .attr('fill', '#8da0cb');

// And labels
circlesChartGroup
  .append('text')
    .attr('class', 'label label-value')
    .attr('x', (d, i) => radiusMax + circlesPadding + (i * 2 * (radiusMax + circlesPadding)))
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .text(d => (d.sales_and_streams / 1000000) + 'M');
circlesChartGroup
  .append('text')
    .attr('class', 'label label-circle')
    .attr('x', (d, i) => radiusMax + circlesPadding + (i * 2 * (radiusMax + circlesPadding)))
    .attr('y', circlesChartHeight - 5)
    .attr('text-anchor', 'middle')
    .text(d => d.title);
    