// <!DOCTYPE html>
// <html>
// <head>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
//   <style>
document.addEventListener("DOMContentLoaded", function() {
  const width = 1100;
  const height = 800;
  
  const NUM_NODES = 10;
  const LINKS_PER_NODE = 1;
  const NODE_RADIUS_OFFSET = 5;
  
  // Create a more interesting color scale using interpolation
  const color = d3.scaleSequential()
    .domain([0, 20])
    .interpolator(d3.interpolateRainbow);
  
  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-120))
    .force("link", d3.forceLink().distance(30))
    .force("center", d3.forceCenter(width / 2, height / 2));
  
  const svg = d3.select("body").insert("svg", ":first-child")
    .attr('id', 'graph')
    .attr("width", width)
    .attr("height", height);
    
  // Add glow effect
  const defs = svg.append("defs");
  const filter = defs.append("filter")
    .attr("id", "glow");
  
  filter.append("feGaussianBlur")
    .attr("stdDeviation", "2")
    .attr("result", "coloredBlur");
  
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in", "coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");
  
  const link_container = svg.append("g");
  const node_container = svg.append("g");
  
  let nodes = [];
  let links = [];
  let link = link_container.selectAll("line.link");
  let node = node_container.selectAll("circle.node");
  
  // Initialize with first two nodes
  for(let i = 0; i < 2; i++) {
    nodes.push({ id: i, name: i, degree: 0});
  }
  
  // Add first link
  links.push({ source: nodes[0], target: nodes[1] });
  nodes[0].degree = 1;
  nodes[1].degree = 1;
  
  let current_node_index = 2;
  let current_links_added = 2;
  
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
    // Update link positions
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", d => {
        // Dynamic color based on connected nodes
        const gradientColor = d3.interpolateLab(
          color(d.source.degree),
          color(d.target.degree)
        )(0.5);
        return gradientColor;
      });
    
    // Update node positions with pulse effect
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => {
        const baseRadius = Math.pow(d.degree, 0.75) + NODE_RADIUS_OFFSET;
        return baseRadius + Math.sin(Date.now() * 0.003) * 2;
      });
  }
  
  function restart() {
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    
    // Update links
    link = link_container.selectAll("line.link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .style("stroke-width", 1.5);
    
    // Update nodes
    node = node_container.selectAll("circle.node")
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("r", d => Math.pow(d.degree, 0.75) + NODE_RADIUS_OFFSET)
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
      window.setTimeout(timed_add_nodes, 15);
    }
  }
  
  window.setTimeout(timed_add_nodes, 1000);
});
// </script>
// </body>
// </html>
