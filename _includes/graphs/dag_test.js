var network1 = new vis.Network(
    document.getElementById('basic_dag'),
    {
	nodes: new vis.DataSet([
	    {id: 1,
	     shape: "box",
	     label: "group_size",
	     mass : 2},
	    {id: 2,
	     mass : 2,
	     label: "userid",
	     color: { background: "yellow", highlight: "yellow"},
	     shape: "circle"
	    },
	    {id: 3,
	     label: "specific_goal",
	     shape: "box",
	     mass : 2},
	    {id: 4,
	     label: "ratings_per_user_goal",
	     shape: "box",
	     mass : 4},
	    {id: 5,
	     shape: "ellipse",
	     label: "ratings_goal",
	     mass : 2}
	]),
	edges: new vis.DataSet([
	    {from: 2, to: 1, arrows: { to : true}},
	    {from: 2, to: 3, arrows: { to : true}},
	    {from: 3, to: 4, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 2, to: 4, arrows: { to : true}},
	    {from: 3, to: 5, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 1, to: 5, arrows: { to : true}},
	    {from: 4, to: 5, arrows: { to : true}}
	])
    },
    {height: "350px"});

var network2 = new vis.Network(
    document.getElementById('rewrite'),
    {
	nodes: new vis.DataSet([
	    {id: 1,
	     shape: "ellipse",
	     label: "group_size",
	     mass : 3},
	    {id: 2,
	     mass : 2,
	     label: "userid",
	     color: { background: "yellow", highlight: "yellow"},
	     shape: "circle"
	    },
	    {id: 3,
	     label: "specific_goal",
	     shape: "box",
	     mass : 2},
	    {id: 4,
	     label: "ratings_per_user_goal",
	     shape: "box",
	     mass : 3},
	    {id: 5,
	     shape: "ellipse",
	     label: "ratings_goal",
	     mass : 2},
	    {id: 6,
	     label: "coin",
	     shape: "box",
	     mass: 2}
	]),
	edges: new vis.DataSet([
	    {from: 2, to: 6, arrows: { to: true}},
	    {from: 6, to: 1, arrows: { to : true}},
	    {from: 2, to: 3, arrows: { to : true}},
	    {from: 3, to: 4, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 2, to: 4, arrows: { to : true}},
	    {from: 3, to: 5, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 1, to: 5, arrows: { to : true}},
	    {from: 4, to: 5, arrows: { to : true}}
	])
    },
    {height: "350px"});

var network2 = new vis.Network(
    document.getElementById('with_gk'),
    {
	nodes: new vis.DataSet([
	    {id: 1,
	     mass: 2,
	     shape: "box",
	     label: "group_size"},
	    {id: 2,
	     mass: 4,
	     label: "userid",
	     color: { background: "yellow", highlight: "yellow"},
	     shape: "circle"
	    },
	    {id: 3,
	     mass: 1,
	     shape: "box",
	     label: "specific_goal"},
	    {id: 4,
	     mass: 1,
	     shape: "box",
	     label: "ratings_per_user_goal"},
	    {id: 5,
	     mass: 3,
	     shape: "ellipse",
	     label: "ratings_goal"},
	    {id: 6,
	     mass: 3,
	     label: "uu1",
	     color: {background: "yellow", highlight: "yellow"},
	     shape: "circle"}
	]),
	edges: new vis.DataSet([
	    {from: 2, to: 6, arrows: {to: true}},
	    {from: 6, to: 4, arrows: {to: true}, label: "{true}", length: 3},
	    {from: 6, to: 5, arrows: {to: true}, label: "{true}", length: 3},
	    {from: 2, to: 1, arrows: { to : true}},
	    {from: 2, to: 3, arrows: { to : true}},
	    {from: 3, to: 4, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 2, to: 4, arrows: { to : true}, length: 3},
	    {from: 3, to: 5, arrows: { to : true}, label: "{true}", length: 3},
	    {from: 1, to: 5, arrows: { to : true}},
	    {from: 4, to: 5, arrows: { to : true}}
	])
    },
    {height: "350px"});
