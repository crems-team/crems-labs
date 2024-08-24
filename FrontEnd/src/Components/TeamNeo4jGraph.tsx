import React, { useState, useEffect} from 'react';
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



  useEffect(() => {
    const fetchData = async () => {

      TeamService.getTeam({id :id})
              .then((response: any) => {
                setTeamNeo4jData(response.data);
                if(teamNeo4jData){
                setNodes(teamNeo4jData.nodes);
                setLinks(teamNeo4jData.links);
                }
                console.log(nodes);

               
              })
              .catch((e: Error) => {
                console.log(e);
              
              });
      
      
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if(teamNeo4jData){
      setNodes(teamNeo4jData.nodes);
      setLinks(teamNeo4jData.links);
      }
  }, [teamNeo4jData]);

  const handleNodeClick = (node:any) => {
    // Handle the click event, e.g., display details in a modal or a sidebar
    console.log('Node clicked:', node);
  };


  return (
    <div style={{ height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      {teamNeo4jData ?<ForceGraph2D  // Specify types for nodes
      enableNodeDrag={false}
      enableZoomInteraction={true}
      width={650}  // Adjust the width as needed
      height={500}
      graphData={{ nodes, links }}
      nodeAutoColorBy="agentoffice"  // Optional for color assignment  
      onNodeClick={handleNodeClick}
      maxZoom={2}
      minZoom={1}
      nodeCanvasObject={(node, ctx) => {
        const label = node.agentname;
        const nodeSize = 15; // Fixed size for the node
        const fontSize = 7; // Fixed font size for the label
    
        const extendedX = node.x * (nodes.length == 2 && links.length == 2 ? 5 : 2); // Extend the x-coordinate
        const extendedY = node.y * (nodes.length == 2 && links.length == 2 ? 5 : 2); // Extend the y-coordinate
    
        // Draw the node circle with extended position
        ctx.beginPath();
        ctx.arc(extendedX, extendedY, nodeSize, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.closePath();
    
        // Draw the label with extended position
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(label, extendedX, extendedY);
    
        // Return empty object to avoid rendering default node
        return {};
      }}
      linkCanvasObject={(link, ctx, globalScale) => {
        const label = link.count;
        const fontSize = 6;  // Font size for the label
    
        // Extend the length of the link
        const extensionFactor = links.length == 2 ? 5 : 2;
        const extendedSourceX = link.source.x * extensionFactor;
        const extendedSourceY = link.source.y * extensionFactor;
        const extendedTargetX = link.target.x * extensionFactor;
        const extendedTargetY = link.target.y * extensionFactor;
    
        // Check for bidirectional links and determine direction
        const isBidirectional = links.some(otherLink =>
            otherLink.source === link.target && otherLink.target === link.source
        );
    
        let curveOffset;
        if (isBidirectional) {
            // Determine the direction of the curve based on the source and target identifiers
            curveOffset = link.source.id < link.target.id ? 20 : -30;
            const controlPointX = (extendedSourceX + extendedTargetX) / 2 + curveOffset;
            const controlPointY = (extendedSourceY + extendedTargetY) / 2;
    
        // Calculate the exact midpoint of the curve
        const midPointX = 0.25 * extendedSourceX + 0.5 * controlPointX + 0.25 * extendedTargetX;
        const midPointY = 0.25 * extendedSourceY + 0.5 * controlPointY + 0.25 * extendedTargetY;
    
        // Draw the curved link
        ctx.beginPath();
        ctx.moveTo(extendedSourceX, extendedSourceY);
        ctx.quadraticCurveTo(controlPointX, controlPointY, extendedTargetX, extendedTargetY);
        ctx.strokeStyle =  '#DCDCDC'; 
        ctx.stroke();
    
        // Draw the label at the exact midpoint
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'start';
        ctx.textBaseline = 'hanging'; 
        ctx.fillStyle = 'black';
        ctx.fillText(label, midPointX , midPointY);
    
        // Arrow size and calculation
        const arrowSize = 10;
        const angle = Math.atan2(extendedTargetY - controlPointY , extendedTargetX - controlPointX);

        const arrowX = extendedTargetX - arrowSize * Math.cos(angle);
        const arrowY = extendedTargetY - arrowSize * Math.sin(angle);
    
        // Draw the arrowhead
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, arrowSize / 6);
        ctx.lineTo(-arrowSize, -arrowSize / 4);
        ctx.closePath();
        ctx.fillStyle = '#C0C0C0';
        ctx.fill();
        ctx.restore();
        } else {
            curveOffset = 30;  // Default curve for non-bidirectional links
            ctx.beginPath();
        ctx.moveTo(extendedSourceX, extendedSourceY);
        ctx.lineTo(extendedTargetX, extendedTargetY);
        //ctx.quadraticCurveTo(controlPointX, controlPointY, extendedTargetX, extendedTargetY);
        ctx.strokeStyle = '#DCDCDC';
        ctx.stroke();
    
        // Draw the label
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'black';
        ctx.fillText(label, (extendedSourceX + extendedTargetX) / 2, (extendedSourceY + extendedTargetY) / 2);
    
        // Arrow size and calculation
        const arrowSize = 10;
        //const angle = Math.atan2(extendedTargetY - controlPointY, extendedTargetX - controlPointX);
        const angle = Math.atan2(extendedTargetY - extendedSourceY, extendedTargetX - extendedSourceX);

    
        // Calculate the coordinates of the arrow points
        const arrowX = extendedTargetX - arrowSize * Math.cos(angle);
        const arrowY = extendedTargetY - arrowSize * Math.sin(angle);
    
        // Draw the arrowhead
        ctx.save();
        ctx.beginPath();
        ctx.translate(arrowX, arrowY);
        ctx.rotate(angle);
        ctx.moveTo(0, 0);
        ctx.lineTo(-arrowSize, arrowSize / 6);
        ctx.lineTo(-arrowSize, -arrowSize / 6);
        ctx.closePath();
        ctx.fillStyle = '#C0C0C0';
        ctx.fill();
        ctx.restore();
    
        // Return empty object to avoid rendering default link
        return {};
        }
    
        
    
        // Return empty object to avoid rendering default link
        return {};
    }}
    
    
    
    
      
        

      />
      : <div>Loading Chart...</div>
        
      }
      
    </div>

  );
};

export default TeamNeo4jGraph;
