document.addEventListener("DOMContentLoaded", function() {
  const width = 1000;
  const height = 1000;
  
  const NUM_NODES = 100;
  const LINKS_PER_NODE = 1;
  // const NODE_RADIUS_OFFSET = 100;
  
  const color = d3.scaleSequential()
    .domain([10, 30])
    .interpolator(d3.interpolateCool);

  const manybodystrength = -10;
  const force_link_distance = 10;
  
  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(manybodystrength))
    .force("collision", d3.forceCollide().radius(function(d){return d.radius}))
    .force("link", d3.forceLink().distance(force_link_distance))
    .force("center", d3.forceCenter(width / 2, height / 2));
  
  const svg = d3.select("body").insert("svg", ":first-child")
    .attr('id', 'graph')
    .attr("width", width)
    .attr("height", height);
  
  const link_container = svg.append("g");
  const node_container = svg.append("g");
  
  let nodes = [];
  let links = [];
  let link = link_container.selectAll("line.link");
  let node = node_container.selectAll("circle.node");
  
  // Initialize with first two nodes
  for(let i = 0; i < 10; i++) {
    nodes.push({ id: i, name: i, degree: 1});
  }
  nodes[0].degree = 9;
  // Add first link
  links.push({ source: nodes[0], target: nodes[1] });
  links.push({ source: nodes[0], target: nodes[2] });
  links.push({ source: nodes[0], target: nodes[3] });
  links.push({ source: nodes[0], target: nodes[4] });
  links.push({ source: nodes[0], target: nodes[5] });
  links.push({ source: nodes[0], target: nodes[6] });
  links.push({ source: nodes[0], target: nodes[7] });
  links.push({ source: nodes[0], target: nodes[8] });
  links.push({ source: nodes[0], target: nodes[9] });
  let current_node_index = 10;
  let current_links_added = 10;
 
  function add_node(i, links_added) {
    const newNode = { id: i, name: i, degree: 0 };
    nodes.push(newNode);

    for(let j = 0; j < LINKS_PER_NODE; j++) {
      let target;
      let random_number = Math.random() * links_added;

      for(let n = 0; n < i; n++) {
        if(random_number < nodes[n].degree) {
          target = nodes[n];
          break;
        }
        random_number -= nodes[n].degree;
      }

      links.push({ source: newNode, target: target });
      newNode.degree += 1;
      target.degree += 1;
    }
  }
  
  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }
  
  function restart() {
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    
    link = link_container.selectAll("line.link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .style("stroke-width", 1);
    
    node = node_container.selectAll("circle.node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", d => Math.pow(d.degree, 0.5) 
        // + NODE_RADIUS_OFFSET)
      .style("fill", d => color(d.degree))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    simulation.on("tick", tick);
    simulation.alpha(1).restart();
  }
  
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  restart();
  
  const timed_add_nodes = function() {
    if(current_node_index < NUM_NODES) {
      add_node(current_node_index, current_links_added);
      current_node_index += 1;
      current_links_added += 2;
      restart();
      window.setTimeout(timed_add_nodes, 100);
    }
  }
  
  window.setTimeout(timed_add_nodes, 10);
});

