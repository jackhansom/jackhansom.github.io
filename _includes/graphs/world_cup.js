var container = document.getElementById('footballGraph');

var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// // Set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var valueline = d3.line()
    .x(function(d) {
    return x(d.x); 
 })
    .y(function(d) {
     return y(d.y); 
 });

// Get the data
d3.json("/assets/data/wc_team_latents.json", function(error, data) {
    // data.forEach(function(d) {
    //     // do stuff
    // });
    // select a team to look at
    var selectTeamData = ["Choose a team"];
    for (team in data) {selectTeamData.push(team)}
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
        var argAtt = [];
        var xData = [];
        var team = selectTeamValue;
        var selAttribute;
        if (selectAttrValue == "Attack") {selAttribute = "att_mean"} else {selAttribute = "def_mean"}
        console.log(selAttribute)
        for (year in data[team]) {
            argAtt.push({
                y:data[team][year][selAttribute],
                x:parseInt(year)
            });
        }

        // remove the svg canvas
        var svg = d3.select("#footballGraph").select("svg");
        svg.remove();

        // Adds the svg canvas
        var svg = d3.select("#footballGraph")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(argAtt, function(d) { return d.x; }));
        y.domain([d3.min(argAtt, function(d) { return d.y; }), 
            d3.max(argAtt, function(d) { return d.y; })]);

        // Add the valueline path.
        svg.append("path")
            .style("stroke", "black")
            .style("fill", "none")
            .attr("class", "line")
            .attr("d", valueline(argAtt));

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y));
    };
    
    

});
