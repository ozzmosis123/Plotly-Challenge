url = "samples.json"

function buildMetadata(sample) {
    d3.json(url).then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
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

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      // Grab values from the data json object to build the plots
      var samples = data.samples.sample_values;
      var ids = data.samples.id;
      var hover_labels = data.samples.otu_labels;
      
      var trace1 = {
        type: "bar",
        x: ids,
        y: samples,
        text: hover_labels
      }
     
      var barData = [trace1]

      var barLayout = {
        xaxis :{
          autorange: true,
        }
      }
      Plotly.newPlot("bar", barData, barLayout);
      
      var trace2 = {
        x: ids,
        y: samples,
        text: hover_labels,
        mode: 'markers',
        marker: {
          color: ids,
          opacity: [1, 0.8, 0.6, 0.4],
          size: samples
        }
      };
      
      var bubbleData = [trace2];

      Plotly.newPlot("bubble", bubbleData);
    });
  }

function init() {
    var selector = d3.select("#selDataset");
    d3.json(url).then(function(data) {
        console.log(data)
        var sampleNames = data.names;
        console.log(sampleNames);
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample)
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
        })
    }

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    // d3.select("#sample-metadata").on("change", buildMetadata(newSample));
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();

// optionChanged(newSample);

