var container = document.getElementById('footballGraph');

var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var tooltip = d3.select("#footballGraph").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

// Get the data
d3.json("/assets/data/wc_team_latents.json", function(error, data) {
    // select a team to look at
    var selectTeamData = [];
    for (team in data) {selectTeamData.push(team)}
    selectTeamData.sort();
    selectTeamData = ["Choose a team"].concat(selectTeamData);
    var selectAttributeData = ["Attack", "Defence"];

    var selectTeam = d3.select('#footballGraph')
      .append('select')
        .attr('class','selectTeam')
        .on('change',onchange)

    var optionsTeam = selectTeam
      .selectAll('option')
        .data(selectTeamData).enter()
        .append('option')
            .text(function (d) { return d; });

    var selectAttribute = d3.select('#footballGraph')
      .append('select')
      .attr('class', 'selectAttribute')
      .on('change', onchange)

    var optionsAttr = selectAttribute
      .selectAll('option')
        .data(selectAttributeData).enter()
        .append('option')
            .text(function (d) { return d; });

    function onchange() {
        selectTeamValue = d3.selectAll('select').filter(".selectTeam").property('value');
        selectAttrValue = d3.selectAll('select').filter(".selectAttribute").property('value');
        var selData = [];
        var xData = [];
        var team = selectTeamValue;
        var selAttribute, selAttributeErr;
        if (selectAttrValue == "Attack") {selAttribute = "att_mean"} else {selAttribute = "def_mean"}
        if (selectAttrValue == "Attack") {selAttributeErr = "att_std"} else {selAttributeErr = "def_std"}

        for (year in data[team]) {
            selData.push({
                y:data[team][year][selAttribute],
                x:parseInt(year),
                e:data[team][year][selAttributeErr]
            });
        }

        var xScale = d3.scaleLinear()
         .range([0, width])
         .domain([d3.min(selData, function(d) { return d.x; }), 
            d3.max(selData, function(d) { return d.x; })]).nice();
         
        var yScale = d3.scaleLinear()
           .range([height, 0])
           .domain([-1.5, 1.5]).nice();
           // .domain([d3.min(selData, function(d) { return d.y - d.e; }), 
           //  d3.max(selData, function(d) { return d.y + d.e; })]).nice();

        var xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d3.format("d"));
        var yAxis = d3.axisLeft(yScale).ticks(12 * height / width);

        let line = d3.line()
            .x(function(d) {
            return xScale(d.x);
          })
          .y(function(d) {
            return yScale(d.y);
          });

        // remove the svg canvas
        var svg = d3.select("#footballGraph").select("svg");
        svg.remove();

        // Adds the svg canvas
        var svg = d3.select("#footballGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        svg.append("g")
           .append("rect")
           .attr("width", width)
           .attr("height", height)
           .attr("class", "plot-bg");

        // Add Axis labels
        svg.append("g").attr("class", "axis axis--x")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(xAxis);

        svg.append("g").attr("class", "axis axis--y").call(yAxis);

        // Add Error Line
        svg.append("g").selectAll("line")
            .data(selData).enter()
          .append("line")
          .attr("class", "error-line")
          .attr("x1", function(d) {
            return xScale(d.x);
          })
          .attr("y1", function(d) {
            return yScale(d.y + d.e);
          })
          .attr("x2", function(d) {
            return xScale(d.x);
          })
          .attr("y2", function(d) {
            return yScale(d.y - d.e);
          });

        // Add Error Top Cap
        svg.append("g").selectAll("line")
            .data(selData).enter()
          .append("line")
          .attr("class", "error-cap")
          .attr("x1", function(d) {
            return xScale(d.x) - 4;
          })
          .attr("y1", function(d) {
            return yScale(d.y + d.e);
          })
          .attr("x2", function(d) {
            return xScale(d.x) + 4;
          })
          .attr("y2", function(d) {
            return yScale(d.y + d.e);
          });
          
         // Add Error Bottom Cap
        svg.append("g").selectAll("line")
            .data(selData).enter()
          .append("line")
          .attr("class", "error-cap")
          .attr("x1", function(d) {
            return xScale(d.x) - 4;
          })
          .attr("y1", function(d) {
            return yScale(d.y - d.e);
          })
          .attr("x2", function(d) {
            return xScale(d.x) + 4;
          })
          .attr("y2", function(d) {
            return yScale(d.y - d.e);
          });
          
        // Add Scatter Points
        svg.append("g").attr("class", "scatter")
        .selectAll("circle")
        .data(selData).enter()
        .append("circle")
        .attr("cx", function(d) {
          return xScale(d.x);
        })
        .attr("cy", function(d) {
          return yScale(d.y);
        })
        .attr("r", 4)
        .on("mouseover", function(d){
            // let argTop = (event.pageY-17).toString() + "px";
            // let argLeft = (event.pageX+25).toString() + "px";
            console.log("mouseover")
            return tooltip.html(d.y.toFixed(3) + " &plusmn; " + d.e.toFixed(3))
                    .style("visibility", "visible");
         })
        .on("mouseout", function(){
            return tooltip.style("visibility", "hidden");
         });

        // add a mean line for comparison

        svg.append("line")
           .style("stroke", "#FF7F0E")
           .style("stroke-width", "2.5px")
           .attr({ x1: xScale(1950), y1: yScale(0.), 
                   x2: xScale(2018), y2: yScale(0.)});
    }
});
