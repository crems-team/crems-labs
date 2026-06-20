import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import {
  setSankeyReportClicked,
  setOfficeRankingLOClicked,
  setLoanOfficerByAgentClicked,
  setIdAgentLO,
  setIdOfficeLO,
} from '../Redux/Slices/MapSlice';
import { useAppDispatch } from '../Hooks/DispatchHook';
import LoanOfficerService from '../Services/LoanOfficerService';
import AgentService from '../Services/AgentService';
import AgentInfos from '../Models/AgentInfos';

type Agent = {
  agentId: number;
  Name: string;
  Nlistings: number;
  total: number;
  captureRate: number;
};

type SankeyNode = {
  agentId: string;
  name: string;
  depth: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
};

type SankeyLink = {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
};

type Props = { officerId: string };

export default function LoanOfficerSankeyReport({ officerId }: Props) {
  const [data, setData] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<SankeyLink | null>(null);

  const sankeyReportClicked = useSelector((s: RootState) => s.map.sankeyReportClicked);
  const officeRankingLOClicked = useSelector((s: RootState) => s.map.officeRankingLOClicked);
  const loanOfficerByAgentClicked = useSelector((s: RootState) => s.map.loanOfficerByAgentClicked);
  const dispatch = useAppDispatch();

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch data
  useEffect(() => {
    let alive = true;
    setLoading(true);
    LoanOfficerService.getSankeyData({ officerId })
      .then((res: any) => {
        if (!alive) return;
        setData(res?.data?.listings ?? []);
        setLoading(false);
      })
      .catch((e: Error) => {
        if (!alive) return;
        setError(e.message);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [officerId]);

  // Trigger resize on orientation change (iOS/Safari)
  useEffect(() => {
    const mq: MediaQueryList = window.matchMedia('(orientation: landscape)');
    const onChange = () => requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    if ('addEventListener' in mq) mq.addEventListener('change', onChange);
    // legacy fallback
    (mq as any).addListener?.(onChange);
    return () => {
      if ('removeEventListener' in mq) mq.removeEventListener('change', onChange);
      (mq as any).removeListener?.(onChange);
    };
  }, []);

  // Draw / Redraw
  useEffect(() => {
    if (!svgRef.current || !wrapRef.current || data.length === 0) return;

    const container = wrapRef.current;
    const { width: w, height: h } = container.getBoundingClientRect();
    if (!w || !h) return;

    // Clean
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Marges (for labels)
    const margin = { top: 40, right: 220, bottom: 48, left: 180 };
    const innerW = Math.max(320, w - margin.left - margin.right);
    const innerH = Math.max(260, h - margin.top - margin.bottom);

    //  nodes/links
    const left: SankeyNode[] = [...data]
      .sort((a, b) => b.total - a.total)
      .map(a => ({ name: a.Name, depth: 0, agentId: String(a.agentId) }));
    const right: SankeyNode[] = [...data]
      .sort((a, b) => a.captureRate - b.captureRate)
      .map(a => ({ name: a.Name, depth: 1, agentId: String(a.agentId) }));

    const nodes: SankeyNode[] = [...left, ...right];
    const links: SankeyLink[] = data.map(a => ({
      source: left.find(n => n.name === a.Name)!,
      target: right.find(n => n.name === a.Name)!,
      value: 1,
    }));

    const sankeyGen = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(20)
      .nodePadding(8)
      .extent([[margin.left, margin.top], [margin.left + innerW, margin.top + innerH]])
      .nodeSort(() => 0);

    const { nodes: Lnodes, links: Llinks } = sankeyGen({ nodes, links });

    // colors
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
      '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
      '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'
    ];
    const color = d3.scaleOrdinal<string, string>()
      .domain(data.map(d => d.Name))
      .range(colors);

    // SVG responsive
    svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${w} ${h}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('overflow', 'visible');

    // Title colomns
    svg.append('text')
      .attr('x', margin.left - 10)
      .attr('y', margin.top - 12)
      .attr('text-anchor', 'start')
      .attr('font-weight', '700')
      .attr('fill', '#333')
      .text('Agents by Sales');

    svg.append('text')
      .attr('x', margin.left + innerW + 10)
      .attr('y', margin.top - 12)
      .attr('text-anchor', 'end')
      .attr('font-weight', '700')
      .attr('fill', '#333')
      .text('Agents by Opportunity');

    // Links
    svg.append('g')
      .attr('stroke-opacity', 0.45)
      .selectAll('path')
      .data(Llinks)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', d => color((d as any).source.name))
      // .attr('stroke-width', d => Math.max(12, (d as any).width ?? 12))
      .attr('stroke-width', 15)
      .style('mix-blend-mode', 'multiply')
      .style('cursor', 'pointer')
      .on('click', (_, d: any) => setSelectedLink(d))
      .on('mouseover', function () { d3.select(this).attr('stroke-opacity', 0.9); })
      .on('mouseout', function () { d3.select(this).attr('stroke-opacity', 0.45); });

    // nodes
    svg.append('g')
      .selectAll('rect')
      .data(Lnodes)
      .join('rect')
      .attr('x', d => d.x0!)
      .attr('y', d => d.y0!)
      .attr('height', d => (d.y1! - d.y0!))
      .attr('width', sankeyGen.nodeWidth())
      .attr('fill', d => color(d.name))
      .attr('stroke', '#000');

    // Labels 
    const agentByName = new Map(data.map(a => [a.Name, a]));
    svg.append('g')
      .selectAll('text')
      .data(Lnodes)
      .join('text')
      .attr('x', d => (d.depth === 0 ? d.x0! - 8 : margin.left + innerW + 8))
      .attr('y', d => (d.y0! + d.y1!) / 2)
      .attr('text-anchor', d => (d.depth === 0 ? 'end' : 'start'))
      .attr('dy', '0.35em')
      .attr('font-size', 12)
      .attr('fill', '#1f77b4')
      .text(d => {
        const a = agentByName.get(d.name)!;
        return d.depth === 0
          ? `${d.name} (Total ${a.total})`
          : `${d.name} (Capture Rate ${a.captureRate})`;
      });

    // Note
    svg.append('text')
      .attr('x', margin.left + innerW / 2)
      .attr('y', margin.top + innerH + 32)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('fill', '#333')
      .attr('font-weight', '700')
      .style('text-decoration', 'underline')
      .text('Click on any of the linking lines of the diagram to activate the reports below');

  }, [data]);

  //  resize container
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => setData(prev => [...prev]));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Link click
  useEffect(() => {
    if (!selectedLink) return;
    dispatch(setSankeyReportClicked(!sankeyReportClicked));
    if (officeRankingLOClicked) dispatch(setOfficeRankingLOClicked(false));
    if (loanOfficerByAgentClicked) dispatch(setLoanOfficerByAgentClicked(false));

    AgentService.getAgentInfos({ id: (selectedLink.source as any).agentId })
      .then((infos: AgentInfos[]) => {
        if (infos?.[0]) {
          dispatch(setIdOfficeLO(infos[0].officeId));
          dispatch(setIdAgentLO((selectedLink.source as any).agentId));
        }
      })
      .catch(console.error);
  }, [selectedLink]); 

  if (loading) return <div>Loading Chart...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        minHeight: 420,
        height: '58vh',
        background: '#fff',
        display: 'flex',
      }}
    >
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
