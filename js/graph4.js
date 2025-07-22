document.addEventListener("DOMContentLoaded", function() {
  const width = 1200;
  const height = 900;
  
  const NUM_NODES = 25; // More nodes for better branching
  const BRANCH_PROBABILITY = 0.7; // Higher chance of branching
  const NODE_RADIUS_BASE = 4;
  const GENERATION_DELAY = 800; // Slower for dramatic effect
  
  // GP Playground aesthetic colors
  const techGradient = d3.scaleLinear()
    .domain([0, 5]) // Based on generation/depth
    .range(['#00BFFF', '#87CEEB']);
    
  const nodeColor = d3.scaleLinear()
    .domain([0, 8])
    .range(['#87CEEB', '#00BFFF']);
  
  const simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-80))
    .force("link", d3.forceLink().distance(60).strength(0.8))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(15));
  
  const svg = d3.select("#graph")
    .attr("width", width)
    .attr("height", height);
    
  // Enhanced glow effects
  const defs = svg.append("defs");
  
  // Multiple glow filters for different intensities
  const createGlowFilter = (id, deviation, opacity) => {
    const filter = defs.append("filter")
      .attr("id", id)
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    
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
  
  // Gradient definitions for links
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
    .attr("stop-opacity", 0.4);
  
  const link_container = svg.append("g").attr("class", "links");
  const node_container = svg.append("g").attr("class", "nodes");
  
  let nodes = [];
  let links = [];
  let link, node;
  
  // Start with root node at center
  const rootNode = { 
    id: 0, 
    name: "Root", 
    generation: 0, 
    children: 0,
    parent: null,
    fx: width / 2, // Fixed position for root
    fy: height / 2,
    born: Date.now()
  };
  nodes.push(rootNode);
  
  let currentNodeId = 1;
  let activeGeneration = 0;
  
  // Branching process: each node can produce offspring
  function branchFromNode(parentNode) {
    const numOffspring = Math.floor(Math.random() * 3) + 1; // 1-3 offspring
    const newNodes = [];
    
    for(let i = 0; i < numOffspring; i++) {
      if(currentNodeId >= NUM_NODES) break;
      
      // Create new node with branching position
      const angle = (Math.PI * 2 * i / numOffspring) + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 40;
      
      const newNode = {
        id: currentNodeId,
        name: `Node-${currentNodeId}`,
        generation: parentNode.generation + 1,
        children: 0,
        parent: parentNode,
        // Initial position near parent with some randomness
        x: parentNode.x + Math.cos(angle) * distance * 0.5,
        y: parentNode.y + Math.sin(angle) * distance * 0.5,
        born: Date.now()
      };
      
      nodes.push(newNode);
      links.push({ 
        source: parentNode, 
        target: newNode,
        strength: 1 / (parentNode.generation + 1) // Weaker links for deeper generations
      });
      
      parentNode.children++;
      newNodes.push(newNode);
      currentNodeId++;
    }
    
    return newNodes;
  }
  
  function tick() {
    const now = Date.now();
    
    // Update links with dynamic effects
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .style("stroke", d => {
        // Pulse effect based on generation
        const pulse = Math.sin(now * 0.002 + d.target.generation) * 0.3 + 0.7;
        return d3.interpolate("#00BFFF", "#87CEEB")(pulse);
      })
      .style("stroke-width", d => {
        const age = (now - d.target.born) / 1000;
        const pulse = Math.sin(now * 0.003 + d.target.id) * 0.5 + 1.5;
        return Math.max(0.5, (2 - age * 0.1) * pulse);
      })
      .style("opacity", d => {
        const age = (now - d.target.born) / 1000;
        return Math.max(0.3, 0.9 - age * 0.02);
      });
    
    // Update nodes with sophisticated effects
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => {
        const age = (now - d.born) / 1000;
        const baseRadius = NODE_RADIUS_BASE + Math.sqrt(d.children + 1) * 2;
        const pulse = Math.sin(now * 0.004 + d.id * 0.5) * 1.5 + 1;
        const growth = Math.min(1, age * 0.5); // Grow over time
        return baseRadius * growth * pulse;
      })
      .style("fill", d => {
        const pulse = Math.sin(now * 0.003 + d.generation) * 0.3 + 0.7;
        return d3.interpolate(
          nodeColor(d.generation), 
          "#FFFFFF"
        )(pulse * 0.2);
      })
      .style("opacity", d => {
        const age = (now - d.born) / 1000;
        return Math.max(0.6, 1 - age * 0.01);
      })
      .style("filter", d => {
        // Different glow effects for different generations
        if (d.generation === 0) return "url(#pulseGlow)";
        if (d.children > 0) return "url(#nodeGlow)";
        return "url(#linkGlow)";
      });
  }
  
  function restart() {
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    
    // Update links with enter/exit animations
    link = link_container.selectAll("line.link")
      .data(links, d => `${d.source.id}-${d.target.id}`);
      
    link.exit()
      .transition()
      .duration(500)
      .style("opacity", 0)
      .remove();
      
    link = link.enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "url(#linkGradient)")
      .style("stroke-width", 0)
      .style("opacity", 0)
      .style("filter", "url(#linkGlow)")
      .merge(link)
      .transition()
      .duration(1000)
      .style("stroke-width", 2)
      .style("opacity", 0.8);
    
    // Update nodes with sophisticated enter animation
    node = node_container.selectAll("circle.node")
      .data(nodes, d => d.id);
      
    node.exit()
      .transition()
      .duration(800)
      .attr("r", 0)
      .style("opacity", 0)
      .remove();
      
    const nodeEnter = node.enter()
      .append("circle")
      .attr("class", "node")
      .attr("r", 0)
      .style("opacity", 0)
      .style("fill", d => nodeColor(d.generation))
      .style("stroke", "#FFFFFF")
      .style("stroke-width", 0.5)
      .style("filter", "url(#nodeGlow)")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
    
    node = nodeEnter.merge(node)
      .transition()
      .duration(1200)
      .attr("r", d => NODE_RADIUS_BASE + Math.sqrt(d.children + 1) * 2)
      .style("opacity", 1);
    
    simulation.on("tick", tick);
    simulation.alpha(0.8).restart();
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
    if (event.subject.id !== 0) { // Don't unfix root node
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }
  
  // Initial setup
  restart();
  
  // Branching process animation
  function nextGeneration() {
    if(currentNodeId >= NUM_NODES) return;
    
    // Find nodes from current active generation that can branch
    const branchingCandidates = nodes.filter(n => 
      n.generation === activeGeneration && 
      Math.random() < BRANCH_PROBABILITY &&
      n.children < 3
    );
    
    if(branchingCandidates.length === 0) {
      activeGeneration++;
      if(activeGeneration < 6) { // Limit depth
        setTimeout(nextGeneration, GENERATION_DELAY);
      }
      return;
    }
    
    // Branch from random candidates
    branchingCandidates.forEach(parentNode => {
      if(currentNodeId < NUM_NODES && Math.random() < 0.8) {
        branchFromNode(parentNode);
      }
    });
    
    restart();
    
    // Schedule next generation
    setTimeout(() => {
      activeGeneration++;
      setTimeout(nextGeneration, GENERATION_DELAY);
    }, GENERATION_DELAY / 2);
  }
  
  // Start the branching process
  setTimeout(() => {
    branchFromNode(rootNode); // First generation
    restart();
    setTimeout(nextGeneration, GENERATION_DELAY);
  }, 1500);
});
