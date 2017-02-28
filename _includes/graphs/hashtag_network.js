
var network;

var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var gephiImported;

var nodeContent = document.getElementById('nodeContent');
var nodeContent = document.getElementById('edgeContent');

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}

loadJSON('/assets/data/hashtag_network_cleaned.json', redrawAll, function(err) {console.log('error')});

var container = document.getElementById('hashtag_network');
var data = {
  nodes: nodes,
  edges: edges
};

var options = {
  height:'500px',
  width:'500px',
        nodes: {
          shape: 'dot',
          scaling: {
            customScalingFunction: function (min,max,total,value) {
              return value;
            },
            min:1,
            max:150
          }
        },
        physics: {
      stabilization: true,
      barnesHut: {
        gravitationalConstant: -1000,
        springConstant: 0.02,
        springLength: 150,
        damping: 0.2,
      }
    }
  };

network = new vis.Network(container, data, options);

/**
 * This function fills the DataSets. These DataSets will update the network.
 */
function redrawAll(gephiJSON) {
  if (gephiJSON.nodes === undefined) {
    gephiJSON = gephiImported;
  }
  else {
    gephiImported = gephiJSON;
  }

  nodes.clear();
  edges.clear();

  // var fixed = fixedCheckbox.checked;
  // var parseColor = parseColorCheckbox.checked;

  var parsed = vis.network.gephiParser.parseGephi(gephiJSON, {
    fixed: false,
    parseColor: false
  });

  // add the parsed data to the DataSets.
  nodes.add(parsed.nodes);
  edges.add(parsed.edges);

  // var nodeData = nodes.get(2); // get the data from node 2 as example
  // nodeContent.innerHTML = JSON.stringify(nodeData,undefined,3); // show the data in the div

  // var edgeData = edges.get(2); // get the data from node 2 as example
  // edgeContent.innerHTML = JSON.stringify(edgeData,undefined,3); // show the data in the div
  network.fit(); // zoom to fit
}