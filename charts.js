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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var bact = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var bactArray = bact.filter(sampleObj => sampleObj.id == sample);
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstsample = bactArray[0];
    var metaResults = metaArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstsample.otu_ids;
    var otuLabels = firstsample.otu_labels;
    var sampleValues = firstsample.sample_values;
    var washFreq = parseFloat(metaResults.washFreq);
    var config = {responsive: true};

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0,10).map(otuID=>`OTU ${otuID}`).reverse()
    console.log(yticks)
    console.log(otuLabels)
    console.log(sampleValues)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues.slice(0,10).reverse(),
      hovertext: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: "#00f515"
         },
        }
    var barData = [trace];
      
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      color: "#00f515",
      hovermode: "closest",
      paper_bgcolor: "black",
      plot_bgcolor:"black",
      font:{
        family: 'copperplate',
        color:"#00f515"
      }
      
    };
     
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout, config);

    // 11. Create a bubblechart using same vars as above
    var trace2 = {
      x:otuID,
      y:sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuID,
        colorscale: "Earth",
      }
    }

    var bubbleData = [trace2];

    // 12. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: otuLabels,
      paper_bgcolor: "black", 
      plot_bgcolor:"black",
      font:{
        family: 'copperplate',
        color:"#00f515"
      }     
    };

    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 


    // 14. Create the trace for the gauge chart.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id ==sample);
    var result = resultArray[0];
    var wfreq = parseFloat(result.wfreq);

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title:{ 
          text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
          color: "#00f515"
        },

        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "#00f515" },
            { range: [2, 4], color: "#00f514cb" },
            { range: [4, 6], color: "#00f51495" },
            { range: [6, 8], color: "#00f51468" },
            { range: [8, 10], color: "#00f51431" }
          ]
        }
      }
    ];
        
    // 15. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 470,
      height: 470, 
      margin: { t: 20, r: 20, l: 20, b: 20 },
      paper_bgcolor: "black",
      plot_bgcolor:"black",
      font:{
        family: 'copperplate',
        color:"#00f515"
      }
         
    };
    
    // 16. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout,{scrollZoom: true});

  });
}
