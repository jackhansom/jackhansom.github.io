

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

loadJSON('/assets/data/handle_network_cleaned.json', redrawAll, function(err) {console.log('error')});

var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};

var options = {
  height:'500px',
  width:'500px',
        nodes: {
          shape: 'dot',
          color: {
            background: '#6c5b7b',
            border: '#355c7d',
            highlight: {
              background: '#f8b195',
              border: '#f67280'
            }
          },
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
  network.fit(); // zoom to fit
}

// handle network

var networkHT;

var nodesHT = new vis.DataSet();
var edgesHT = new vis.DataSet();
var gephiImportedHT;

var nodeContentHT = document.getElementById('nodeContentHT');
var nodeContentHT = document.getElementById('edgeContentHT');

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

loadJSON('/assets/data/hashtag_network_cleaned.json', redrawAllHT, function(err) {console.log('error')});

var containerHT = document.getElementById('hashtag_network');
var dataHT = {
  nodes: nodesHT,
  edges: edgesHT
};

var optionsHT = {
  height:'500px',
  width:'500px',
        nodes: {
          shape: 'dot',
          color: {
            background: '#6c5b7b',
            border: '#355c7d',
            highlight: {
              background: '#f8b195',
              border: '#f67280'
            }
          },
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

networkHT = new vis.Network(containerHT, dataHT, optionsHT);

/**
 * This function fills the DataSets. These DataSets will update the network.
 */
function redrawAllHT(gephiJSON) {
  if (gephiJSON.nodes === undefined) {
    gephiJSON = gephiImportedHT;
  }
  else {
    gephiImportedHT = gephiJSON;
  }

  nodesHT.clear();
  edgesHT.clear();

  // var fixed = fixedCheckbox.checked;
  // var parseColor = parseColorCheckbox.checked;

  var parsedHT = vis.network.gephiParser.parseGephi(gephiJSON, {
    fixed: false,
    parseColor: false
  });

  // add the parsed data to the DataSets.
  nodesHT.add(parsedHT.nodes);
  edgesHT.add(parsedHT.edges);
  networkHT.fit(); // zoom to fit
}