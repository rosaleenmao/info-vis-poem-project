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
        imgUpdate: "verse1.jpeg",
        svgUpdate: drawGraph,
    },
    {
        activeVerse: 2,
        activeLines: [1, 2],
        imgUpdate: "verse2.png",
    },
    {
        activeVerse: 3,
        activeLines: [1, 2],
        imgUpdate: "verse3.png",
    },
    {
        activeVerse: 4,
        activeLines: [1, 2],
        imgUpdate: "verse4.png",
    },
    {
        activeVerse: 5,
        activeLines: [1, 2],
        imgUpdate: "verse5.png",
    },
    {
        activeVerse: 6,
        activeLines: [1, 2],
        imgUpdate: "verse6.png",
    },
    {
        activeVerse: 7,
        activeLines: [1, 2],
        imgUpdate: "verse7.png",
    },
    {
        activeVerse: 8,
        activeLines: [1, 2],
        imgUpdate: "verse8.png",
    },
    {
        activeVerse: 9,
        activeLines: [1, 2],
        imgUpdate: "verse9.png",
    },
    {
        activeVerse: 10,
        activeLines: [1, 2],
        imgUpdate: "verse10.png",
    }
]

// Initialize global variables to store the data when it is loaded
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

function updateBarChart(data, title = "") {
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, chartWidth])
        .padding(0.2);

    y = d3.scaleLinear()
        .domain([0, 400])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x)
        .tickFormat(d3.format('d')))
        .selectAll("text")
        .attr("transform", "translate(-12,20)rotate(-90)");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y))
        .selectAll("text");

    // append the bar rectangles to the svg element
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Year) + margin.left)
        .attr("y", d => height - (data.reduce(function(count, entry) { 
            return count + (entry.Year === d.Year ? 1 : 0);
        }, 0)))
        .attr("width", x.bandwidth())
        .attr("height", d => (data.reduce(function(count, entry) { 
            return count + (entry.Year === d.Year ? 1 : 0);
        }, 0)) - margin.bottom)
        .attr("fill", "#999")

    // Add title
    svg.append("text")
        .attr("id", "chart-title")
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

    if (kf.imgUpdate) {
        var newSrc = "assets/" + kf.imgUpdate;
        document.getElementById("img").src=newSrc;
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
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    // Select the correct verse
    let thisVerse = d3.select("#verse" + vid);
    // Update the class list of the relevant lines
    thisVerse.select("#line" + lid).classed("active-line", true);
  }


// TODO write a function to initialize the svg properly
function initializeSVG(data) {
    svg.attr("width", width);
    svg.attr("height", height);
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

// TODO add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);