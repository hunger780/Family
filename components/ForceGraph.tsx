import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink, RelationshipType } from '../types';

interface ForceGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick: (node: GraphNode) => void;
  onBackgroundClick: () => void;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({ nodes, links, onNodeClick, onBackgroundClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Define Arrow markers
    const defs = svg.append("defs");
    
    // Standard arrow
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#64748b");

    const g = svg.append("g");
    
    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom).on("dblclick.zoom", null);
    
    svg.on("click", (event) => {
      if (event.target === svg.node()) {
        onBackgroundClick();
      }
    });

    // Deep copy data for D3
    const nodesData = nodes.map(d => ({ ...d }));
    const linksData = links.map(d => ({ ...d }));

    // Force Simulation with Hierarchy
    // Generation determines Y position. 
    // We multiply generation by a constant spacing (e.g., 120px)
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(nodesData)
      .force("link", d3.forceLink<GraphNode, GraphLink>(linksData).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("collide", d3.forceCollide().radius(45))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05)) // Weak center to allow Y force to dominate
      .force("y", d3.forceY((d) => (d.generation * 120)).strength(0.5)) // Vertical hierarchy
      .force("x", d3.forceX(0).strength(0.02)); // Slight centering horizontally

    simulationRef.current = simulation;

    // Draw Links
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(linksData)
      .enter().append("line")
      .attr("stroke", (d) => d.type === RelationshipType.PARENT_OF ? "#94a3b8" : "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-dasharray", (d) => d.type === RelationshipType.SPOUSE_OF ? "5,5" : "0")
      .attr("marker-end", (d) => d.type === RelationshipType.PARENT_OF ? "url(#arrow)" : null);

    // Draw Nodes
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodesData)
      .enter().append("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d);
      });

    // Node Circles
    node.append("circle")
      .attr("r", 22)
      .attr("fill", (d) => d.generation === 0 ? "#db2777" : (d.generation < 0 ? "#4f46e5" : "#059669")) // Pink for me, Indigo parents, Green kids
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("class", "shadow-lg");

    // Node Labels
    node.append("text")
      .text(d => d.name)
      .attr("x", 28)
      .attr("y", 5)
      .attr("fill", "#f1f5f9")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)");

    // Relation Labels
    node.append("text")
      .text(d => d.relationLabel || "")
      .attr("x", 28)
      .attr("y", 22)
      .attr("fill", "#cbd5e1")
      .attr("font-size", "11px")
      .attr("font-style", "italic");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, onNodeClick, onBackgroundClick]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900">
      <svg ref={svgRef} className="w-full h-full block" />
    </div>
  );
};