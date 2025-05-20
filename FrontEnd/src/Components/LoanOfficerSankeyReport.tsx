import React, { useEffect, useState,useRef } from 'react';
import Chart from 'react-google-charts';
import { SankeyData, SankeyChartData } from '../Models/SankeyData';
import LoanOfficerService from '../Services/LoanOfficerService';
import { toInteger } from 'lodash';
import AgentService from '../Services/AgentService';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { useNavigate } from 'react-router-dom';
import AgentInfos from "../Models/AgentInfos";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { setSankeyReportClicked,setOfficeRankingLOClicked,setLoanOfficerByAgentClicked,setIdAgentLO,setIdOfficeLO} from '../Redux/Slices/MapSlice'
import { useAppDispatch } from '../Hooks/DispatchHook';


interface Agent {
  agentId : number;
  Name: string;
  Nlistings: number;
  total: number;
  captureRate: number;
} 

interface SankeyNode {
  agentId : string;
  name: string;
  depth: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
}
interface SankeyChartProps {
  officerId: string;
}

//
interface CustomSankeyNode extends SankeyNode {
  name: string;
  depth: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface CustomSankeyLink extends SankeyLink {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
}

const LoanOfficerSankeyReport: React.FC<SankeyChartProps> = ({ officerId }) => {
  const [chartData, setChartData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<CustomSankeyLink | null>(null);
  const navigate = useNavigate();
  const margin = { top: 40, right: 1, bottom: 40, left: 40 };
  const [agentInfosData, setAgentInfosData] = useState<Array<AgentInfos>>([]);
  const sankeyReportClicked = useSelector((state: RootState) => state.map.sankeyReportClicked);
  const officeRankingLOClicked = useSelector((state: RootState) => state.map.officeRankingLOClicked);
  const loanOfficerByAgentClicked = useSelector((state: RootState) => state.map.loanOfficerByAgentClicked);
 
  const dispatch = useAppDispatch();




  const svgRef = useRef<SVGSVGElement>(null);
  const width = 1000;
  const height = 600;
  useEffect(() => {

    if (!svgRef.current) return;
        setLoading(true);
        LoanOfficerService.getSankeyData({officerId})
        .then((response: any) => {
            if(response.data){
                setChartData(response.data.listings);
                setLoading(false);

        }
        })
        .catch((e: Error) => {
            console.log(e);
            setError(e.message);
            setLoading(false);
        });
    // fetchData();
  }, [officerId]);
  


  useEffect(() => {

    if (!chartData || chartData.length === 0) return; 
    // if (!svgRef.current) return;
    // 
                
    const leftNodes: SankeyNode[] = [...chartData]
      .sort((a, b) => b.total - a.total)
      .map(agent => ({ name: agent.Name, depth: 0,agentId: agent.agentId.toString()  }));

    const rightNodes: SankeyNode[] = [...chartData]
      .sort((a, b) => a.captureRate - b.captureRate)
      .map(agent => ({ name: agent.Name, depth: 1, agentId: agent.agentId.toString()}));

    const nodes: SankeyNode[] = [...leftNodes, ...rightNodes];

    // 
    const links: SankeyLink[] = chartData.map(agent => ({
      source: leftNodes.find(n => n.name === agent.Name)!,
      target: rightNodes.find(n => n.name === agent.Name)!,
      value: 1,
    }));

    // 
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(20)
      .nodePadding(4) // remove space vertical between nodes
  .extent([[200, 80], [width - 5, height - 150]]) // remove margin left/right
        .nodeSort(() => 0);
    // 
    const { nodes: layoutNodes, links: layoutLinks } = sankeyGenerator({
      nodes,
      links,
    });
    //
    const customColors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
      "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
      "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"
    ];
    
    const colorScale = d3.scaleOrdinal(customColors)
      .domain(chartData.map(agent => agent.Name));
    // const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    // .domain(chartData.map(agent => agent.Name));

    const colorScaleLinks = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(chartData.map(agent => agent.agentId.toString()));

   // Ajuster le conteneur SVG
const svg = d3.select(svgRef.current)
.attr('width', '100%')
.attr('height', '90%')
// .attr('viewBox', `0 0 10 1000`)
// .style('overflow', 'visible'); // Permet un débordement contrôlé

    // add the links
    // svg.append('g')
    //   .selectAll('path')
    //   .data(layoutLinks)
    //   .join('path')
    //   .attr('d', sankeyLinkHorizontal())
    //   // .attr('stroke', '#000')
    //   .attr('stroke-opacity', 0.2)
    //   .attr('stroke', d => colorScale(d.source.name))
    //   .attr('stroke-width', d => Math.max(1, d.width!));
      svg.append('g')
      .selectAll('path')
      .data(layoutLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => colorScale(d.source.name)) // Couleur synchronisée
      .attr('stroke-opacity', 0.4)
      .attr('fill', 'none')
      // .attr('stroke-width', d => Math.max(1, d.width!))
      .attr('stroke-width', 15)
      .style('mix-blend-mode', 'multiply')
      .style('cursor', 'pointer')
      .data<CustomSankeyLink>(layoutLinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .on('click', (event: any, d: CustomSankeyLink) => {
        event.stopPropagation();
        setSelectedLink(d);
      })
      .on('mouseover', function(event: MouseEvent, d: CustomSankeyLink) {
        d3.select(this)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', 15);
      })
      .on('mouseout', function(event: MouseEvent, d: CustomSankeyLink) {
        d3.select(this)
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', 15);
      });


    // add the nodes
     svg.append('g')
      .selectAll('rect')
      .data(layoutNodes)
      .join('rect')
      .attr('x', d => d.x0!)
      .attr('y', d => d.y0!)
      .attr('height', d => d.y1! - d.y0!)
      .attr('width', sankeyGenerator.nodeWidth())
      .attr('fill', d => colorScale(d.name))
        .attr('stroke', '#000');
    //   .attr('fill', '#69b3a2');
      

    // Ajout des labels
    // svg.append('g')
    //   .selectAll('text')
    //   .data(layoutNodes)
    //   .join('text')
    //   .attr('x', d => d.depth === 0 ? d.x0! - 6 : d.x1! + 6)
    //   .attr('y', d => (d.y1! + d.y0!) / 2)
    //   .attr('text-anchor', d => d.depth === 0 ? 'end' : 'start')
    //   .text(d => d.name);
    // const salesMap = new Map(agents.map(agent => [agent.name, agent.captureRate]));
    const agentsMap = new Map(chartData.map(agent => [agent.Name, agent]));

    svg.append('g')
    .selectAll('text')
    .data(layoutNodes)
    .join('text')
    .attr('x', d => d.depth === 0 ? d.x0! - 6 : d.x1! + 6)
    .attr('y', d => (d.y1! + d.y0!) / 2)
    .attr('text-anchor', d => d.depth === 0 ? 'end' : 'start')
    .attr('font-size', d => d.depth === 0 ? 12 : 12)
    // .attr('fill', d => d.depth === 0 ? '#1f77b4' : '#ff7f0e')
    .attr('fill',  '#1f77b4' )
    .attr('dy', '0.35em')
    .attr('font-weight', '500')
    // .text(d => {
      // Ajout des ventes seulement à droite
      // return d.depth === 1 
      //   ? `${d.name} (${salesMap.get(d.name)})` 
      //   : d.name;
      .text(d => {
        const agentData = agentsMap.get(d.name)!;
        return d.depth === 0 
          ? `${d.name} (Total ${agentData.total})`  // Left
          : `${d.name} (Capture Rate ${agentData.captureRate})`;  // right
    });

     // label left
     svg.append('text')
     .attr('x', 150)
     .attr('y', 15)
     .attr('dy', '2em') // add space
     .text('Agents by Sales')
     .attr('text-anchor', 'start')
     .attr('font-weight', 'bold')
     .attr('fill', '#333');

   // label right
   svg.append('text')
     .attr('x', 1070)
     .attr('y', 15)
     .attr('dy', '2em') // add space
     .text('Agents by Opportunity')
     .attr('text-anchor', 'end')
     .attr('font-weight', 'bold')
     .attr('fill', '#333');
    setLoading(false);

    svg.append('text')
  .attr('x', 570) // Centrer horizontalement
  .attr('y', 500) // Positionner 30px du bas
  .text('Click on any of the linking lines of the diagram to activate the reports below')
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .attr('fill', '#333')
  .attr('font-weight', 'bold')
  .style('text-decoration', 'underline');


}, [chartData]);


useEffect(() => {
  if(!selectedLink) return ;

  dispatch(setSankeyReportClicked(!sankeyReportClicked));
  if(officeRankingLOClicked){
  dispatch(setOfficeRankingLOClicked(!officeRankingLOClicked));   
  }  
  if(loanOfficerByAgentClicked){
    dispatch(setLoanOfficerByAgentClicked(!loanOfficerByAgentClicked));   
    }


//   dispatch(setOfficeRankingLOClicked(officeRankingLOClicked?officeRankingLOClicked:!officeRankingLOClicked));

  console.log(sankeyReportClicked);

    var data = {
      id: selectedLink?.source.agentId
    };
    AgentService.getAgentInfos(data)
    .then((response: any) => {
      
      dispatch(setIdOfficeLO(response.data[0].officeId));
      dispatch(setIdAgentLO(selectedLink?.source.agentId));
      
    })
    .catch((e: Error) => {
      console.log(e);
    }); 
//   navigate(`/AgentProdReports/${selectedLink?.source.agentId}`);

}, [selectedLink]);


   
// if (loading) return <div>Loading...</div>;

const handleClickRankingReport = () => {
        // setIdAgentForGeoReport(idAgent);
        // setDisplayGeoReport(true);
        // setRankingReportClicked(!rankingReportClicked);
        dispatch(setSankeyReportClicked(sankeyReportClicked));
    };
     

return (
  <>
    {loading && <div>Loading Chart...</div>}
    {error && <div>Error: {error}</div>}
    {!loading && !error && <svg className="ml-5" ref={svgRef} />}
  </>
);
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div style={{ height: '100%', width: '100%' ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
//       <Chart
//         width={'100%'}
//         height={'500px'}
//         chartType="Sankey"
//         loader={<div>Loading Chart...</div>}
//         data={chartData}
//         options={{
//           sankey: {
//             // node: {
//             //   colors: ['#4a90e2'], // First column color
//             //   label: { fontName: 'Arial', fontSize: 14 },
//             // },
//             // link: {
//             //   colorMode: 'gradient', // Gradient links
//             //   colors: ['#66ff66'], // Link color
//             // },
//             link: { color: { fill: "#99ddff" } },
//           },
//         }}
//       />
//     </div>
//   );
};

export default LoanOfficerSankeyReport;