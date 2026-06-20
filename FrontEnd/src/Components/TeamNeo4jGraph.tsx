import React, { useState, useEffect, useRef} from 'react';
import { ForceGraph2D } from 'react-force-graph';
import TeamService from "../Services/TeamService";
import TeamNeo4jData from "../Models/TeamNeo4jData";


interface ComponentProps {
  id: string
}

const TeamNeo4jGraph : React.FC<ComponentProps> = ({ id }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [teamNeo4jData, setTeamNeo4jData] = useState<TeamNeo4jData>();
  const [processedLinks, setProcessedLinks] = useState<any[]>([]);
  const [teamNeo4jDataValide, setTeamNeo4jDataValide] = useState<TeamNeo4jData>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });



  function filterValidLinks(data: any): any {
    // Create a map for quick lookup of node existence
    const nodesMap = new Map<string, Node>(data.nodes.map((node:any) => [node.id, node]));
  
    // Filter out invalid links where source or target node doesn't exist in the nodes array
    const validLinks = data.links.filter((link : any) => nodesMap.has(link.source) && nodesMap.has(link.target));
  
    console.log(nodesMap);

    console.log(validLinks);
    return {
      nodes: data.nodes, // nodes remain the same
      links: validLinks, // only valid links are passed
    };
  }

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {

      TeamService.getTeam({id :id})
              .then((response: any) => {
                // setTeamNeo4jData(response.data);
                if(response.data){
                  console.log(response.data.nodes);
                  console.log(response.data.links);
                // setNodes(teamNeo4jData.nodes);
                // setLinks(teamNeo4jData.links);
                // Process links to detect bidirectional relationships and set curvature
                const processedLinks = response.data.links.map((link :any) => ({ ...link })); // Clone links to avoid mutation
                const processedLinkSet = new Set(); // To avoid processing the same link twice

                for (let i = 0; i < processedLinks.length; i++) {
                  const linkA = processedLinks[i];
                  if (processedLinkSet.has(linkA)) continue; // Skip if already processed

                  // Find a matching reverse link (bidirectional link)
                  const reverseLinkIndex = processedLinks.findIndex(
                    (linkB: any) =>
                      linkB.source === linkA.target &&
                      linkB.target === linkA.source &&
                      !processedLinkSet.has(linkB)
                  );

                  if (reverseLinkIndex !== -1) {
                    // Bidirectional link found, set curvatures
                    processedLinks[i].curvature = 1;//0.2; // Curvature for one direction
                    processedLinks[reverseLinkIndex].curvature = 1;//-0.2; // Curvature for the opposite direction

                    // Mark both links as processed
                    processedLinkSet.add(linkA);
                    processedLinkSet.add(processedLinks[reverseLinkIndex]);
                  } else {
                    // No reverse link, this is a unidirectional link
                    processedLinks[i].curvature = 0; // Straight line
                  }
                  }
                  setProcessedLinks(processedLinks);
                }
                setTeamNeo4jData(response.data);

                // setNodes( [
                //   { id: '1', agentname: 'Alice', agentoffice: 'Office A', type: 'person' },
                //   { id: '2', agentname: 'Bob', agentoffice: 'Office B', type: 'person' },
                //   { id: '3', agentname: 'Charlie', agentoffice: 'Office C', type: 'person' },
            
                // ]);
                // setLinks( [
                //   { source: '1', target: '2', label: 'KNOWS' }, // Link from Alice to Bob
                //   { source: '2', target: '1', label: 'KNOWS' }, // Link from Bob to Alice
                //   { source: '1', target: '3', label: 'LIKES' },
                //   // Arrow from Alice to Bob
                // ]);
                // console.log(nodes);

               
              })
              .catch((e: Error) => {
                console.log(e);
              
              });
      
      
    };

    fetchData();
  }, [id]);

  useEffect(() => {

    // console.log(processedLinks);

    if(teamNeo4jData){

      // setTeamNeo4jDataValide(filterValidLinks(teamNeo4jData));
      console.log(teamNeo4jDataValide);
           
    setNodes(teamNeo4jData.nodes);
    // setLinks(teamNeo4jData.links);
    // console.log(teamNeo4jData.nodes);
    // console.log(processedLinks);

      // setLinks(processedLinks);
      setLinks(processedLinks);
    }
  }, [teamNeo4jData,processedLinks]);

  // useEffect(() => {
    
  //   setNodes(teamNeo4jDataValide?teamNeo4jDataValide.nodes:[]);
  //   // setLinks(teamNeo4jData.links);
  //   // console.log(teamNeo4jData.nodes);
  //   // console.log(processedLinks);

  //     // setLinks(processedLinks);
  //     setLinks(teamNeo4jDataValide?teamNeo4jDataValide.links:[]);      
  // }, [teamNeo4jDataValide]);

  const handleNodeClick = (node:any) => {
    // Handle the click event, e.g., display details in a modal or a sidebar
    console.log('Node clicked:', node);
  };


  return (
    <div style={{ position: 'relative',overflow: 'hidden',height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeId="id"
        enableZoomInteraction={true}
        width={dimensions.width}  // 650 firt level
        height={500} // 500 second level
        // nodeAutoColorBy="agentoffice"
        maxZoom={7}
        minZoom={5}
        // Customize node styling
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.agentname;
          const fontSize = 15 / globalScale;
          const nodeSize = node.size;
          ctx.font = `${fontSize}px Sans-Serif`;
  
          // Node colors based on type
          // let nodeColor = 'blue'; // Default color
          // if (node.type === 'company') nodeColor = 'red';
          // else if (node.type === 'technology') nodeColor = 'green';
  
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI, false);
          ctx.fill();
  
          // Draw node labels
          // ctx.fillStyle = 'black';
          // ctx.fillText(label, node.x! + 10, node.y! + 5);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'black';
          ctx.fillText(label, node.x!  , node.y! );
        }}
        // Customize link styling
        // linkDirectionalArrowLength={5} // Arrow size
        // linkDirectionalArrowRelPos={1} // Arrow at the end of the link
        // linkDirectionalParticles={2} // Optional: To show particles moving along the link
        // linkDirectionalParticleSpeed={0.002} // Optional: Speed of the particles
        linkWidth={(link) => (link.size ? link.size : 1)}
        linkCurvature={(link) => link.curvature || 0} // Apply curvature to the links
        linkCanvasObjectMode={() => 'after'} // Draw link labels
        //linkAutoColorBy={(link) => link.curvature}
        linkColor={() => '#B7B7B7'}
        linkCanvasObject={(link, ctx, globalScale) => {
          const label = link.count;
          if (!label) return;
  
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  
          // Position the label at the center of the straight link
          if(link.curvature === 0){
          const middlePos = {
            x: (link.source.x + link.target.x) / 2,
            y: (link.source.y + link.target.y) / 2,
          };
  
          ctx.fillText(label, middlePos.x, middlePos.y);
          }else{
          const midPoint = 0.5; // Halfway along the link

          // Find the control points for the Bezier curve
          const controlX = (link.source.x + link.target.x) / 2 + (link.target.y - link.source.y) * 1;
          const controlY = (link.source.y + link.target.y) / 2 + (link.source.x - link.target.x) * 1;
  
          // Calculate the position on the curved line
          const t = midPoint;
          const x = (1 - t) * (1 - t) * link.source.x + 2 * (1 - t) * t * controlX + t * t * link.target.x;
          const y = (1 - t) * (1 - t) * link.source.y + 2 * (1 - t) * t * controlY + t * t * link.target.y;
  
          ctx.fillText(label, x, y);
          }
        }}
    
      />
      </div>
    );
};

export default TeamNeo4jGraph;
