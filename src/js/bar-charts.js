// Import data
d3.csv('../data/total_abum_by_format.csv').then(data => {
  createBarCharts(data);
});

const formats = [
  { key: 'physical_album', label: 'Physical album' },
  { key: 'digital_album', label: 'Digital album' },
  { key: 'digital_track', label: 'Digital track' },
  { key: 'on_demand_audio_streams', label: 'On-demand audio stream' },
  { key: 'on_demand_video_streams', label: 'On-demand video stream' },
];

// Create and append the bar charts
const createBarCharts = (data) => {
  console.log(data);

  // Append the legend
  const legend = d3.select('#bar-legend')
    .append('ul')
    .selectAll('.bar-legend-item')
    .data(formats)
    .join('li')
      .attr('class', 'bar-legend-item');

  legend
    .append('span')
      .attr('class', 'legend-rect')
      .style('background-color', (d, i) => d3.schemeSet2[i]);

  legend
    .append('span')
      .attr('class', 'legend-label')
      .text(d => d.label);

  // Format data
  const genres = [];
  data.forEach(datum => {
    // Extract genres
    genres.push(datum.genre);

    // Convert string values to numbers
    formats.forEach(format => {
      datum[format.key] = parseFloat(datum[format.key]);
    });
  });
  console.log(data);

  // Check how many different genres
  const numberOfGenres = genres.length;
  console.log(numberOfGenres); // 11 genres => 3 rows of 4 columns
  
  // Use d3 to append a grid for genres (html element)
  // Bind data to each section
  const genreSection = d3.select('#bar-charts')
    .append('div')
      .attr('class', 'row')
    .selectAll('.genre-wrapper')
    .data(data)
    .join('div')
      .attr('class', 'col-6 col-md-3')
    .append('div')
      .attr('class', 'genre-wrapper');

  // Append genre labels
  genreSection    
    .append('h3')
      .attr('class', 'genre-label')
      .text(d => d.genre);

  // Append an svg element for each genre
  const chartWidth = 180;
  const chartHeight = 100;
  const barChart = genreSection
    .append('svg')
      .attr('viewbox', [0, 0, chartWidth, chartHeight])
      .attr('width', chartWidth)
      .attr('height', chartHeight);

  // Append the left axis (a simple svg line)
  barChart
    .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', chartHeight);

  // Now we can start appending the rectangle for the bar charts
  // First, let's append a group, that will be useful to keep our html clean and easy to inspect
  const barsGroup = barChart
    .append('g')
      .attr('class', 'bars-wrapper');
  
  // We will also need a scale that will determine the length of each rectangle based on the data
  const barLenghtScale = d3.scaleLinear()
    .domain([0, 100]) // Our values can be from 0 to 100%
    .range([0, chartWidth]); // Based on the space that we have on screen

  // Now we can append the rectangles
  const barThickness = 16;
  const barPadding = 3;
  formats.forEach((format, i) => {
    barsGroup
      .append('rect')
        .attr('x', 1)
        .attr('y', barPadding + (barThickness + barPadding) * i)
        .attr('width', d => barLenghtScale(d[format.key]))
        .attr('height', barThickness)
        .attr('fill', d => d3.schemeSet2[i])
        .attr('stroke', 'none');
  })

}