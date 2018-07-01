var container = document.getElementById('footballGameSim');

var jstat = this.jStat;

function tabulate(data, columns, remove=true) {
        if (!d3.select("#footballGameSim").select("table").empty() && remove) {
            d3.select("#footballGameSim").selectAll("table").remove()
        }

        var table = d3.select('#footballGameSim').append('table')
        var thead = table.append('thead')
        var tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
          .selectAll('th')
          .data(columns).enter()
          .append('th')
            .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return columns.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
            .text(function (d) { return d.value; });

      return table;
    }

d3.json("/assets/data/wc_team_latents.json", function(error, data) {

    // select two competing teams
    var selectTeamData = [];
    for (team in data) {selectTeamData.push(team)}
    selectTeamData.sort();
    selectTeamData = ["Choose a team"].concat(selectTeamData);

    var selectTeam1 = d3.select('#footballGameSim')
      .append('select')
        .attr('class','selectTeam1')
        .on('change',onchange);

    var optionsTeam1 = selectTeam1
      .selectAll('option')
        .data(selectTeamData).enter()
        .append('option')
            .text(function (d) { return d; });

    var selectTeam2 = d3.select('#footballGameSim')
      .append('select')
        .attr('class','selectTeam2')
        .on('change',onchange);

    var optionsTeam2 = selectTeam2
      .selectAll('option')
        .data(selectTeamData).enter()
        .append('option')
            .text(function (d) { return d; });

    // function to update when given teams, and run sims
    function onchange() {
        selectTeamValue1 = d3.selectAll('select').filter(".selectTeam1").property('value');
        selectTeamValue2 = d3.selectAll('select').filter(".selectTeam2").property('value');

        yearOfInterest = "2018"
        att_mean_team1 = data[selectTeamValue1][yearOfInterest]["att_mean"];
        att_std_team1 = data[selectTeamValue1][yearOfInterest]["att_std"];
        def_mean_team1 = data[selectTeamValue1][yearOfInterest]["def_mean"];
        def_std_team1 = data[selectTeamValue1][yearOfInterest]["def_std"];


        att_mean_team2 = data[selectTeamValue2][yearOfInterest]["att_mean"];
        att_std_team2 = data[selectTeamValue2][yearOfInterest]["att_std"];
        def_mean_team2 = data[selectTeamValue2][yearOfInterest]["def_mean"];
        def_std_team2 = data[selectTeamValue2][yearOfInterest]["def_std"];

        score_samples_team1 = [];
        score_samples_team2 = [];
        var nSamples = 10000;

        for (i = 0; i < nSamples; i++) {
            att_sample_team1 = jstat.normal(att_mean_team1, att_std_team1).sample();
            def_sample_team1 = jstat.normal(def_mean_team1, def_std_team1).sample();

            att_sample_team2 = jstat.normal(att_mean_team2, att_std_team2).sample();
            def_sample_team2 = jstat.normal(def_mean_team2, def_std_team2).sample();

            rate_team_1 = att_sample_team1 - def_sample_team1;
            rate_team_2 = att_sample_team2 - def_sample_team2;

            rate_team_1 = Math.exp(rate_team_1)
            rate_team_2 = Math.exp(rate_team_2)

            score_samples_team1.push(jstat.poisson(rate_team_1).sample());
            score_samples_team2.push(jstat.poisson(rate_team_2).sample());
        }
        var result_counts = {};
        for (var i=0; i<score_samples_team1.length; i++) {
            str_result = score_samples_team1[i].toString() + '-' + score_samples_team2[i].toString()
            if (str_result in result_counts)
                result_counts[str_result] = result_counts[str_result] + 1. / nSamples;
            else
                result_counts[str_result] = 1. / nSamples;
        }
        keysSorted = Object.keys(result_counts).sort(function(a,b){return result_counts[a]<result_counts[b]})

        winPercentage = {
            team1Win:0.,
            draw: 0.,
            team2Win: 0.
        }
        for (i in score_samples_team1) {
            if (score_samples_team1[i] == score_samples_team2[i]) {
                winPercentage["draw"] = winPercentage["draw"] + 100. / nSamples
            }
            else {
                if (score_samples_team1[i] > score_samples_team2[i]) {
                    winPercentage["team1Win"] = winPercentage["team1Win"] + 100. / nSamples
                }
                else {
                    winPercentage["team2Win"] = winPercentage["team2Win"] + 100. / nSamples
                }
            }
        }
        for (key in winPercentage) {winPercentage[key] = Math.round(winPercentage[key])}
        tabulate([winPercentage], ["team1Win", "draw", "team2Win"], remove=true)
        console.log(winPercentage)

        dataToTabulate = [];
        for (k in keysSorted) {
            key = keysSorted[k]
            if (result_counts[key] > 0.03) {
                // only if 1% prob or more
                dataToTabulate.push({
                    result: key,
                    prob: Math.round(result_counts[key] * 100)
                });
            }
        }
        tabulate(dataToTabulate, ["result", "prob"], remove=false)
    }
});