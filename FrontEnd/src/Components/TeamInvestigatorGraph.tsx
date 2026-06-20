import React, { useRef,useState, useEffect} from 'react';
import ForceGraph2D, { ForceGraphMethods ,NodeObject} from 'react-force-graph-2d';
import TeamService from "../Services/TeamService";
import TeamNeo4jData from "../Models/TeamNeo4jData";
import { useNavigate } from 'react-router-dom';



interface ComponentProps {
  id: string
  filterCriteria : any
}

const TeamInvestigatorGraph : React.FC<ComponentProps> = ({ id, filterCriteria }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [teamNeo4jData, setTeamNeo4jData] = useState<TeamNeo4jData>();
  const [processedLinks, setProcessedLinks] = useState<any[]>([]);
  const graphRef = useRef<ForceGraphMethods >();
  const initialPositions = useRef<{ [key: string]: { x: number; y: number } }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const [fullScreenActivated, setFullScreenActivated] = useState<boolean>(false);


  
  const handleZoomIn = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom * 1.2, 400); // Increase zoom by 20%
    }
  };

  // Function to zoom out
  const handleZoomOut = () => {
    if (graphRef.current) {
      const currentZoom = graphRef.current.zoom();
      graphRef.current.zoom(currentZoom / 1.2, 400); // Decrease zoom by 20%
    }
  };

  // Function to reset zoom
  const handleResetZoom = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400); // Fit the graph to the view
    }
  };

  useEffect(() => {
 
    const { office,currentTab, tiers } = filterCriteria;
       
  // if one propertie is true
  const modeFilter = office || Object.values(tiers).some(tier => tier);

  if (modeFilter && currentTab === '0') {
    const fetchData = async () => {

      TeamService.getTeamByFilter({id :id},filterCriteria)
              .then((response: any) => {
                // setTeamNeo4jData(response.data);
                if(response.data){
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
                // response.data.nodes.forEach((node: NodeObject) => {
                //   // if(node.id){
                //   initialPositions.current[node.id!] = { x: node.x!, y: node.y! };
                //   // console.log(initialPositions);
                // // }
                // });

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
  }
  }, [filterCriteria]);

  useEffect(() => {
    if(!id) return;
    
    const fetchData = async () => {
      TeamService.getTeam({id :id})
              .then((response: any) => {
                // setTeamNeo4jData(response.data);
                if(response.data){
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
                // response.data.nodes.forEach((node: NodeObject) => {
                //   // if(node.id){
                //   initialPositions.current[node.id!] = { x: node.x!, y: node.y! };
                //   // console.log(initialPositions);
                // // }
                // });

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
    const { office, currentTab,tiers } = filterCriteria;
    // if one propertie is true
    const modeFilter = office || Object.values(tiers).some(tier => tier);
  
    if (!modeFilter &&  (currentTab === '' ||  currentTab ==='0')) {
    fetchData();
    }
  }, [id,filterCriteria]);

  useEffect(() => {

    // console.log(processedLinks);

    if(teamNeo4jData){
          console.log(teamNeo4jData.nodes);

    
    setNodes(teamNeo4jData.nodes);
    // setLinks(teamNeo4jData.links);
  

      setLinks(processedLinks);
      teamNeo4jData.nodes.forEach((node: NodeObject) => {
        if(node.id){
        initialPositions.current[node.id] = { x: node.x!, y: node.y! };
        // console.log(node);
        }
      });
    }

  }, [teamNeo4jData,processedLinks]);

  useEffect(() => {
    // Delay the initial zoom to ensure the graph has been rendered
    const timer = setTimeout(() => {
      if (graphRef.current) {
        graphRef.current.zoom(5, 400); // Set initial zoom level (e.g., 2x zoom)
        graphRef.current.zoomToFit(400); // Optionally, fit the graph to the view

      }
    }, 5); // Set a minimal delay

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

 
  // Update the graph dimensions when the window is resized
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

  const handleNodeClick = (node:any) => {
    // Handle the click event, e.g., display details in a modal or a sidebar
    console.log('Node clicked:', node);
  };
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        setFullScreenActivated(true);
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    // Handler for fullscreen change
    const handleFullScreenChange = () => {
      const isFullscreen = !!document.fullscreenElement; // Check if any element is in fullscreen
      setFullScreenActivated(isFullscreen);
    };

    // Attach the fullscreenchange event listener
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);
  // useEffect(() => {
  //   // Store initial positions when the component mounts
  //   if (graphRef.current&&teamNeo4jData) {
  //     teamNeo4jData.nodes.forEach((node: NodeObject) => {
  //       if(node.id){
  //         console.log(node);
  //         console.log(initialPositions);
  //       initialPositions.current[node.id] = { x: node.x!, y: node.y! };
       
  //     }
  //     });
  //   }
  // }, [graphRef.current]); 

  const handleNodeDragEnd = (node: NodeObject) => {
    if(node.id){
console.log(node);
    if (node && initialPositions.current[node.id]) {
      // Reset the node position to its initial position
      
      const { x, y } = initialPositions.current[node.id];
      node.x = x;
      node.y = y;

      if (graphRef.current) {
        // graphRef.current.refresh();
      }
    }
  }
  };

  const redirectToAPR = () => {
  
    navigate(`/AgentProdReports/${id}`);
  };

  return ( 
    <div>
      <button type="button" className="btn btn-info btn-sm mb-1 ml-1" onClick={toggleFullScreen}>
                                            <span className="mr-1 text-bold">Fullscreen</span>
                                            <i className="bi bi-arrows-fullscreen text-xl"></i>                                            

      </button>
      <button type="button" className="btn btn-secondary btn-sm mb-1 ml-1" onClick={redirectToAPR}>
                              <span className="mr-1 text-bold">Return to APR Reports </span>
                              <i className="bi bi-box-arrow-right text-xl"></i>

      </button>
      <div ref={containerRef} style={{ backgroundColor: 'white',height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <ForceGraph2D
        ref={graphRef}
        graphData={{ nodes, links }}
        nodeId="id"
        enableZoomInteraction={true}
        width={dimensions.width}  // 650 firt level
        height={fullScreenActivated?dimensions.height:600} // 500 second level600
        // nodeAutoColorBy="agentoffice"
        // maxZoom={10}
        // minZoom={5}
        // onNodeDragEnd={handleNodeDragEnd} // Handle node drag end event
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
      <div style={{ 
        position: 'absolute', 
        top: '65px', 
        right: '10px', 
        background: 'rgba(255, 255, 255, 0.8)', 
        padding: '10px', 
        borderRadius: '5px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
      }}>
        {/* <button onClick={handleZoomIn}>Zoom In</button> */}
        <i className="bi bi-zoom-in fs-3" onClick={handleZoomIn} role="button" ></i>
        <i className="bi bi-zoom-out fs-3 mx-4 " onClick={handleZoomOut} role="button" ></i>
        <i className="bi bi-arrow-counterclockwise fs-3 " onClick={handleResetZoom} role="button" ></i>
      </div>
      </div>
    </div>
    );
};

export default TeamInvestigatorGraph;
