import React, { useRef,useState, useEffect} from 'react';
import ForceGraph2D, { ForceGraphMethods ,NodeObject} from 'react-force-graph-2d';
import TeamInvestigationService from "../../Services/TeamInvestigation/TeamInvestigationService";
import TeamInvestigationNeo4jData from "../../Models/TeamInvestigation/TeamInvestigationNeo4jData";
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';




interface ComponentProps {
  id: string
  filterCriteria : any
}


const TeamInvestigationGraph : React.FC<ComponentProps> = ({ id, filterCriteria }) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [teamInvestigationNeo4jData, setTeamInvestigationNeo4jData] = useState<TeamInvestigationNeo4jData>();
  const [processedLinks, setProcessedLinks] = useState<any[]>([]);
  const graphRef = useRef<ForceGraphMethods >();
  const initialPositions = useRef<{ [key: string]: { x: number; y: number } }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const navigate = useNavigate();
  const [fullScreenActivated, setFullScreenActivated] = useState<boolean>(false);
  const [graphLoading, setGraphLoading] = useState(false);


  
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
        
    setGraphLoading(true);

    const fetchData = async () => {

      TeamInvestigationService.getTeamByFilter({teamId :id},filterCriteria)
              .then((response: any) => {
                // setTeamNeo4jData(response.data);
                if(response.data){
                 setTeamInvestigationNeo4jData(response.data);
                }

               
              })
              .catch((e: Error) => {
                setGraphLoading(false);
                console.log(e);
              
              })
              .finally(() => {      
                setGraphLoading(false);
              });                   
    };

    fetchData();
  }
  }, [filterCriteria]);

  useEffect(() => {
    if(!id) return;
    
    const fetchData = async () => {
      setGraphLoading(true);
      TeamInvestigationService.getTeam({teamId :id})
      .then((response: any) => {                
        
        setTeamInvestigationNeo4jData(response.data);

      })
      .catch((e: Error) => {
        console.log(e);
      
      })
      .finally(() => {      
        setGraphLoading(false);
    });                
      
    };
    const { office, currentTab,tiers } = filterCriteria;
    // if one propertie is true
    const modeFilter = office || Object.values(tiers).some(tier => tier);
  
    if (!modeFilter &&  (currentTab === '' ||  currentTab ==='0')) {
    fetchData();
    }
  }, [id,filterCriteria]);

  // useEffect(() => {

  //   // console.log(processedLinks);

  //   if(teamNeo4jData){
  //         console.log(teamNeo4jData.nodes);

    
  //   setNodes(teamNeo4jData.nodes);
  //   // setLinks(teamNeo4jData.links);
  

  //     setLinks(processedLinks);
  //     teamNeo4jData.nodes.forEach((node: NodeObject) => {
  //       if(node.id){
  //       initialPositions.current[node.id] = { x: node.x!, y: node.y! };
  //       // console.log(node);
  //       }
  //     });
  //   }

  // }, [teamNeo4jData,processedLinks]);
  useEffect(() => {

      if(teamInvestigationNeo4jData){
      
      
      setNodes(teamInvestigationNeo4jData.nodes);
      // setLinks(teamNeo4jData.links);
    

        setLinks(teamInvestigationNeo4jData.links);
   
      }

    }, [teamInvestigationNeo4jData]);

    
  

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
      {/* <button type="button" className="btn btn-secondary btn-sm mb-1 ml-1" onClick={redirectToAPR}>
                              <span className="mr-1 text-bold">Return to APR Reports </span>
                              <i className="bi bi-box-arrow-right text-xl"></i>

      </button> */}
      <div ref={containerRef} style={{ backgroundColor: 'white',height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <ForceGraph2D
      ref={graphRef}
      graphData={{ nodes, links }}
      nodeId="id"
      enableZoomInteraction={true}
      width={dimensions.width}
      height={dimensions.height}

      // keep it simple like your screenshot: straight links, light gray
      linkColor={() => "#B7B7B7"}
      linkWidth={(link: any) => (link.size ? link.size : 1)}
      linkCurvature={() => 0}

      // optional: reduce physics jitter for a clean radial look
      d3AlphaDecay={0.06}
      d3VelocityDecay={0.25}

      // nodes + labels in canvas (no extra calculations)
      nodeCanvasObject={(node: any, ctx, globalScale) => {
        const n = node;

        const label = n.name ?? n.id;
        const radius = n.size ?? 6;

        // draw circle
        ctx.fillStyle = n.color ?? "#9CA3AF";
        ctx.beginPath();
        ctx.arc(n.x!, n.y!, radius, 0, 2 * Math.PI, false);
        ctx.fill();

        // draw label centered
        const fontSize = 14 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#111";
        ctx.fillText(label, n.x!, n.y!);
      }}

      // link canvas: no label, no bezier midpoint math
      linkCanvasObjectMode={() => "after"}
      linkCanvasObject={() => {
        // intentionally empty: links are rendered by default; this keeps your structure without extra logic
      }}
    />

    {graphLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255,255,255,0.85)",
            zIndex: 20
          }}
        >
          <BeatLoader size={12} />
        </div>
      )}

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

export default TeamInvestigationGraph;
