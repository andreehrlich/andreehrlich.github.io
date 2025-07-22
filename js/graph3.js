document.addEventListener("DOMContentLoaded", function() {
  const width = 1100;
  const height = 800;
  
  const NUM_NODES = 20;
  const BRANCH_PROBABILITY = 0.6;
  const NODE_RADIUS_BASE = 6;
  const GENERATION_DELAY = 1200;
  
  // GP Playground aesthetic colors
  const nodeColor = d3.scaleLinear()
    .domain([0, 8])
    .range(['#87CEEB', '#00BFFF']);
  
  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-80))
    .force("link", d3.forceLink().distance(60).strength(0.8))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(15));
  
  // Create or select the SVG
  let svg = d3.select("#graph");
  if (svg.empty()) {
    svg = d3.select("body").insert("svg", ":first-child")
      .attr('id', 'graph')
      .attr("width", width)
      .attr("height", height);
  } else {
    svg.attr("width", width).attr("height", height);
  }
    
  // Clear any existing content
  svg.selectAll("*").remove();
    
  // Enhanced glow effects
  const defs = svg.append("defs");
  
  const createGlowFilter = (id, deviation, opacity) => {
    const filter = defs.append("filter")
    .attr("id", "glow")
    .attr("x", "-50%")
    .attr("y", "-50%")
    .attr("width", "200%")
    .attr("height", "200%");
  
  filter.append("feGaussianBlur")
    .attr("stdDeviation", 3)
    .attr("result", "coloredBlur");
    
  // const feMerge = filter.append("feMerge");
  // feMerge.append("feMergeNode").attr("in", "coloredBlur");
  // feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", deviation)
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "coloredBlur")
      .attr("opacity", opacity);
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
    return filter;
  };
  createGlowFilter("nodeGlow", 4, 0.8);
  createGlowFilter("linkGlow", 2, 0.6);
  createGlowFilter("pulseGlow", 8, 0.4);
  
  // Gradient for links
  const linkGradient = defs.append("linearGradient")
    .attr("id", "linkGradient")
    .attr("gradientUnits", "userSpaceOnUse");


    
  linkGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#00BFFF")
    .attr("stop-opacity", 0.8);
    
  linkGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#87CEEB")
    .attr("stop-opacity", 0.3);
  
  const link_container = svg.append("g").attr("class", "links");
  const node_container = svg.append("g").attr("class", "nodes");
  
  let nodes = [];
  let links = [];
  let link, node;
  
  // Start with root node
  const rootNode = { 
    id: 0, 
    generation: 0, 
    children: 0,
    fx: width / 2,
    fy: height / 2,
    born: Date.now()
  };
  nodes.push(rootNode);
  
  let currentNodeId = 1;
  let activeGeneration = 0;
  let animationStopped = false;
  
  // Function to ensure valid radius
  function getValidRadius(d) {
    const now = Date.now();
    const age = (now - d.born) / 1000;
    const baseRadius = NODE_RADIUS_BASE + Math.sqrt(d.children + 1) * 2;
    const pulse = Math.sin(now * 0.002 + d.id * 0.3) * 1 + 2;
    const growth = Math.min(1, Math.max(0, age * 0.3));
    const finalRadius = baseRadius * growth * pulse;
    
    // Ensure radius is always positive and reasonable
    return Math.max(2, Math.min(15, finalRadius));
  }
  
  // Branching function
  function branchFromNode(parentNode) {
    const numOffspring = Math.floor(Math.random() * 3) + 1; // 1-2 offspring
    
    for(let i = 0; i < numOffspring; i++) {
      if(currentNodeId >= NUM_NODES || animationStopped) break;
      
      const angle = (Math.PI * 2 * i / numOffspring) + (Math.random() - 0.5) * 1;
      const distance = 40 + Math.random() * 40;
      
      const newNode = {
        id: currentNodeId,
        generation: parentNode.generation + 1,
        children: 0,
        parent: parentNode,
        born: Date.now(),
        // Start near parent
        x: parentNode.x + Math.cos(angle) * 30,
        y: parentNode.y + Math.sin(angle) * 30
      };
      
      nodes.push(newNode);
      links.push({ 
        source: parentNode, 
        target: newNode
      });
      
      parentNode.children++;
      currentNodeId++;
    }
  }
  
  function updateVisualization() {
    if (animationStopped) return;
    
    const now = Date.now();
    
    // Update simulation
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    
    // Update links
    linkSelection = link_container.selectAll("line.link")
      .data(links, d => `${d.source.id}-${d.target.id}`);
      
    linkSelection.exit().remove();
      
    linkSelection = linkSelection.enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "url(#linkGradient)")
      .style("stroke-width", 2)
      .style("opacity", 0)
      .merge(linkSelection);
      
    linkSelection
      .transition()
      .duration(800)
      .style("opacity", 0.6);
    
    // Update nodes
    nodeSelection = node_container.selectAll("circle.node")
      .data(nodes, d => d.id);
      
    nodeSelection.exit().remove();
      
    const nodeEnter = nodeSelection.enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 0)
      .style("opacity", 0)
      .style("fill", d => nodeColor(d.generation))
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 1)
      .style("filter", "url(#glow)")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    nodeSelection = nodeEnter.merge(nodeSelection);
    
    nodeEnter
      .transition()
      .duration(1000)
      .attr("r", d => getValidRadius(d))
      .style("opacity", 1);
    
    // Start simulation if not running
    if (simulation.alpha() < 0.1) {
      simulation.alpha(0.3).restart();
    }
  }
  
  function tick() {
    if (animationStopped) return;
    
    const now = Date.now();
    
    // Update link positions
    if (linkSelection) {
      linkSelection
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    }
    
    // Update node positions and dynamic properties
    if (nodeSelection) {
      nodeSelection
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => getValidRadius(d))
        .style("fill", d => {
          const pulse = Math.sin(now * 0.002 + d.generation) * 0.2 + 0.8;
          return d3.interpolate(nodeColor(d.generation), "#FFFFFF")(pulse * 0.3);
        });
    }
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
    if (event.subject.id !== 0) {
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }
  
  // Set up simulation tick
  simulation.on("tick", tick);
  
  // Initial setup
  updateVisualization();
  
  // Animation sequence
  function nextGeneration() {
    if(currentNodeId >= NUM_NODES || animationStopped) return;
    
    const branchingCandidates = nodes.filter(n => 
      n.generation === activeGeneration && 
      Math.random() < BRANCH_PROBABILITY &&
      n.children < 2
    );
    
    if(branchingCandidates.length === 0) {
      activeGeneration++;
      if(activeGeneration < 5) {
        setTimeout(nextGeneration, GENERATION_DELAY);
      }
      return;
    }
    
    branchingCandidates.forEach(parentNode => {
      if(currentNodeId < NUM_NODES && Math.random() < 0.7) {
        branchFromNode(parentNode);
      }
    });
    
    updateVisualization();
    
    setTimeout(() => {
      activeGeneration++;
      setTimeout(nextGeneration, GENERATION_DELAY);
    }, GENERATION_DELAY / 2);
  }
  
  // Start the branching process
  setTimeout(() => {
    branchFromNode(rootNode);
    updateVisualization();
    setTimeout(nextGeneration, GENERATION_DELAY);
  }, 1000);
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    animationStopped = true;
    simulation.stop();
  });
});
