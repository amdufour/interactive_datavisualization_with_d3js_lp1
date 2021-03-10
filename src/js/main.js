// Import data
d3.csv('../data/total_abum_by_format.csv').then(data => {
  createPictogramChart(data);
});

const createPictogramChart = (dataPict) => {
  const formats = ['physical_album', 'digital_album', 'digital_track', 'on_demand_audio_streams', 'on_demand_video_streams'];

  // Format data
  const genres = [];
  dataPict.forEach(datum => {
    // Extract genres
    genres.push(datum.genre);

    // Convert values to numbers and round them
    formats.forEach(format => {
      datum[format] = Math.round(parseFloat(datum[format]));
    });
  });
  console.log(dataPict);
  const numberOfGenre = genres.length; // 11 => 3 rows of 4 columns

  // Append legend
  const legendItems = d3.select('#pictogram-legend')
    .append('ul')
    .selectAll('li')
    .data(formats)
    .join('li');
  legendItems
    .append('span')
      .style('background-color', (d, i) => {
        return d3.schemeSet2[i]; // Use a categorical color scheme from d3-scale-chromatic (https://github.com/d3/d3-scale-chromatic)
      })
      .attr('class', d => `legend-circle legend-circle-${d}`);
  legendItems
    .append('span')
      .attr('class', 'legend-label')
      .text(d => d);
  
  // Use d3 to append grid with genres (html element)
  // Bind data to each section
  const pictSection = d3.select('#pictogram-charts')
    .append('div')
      .attr('class', 'row')
    .selectAll('.genre-wrapper')
    .data(dataPict)
    .join('div')
      .attr('class', 'col-6 col-md-3')
    .append('div')
      .attr('class', 'genre-wrappers');

  // Append label
  pictSection    
    .append('div')
      .attr('class', 'genre-label')
      .text(d => d.genre);

  // Append svg
  const pictWidth = 120;
  const pictHeight = 120;
  pictChart = pictSection
    .append('svg')
      .attr('viewbox', [0, 0, pictWidth, pictHeight])
      .attr('width', pictWidth)
      .attr('height', pictHeight);

  // Append pictograms
  const numCols = 10;
  const numRows = 10;
  const circlesPadding = 12;
  const circlesRadius = 5;
  const pictIndex = d3.range(numCols * numRows);
  pictIndex.forEach(i => {
    pictChart
      .append('circle')
        .attr('r', circlesRadius)
        .attr('cx', d => {
          const col = i % numCols; // Calculates the column number
          return col * circlesPadding + (circlesPadding / 2);
        })
        .attr('cy', d => {
          const row = Math.floor(i / numCols); // Calculates the row number
          return row * circlesPadding + (circlesPadding / 2);
        })
        .attr('fill', d => {
          switch (true) {
            case (i + 1) <= d.physical_album:
              return d3.schemeSet2[0]; // Use a categorical color scheme from d3-scale-chromatic (https://github.com/d3/d3-scale-chromatic)
            case (i + 1) <= (d.physical_album + d.digital_album):
              return d3.schemeSet2[1];
            case (i + 1) <= (d.physical_album + d.digital_album + d.digital_track):
              return d3.schemeSet2[2];
            case (i + 1) <= (d.physical_album + d.digital_album + d.digital_track + d.on_demand_audio_streams):
              return d3.schemeSet2[3];
            case (i + 1) <= (d.physical_album + d.digital_album + d.digital_track + d.on_demand_audio_streams + d.on_demand_video_streams):
              return d3.schemeSet2[4];
          }
        });
  });
}