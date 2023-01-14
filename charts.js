function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    //console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      //console.log(samples);
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredSamples = samples.filter(sampleobject =>
        sampleobject.id == sample);
        console.log(filteredSamples);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadata = data.metadata;
      var filteredMeta = metadata.filter(metaobject =>
        metaobject.id == sample);
        console.log(filteredMeta);
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
      var firstFilteredSample = filteredSamples[0];
      console.log(firstFilteredSample);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
      var firstFilteredMeta = filteredMeta[0];
      console.log(firstFilteredMeta);
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var ids = firstFilteredSample.otu_ids;
      console.log(ids);
      var labels = firstFilteredSample.otu_labels;
      console.log(labels);
      var sample_values = firstFilteredSample.sample_values;
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
      var washFreq = firstFilteredMeta.wfreq;
      console.log(washFreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    //var sortedIds = ids.sort((a, b) => b - a);
   // console.log(sortedIds);
    var yticks = ids.map(otuID => "OTU" + otuID);
    console.log(yticks);
  

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var trace = {
      y: yticks.slice(0,10).reverse(),
      x: sample_values.slice(0,10).reverse(),
      text: labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: "h"

    };
    var barData = [trace];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var trace1 = {
      x: ids,
      y: sample_values,
      marker: {
        color: ids,
        size: sample_values,
        colorscale: "Earth"
      },
      text: labels,
      mode: "markers"
    };
    var bubbleData = [trace1];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "closest"
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    var trace2 =  [
      {
          domain: { x: [0, 1], y: [0, 1] },
          value: washFreq,
          title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {
              range: [null, 10],
              tickmode: "array",
              tickvals: [0,2,4,6,8,10],
              ticktext: [0,2,4,6,8,10]
            },
            bar: {color: "black"},
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "lime" },
              { range: [8, 10], color: "green" }]
          }
        }
      ];


    var gauge_data = trace2;
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gauge_data, gaugeLayout);
  });
}
