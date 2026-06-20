import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Feature } from '../../../Models/UsaMapType';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';

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
  const [selectedCountyId, setSelectedCountyId] = useState<string>('');
  const bouncingNodeRef = useRef<d3.Selection<SVGPathElement, any, any, any> | null>(null);
 //for autocomplete counties names
  const [searchTermCounty, setSearchTermCounty] = useState<string>('');
  const [suggestionsCounty, setSuggestionsCounty] = useState<Feature[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);


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
      .attr('data-id', d => d.id)   
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
      // svg.append('g')
      // .selectAll('text')
      // .data(countyData)
      // .enter()
      // .append('text')
      // .attr('transform', d => `translate(${path.centroid(d as any)})`)
      // .attr('text-anchor', 'middle')
      // .style('font-size', '7px')
      // .style('pointer-events', 'none')
      // .text(d => d.properties && d.properties.name ? d.properties.name : '');
  }, [countyData, width, height, onCountySelect]);

  //For animation county selected
  useEffect(() => {
    if (!selectedCountyId || !svgRef.current) return;
        const svg = d3.select(svgRef.current);

        const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, countyData.length]);

        if (bouncingNodeRef.current) {
          bouncingNodeRef.current.interrupt()
            .attr('transform', 'translate(0,0)')            
            .attr('fill', (d, i) => colorScale(i))
            .attr('fill-opacity', 1);

            
        }
    
        const countyFeatureCollection = {
          type: 'FeatureCollection',
          features: countyData
        };

        // Calculate bounds for the state
        const bounds = d3.geoBounds(countyFeatureCollection as any);
        const centerX = (bounds[0][0] + bounds[1][0]) / 2;
        const centerY = (bounds[0][1] + bounds[1][1]) / 2;
        
        const projection = d3.geoMercator()
        .center([centerX, centerY])
        .fitSize([width, height], countyFeatureCollection as any);
        const path = d3.geoPath().projection(projection);
  
        const node = svg.select<SVGPathElement>(`path[data-id='${selectedCountyId}']`);
        bouncingNodeRef.current = node;

        function bounce() {
          node.raise()
            .transition().duration(300)
              .attr('transform', () => {
                const c = path.centroid(node.datum() as any);
                return `translate(${c[0]},${c[1] - 5}) translate(${-c[0]},${-c[1]})`;
              })
              .attr('fill', '#ffcc00')

            .transition().duration(300)
              .attr('transform', 'translate(0,0)')
              .attr('fill', (d, i) => colorScale(i))

            .on('end', bounce);
        }

        bounce();
        return () => {
          if (bouncingNodeRef.current) {
            bouncingNodeRef.current.interrupt()
              .attr('transform', 'translate(0,0)')
              .attr('fill', (d, i) => colorScale(i))
              .attr('fill-opacity', 1);
          }
        };
       
  
  }, [selectedCountyId]);

  const searchCounties = (e: { query: string }) => {
    const query = e.query.trim().toLowerCase();
    if (!query) {
      setSuggestionsCounty([]);
      return;
    }
    const filtered = countyData.filter(c =>
      c.properties.name.toLowerCase().includes(query)
    );
    setSuggestionsCounty(filtered);
  };

  const clearSearchCounty = () => {
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, countyData.length]);

        if (bouncingNodeRef.current) {
          bouncingNodeRef.current.interrupt()
            .attr('transform', 'translate(0,0)')            
            .attr('fill', (d, i) => colorScale(i))
            .attr('fill-opacity', 1);

            
        }
    setSearchTermCounty('');
    setIsFiltered(false);
    setSuggestionsCounty([]);
    setSelectedCountyId('');
};

  return (
      <div className="position-relative">
        <div className="d-flex align-items-center gap-2 mb-2">
            <AutoComplete
            field="properties.name"
            value={searchTermCounty}
            suggestions={suggestionsCounty}
            completeMethod={searchCounties}
            onChange={(e) => setSearchTermCounty(e.value)}
            onSelect={(e) => {
              const sel = e.value as Feature;
              setSearchTermCounty(sel.properties.name);
              setSelectedCountyId(sel.id);
              setIsFiltered(true);
            }}
            placeholder="Choose a county…"
          />
           {isFiltered && (
            <Button 
                icon="pi pi-times" 
                className="ml-2 p-button-danger"
                label="Clear"
                onClick={clearSearchCounty}
            />
          )}
        </div>
        <div
              ref={staticLabelRef}
              className="position-relative top-0 left-0 w-100 text-center mb-2 bg-white px-3 rounded shadow-sm font-weight-bold"
              style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
          />
          <svg
           ref={svgRef}
           viewBox={`0 0 ${width} ${height}`}
           className="mx-auto d-block w-100 h-auto"
           preserveAspectRatio="xMidYMid meet"
         />      
      </div>
  );
};

export default StateMap;