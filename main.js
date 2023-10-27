// Global variables
let svg = d3.select("#svg");
let keyframeIndex = 0;
let transitionDuration = 500;

// Define the height and width of the svg as global variables
const width = 500;
const height = 400;

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2],
        svgUpdate: drawGraph,
    },
]

// Initialize two global variables to store the data when it is loaded
let asianData;

// TODO write an asynchronous loadData function
// You have to use the async keyword so that javascript knows that this function utilises promises and may not return immediately
async function loadData() {
    // Because d3.json() uses promises we have to use the keyword await to make sure each line completes before moving on to the next line
    await d3.csv("data/asian_data.csv").then(data => {
        // Inside the promise we set the global variable equal to the data being loaded from the file
        asianData = data;
    });
}

// TODO draw a bar chart from the rose dataset
function drawGraph() {
    updateBarChart(asianData, "Asian Data");
}

// Declare global variables for the chart
// This will hold where the actual section of the graph where visual marks, in our case the bars, are being displayed
// Additionally we'll store the dimensions of this space too
let chart;
let chartWidth;
let chartHeight;

// Declare both scales too
let x;
let y;

// TODO recreate the updateBarChart function from the tutorial
// As with the draw bar chart function we will pass the data we want to draw and the title of the graph
// There might be situations where we want to update the chart without updating the title
// To handle this we pass a default value to the title of an empty string
// As with the draw bar chart function we will pass the data we want to draw and the title of the graph
// There might be situations where we want to update the chart without updating the title
// To handle this we pass a default value to the title of an empty string
function updateBarChart(data, title = "") {

    // set the parameters for the histogram
    const histogram = d3.histogram()
        .value(function(d) { return d.Year; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(5)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Y axis: scale and draw:
    y = d3.scaleLinear()
      .range([chartHeight, 0]);
    
    // y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    y.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + (x(d.x0) * .9 + 50) + "," + (y(d.length) + 30) + ")"; })
        // .attr("width", function(d) { return x(d.x1) - x(d.x0) - 15 ; })
        .attr("width", 50)
        .attr("height", function(d) { return chartHeight - y(d.length); })
        .style("fill", "#FFFFE0");
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(title);
}

function forwardClicked() {

    // Make sure we don't let the keyframeIndex go out of range
    if (keyframeIndex < keyframes.length - 1) {
      keyframeIndex++;
      drawKeyframe(keyframeIndex);
    }
  }

  function backwardClicked() {
    if (keyframeIndex > 0) {
      keyframeIndex--;
      drawKeyframe(keyframeIndex);
    }
  }

  function drawKeyframe(kfi) {
    let kf = keyframes[kfi];

    resetActiveLines();
    updateActiveVerse(kf.activeVerse);

    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }

    if (kf.svgUpdate) {
        kf.svgUpdate();
    }
}

// TODO write a function to reset any active lines
function resetActiveLines() {
    // Reset the active-line class for all of the lines
    d3.selectAll(".line").classed("active-line", false);
  }

// TODO write a function to update the active verse
function updateActiveVerse(id) {
    // Reset the current active verse - in some scenarios you may want to have more than one active verse, but I will leave that as an exercise for you to figure out
    d3.selectAll(".verse").classed("active-verse", false);

    // Update the class list of the desired verse so that it now includes the class "active-verse"
    d3.select("#verse" + id).classed("active-verse", true);

    // Scroll the column so the chosen verse is centred
    scrollCenterColumnToActiveVerse(id);
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    // Select the correct verse
    let thisVerse = d3.select("#verse" + vid);
    // Update the class list of the relevant lines
    thisVerse.select("#line" + lid).classed("active-line", true);
  }

// TODO select the div displaying the center column content
// TODO select the verse we want to display
// TODO calculate the bounding rectangles of both of these elements
// TODO calculate the desired scroll position
// TODO scroll to the desired position
// TODO call this function when updating the active verse
// TODO write a function to scroll the center column to the right place
function scrollCenterColumnToActiveVerse(id) {
    // First we want to select the div that is displaying our text content
    var centerColumn = document.querySelector(".center-column-content");

    // Now we select the actual verse we would like to be centred, this will be the <ul> element containing the verse
    var activeVerse = document.getElementById("verse" + id);

    // The getBoundingClientRect() is a built in function that will return an object indicating the exact position
    // Of the relevant element relative to the current viewport.
    // To see a full breakdown of this read the documentation here: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var verseRect = activeVerse.getBoundingClientRect();
    var centerColumnRect = centerColumn.getBoundingClientRect();

    // Now we calculate the exact location we would like to scroll to in order to centre the relevant verse
    // Take a moment to rationalise that this calculation does what you expect it to
    var desiredScrollTop = verseRect.top + centerColumn.scrollTop - centerColumnRect.top - (centerColumnRect.height - verseRect.height) / 2;

    // Finally we scroll to the right location using another built in function.
    // The 'smooth' value means that this is animated rather than happening instantly
    centerColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}


// TODO write a function to initialize the svg properly
function initializeSVG(data) {
    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.scaleLinear()
        .domain([1990, 2022])
        .range([0, chartWidth]);

    y = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x));

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text("");
}

async function initialize() {
    // TODO load the data
    await loadData();

    // TODO initalise the SVG
    initializeSVG(asianData);

    // TODO draw the first keyframe
    drawKeyframe(keyframeIndex);
}


initialize();

// // TODO add event listeners to the buttons
// document.getElementById("forward-button").addEventListener("click", forwardClicked);
// document.getElementById("backward-button").addEventListener("click", backwardClicked);