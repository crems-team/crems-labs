import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Feature } from '../../../Models/UsaMapType';

interface StateMapProps {
  width: number;
  height: number;
  stateName: string;
  onCountySelect: (countyId: string,county: string) => void;
}

const StateMap: React.FC<StateMapProps> = ({ width, height, stateName, onCountySelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const staticLabelRef = useRef<HTMLDivElement>(null);
  const [countyData, setCountyData] = useState<Feature[]>([]);
  const [stateId, setStateId] = useState<string>('');

  useEffect(() => {
    // First, fetch states to get the FIPS code for the selected state
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(response => response.json())
      .then(topology => {
        const stateFeatures = (feature(topology, topology.objects.states) as any).features;
        const selectedState = stateFeatures.find(
          (f: Feature) => f.properties.name === stateName
        );
        if (selectedState) {
          setStateId(selectedState.id);
        }
      });
  }, [stateName]);

  useEffect(() => {
    if (!stateId) return;

    // Load county data
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json')
      .then(response => response.json())
      .then(topology => {
        const features = (feature(topology, topology.objects.counties) as any).features;
        // Filter counties for the selected state using FIPS code
        const stateCounties = features.filter((f: Feature) => 
          f.id.startsWith(stateId)
        );
        setCountyData(stateCounties);
      });
  }, [stateId]);

  useEffect(() => {
    if (!svgRef.current || !countyData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create a GeoJSON feature collection for the state's counties
    const countyFeatureCollection = {
      type: 'FeatureCollection',
      features: countyData
    };

    // Calculate bounds for the state
    const bounds = d3.geoBounds(countyFeatureCollection as any);
    const centerX = (bounds[0][0] + bounds[1][0]) / 2;
    const centerY = (bounds[0][1] + bounds[1][1]) / 2;
    
    // Create projection centered on the state
    const projection = d3.geoMercator()
      .center([centerX, centerY])
      .fitSize([width, height], countyFeatureCollection as any);

    const path = d3.geoPath().projection(projection);

    // Create staticLabel
    const staticLabel = d3.select(staticLabelRef.current);

    // Create the map
    const g = svg.append('g');

    // Draw counties with a color gradient based on their position
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, countyData.length]);

    // Draw counties
    g.selectAll('path')
      .data(countyData)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('class', 'county')
      .attr('fill', (d, i) => colorScale(i))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', '0.5')
      .on('mouseover', function(event, d: any) {
        d3.select(this).attr('opacity', 0.8);
        staticLabel.text(`${d.properties.name} (${d.id})`).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        staticLabel.style('opacity', 0);
      })
      .on('click', (event, d) => {
        onCountySelect(d.id, d.properties.name);
      });

  }, [countyData, width, height, onCountySelect]);

  return (
      <div className="position-relative">
        <div
              ref={staticLabelRef}
              className="position-relative top-0 left-0 w-100 text-center mb-2 bg-white px-3 rounded shadow-sm font-weight-bold"
              style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
          />
          <svg
              ref={svgRef}
              width={width}
              height={height}
              className="mx-auto d-block"   
          />          
      </div>
  );
};

export default StateMap;