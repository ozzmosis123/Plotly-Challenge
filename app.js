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
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }

function buildCharts(sample) {
    d3.json(url).then((data) => {
      // Grab values from the data json object to build the plots
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      console.log(result)
     
      var sample_values = result.sample_values;
      var otu_id = result.otu_ids;
      var concat_id = otu_id.map(id => `OTU ${id}`)
      var hover_labels = result.otu_labels;
     
      var sorted_values = sample_values.sort((a, b) => b - a);
      var top_samples = sorted_values.slice(0,10);
      
      var trace1 = {
        type: "bar",
        x: top_samples,
        y: concat_id,
        orientation: 'h',
        text: hover_labels
      }
     
      var barData = [trace1]

      var barLayout = {
        title: {
          text: 'Top OTUs Found In Individual'
        },
        xaxis :{
          title: {
            text: 'OTU Sample Value'
          }
        }
      }  

      Plotly.newPlot("bar", barData, barLayout);
      
      var trace2 = {
        x: otu_id,
        y: sample_values,
        text: hover_labels,
        mode: 'markers',
        marker: {
          color: otu_id,
          opacity: [1, 0.8, 0.6, 0.4],
          size: sample_values
        }
      };
      
      var bubbleData = [trace2];

      var bubbleLayout = {
        title: {
          text: 'Total OTU Samples Found In Individual'
        },
        xaxis: {
          title: {
            text: 'OTU ID'
          }
        }
      }

      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
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

 // Fetch new data each time a new sample is selected
d3.selectAll("#selDataset").on("change", optionChanged);

// This function is called when a dropdown menu item is selected
function optionChanged(newSample) {
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var newSample = dropdownMenu.property("value");
    
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();
