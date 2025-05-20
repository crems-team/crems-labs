import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { Feature, Geometry } from 'geojson';
import { ChevronLeft } from 'lucide-react';

interface USMapProps {
  width: number;
  height: number;
  onStateSelect: (state: string, stateCode: string) => void;
}

const USMap: React.FC<USMapProps> = ({ width, height, onStateSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [usData, setUsData] = useState<Feature[]>([]);
  const staticLabelRef = useRef<HTMLDivElement>(null);

  // Define color scale based on regions
  const regionColors = {
    // north: '#f1efa0',  // Yellowish
    // midwest: '#a48e9c', // Purple
    // midAtlantic: '#297588', // Teal/Blue
    // coastal: '#e2643d'  // Orange
    available: '#98FB98',   
    notAvailable: '#a48e9c',  
  };

  // Define a function to get the region color
  const getRegionColor = (d: Feature<Geometry, any>) => {
    const id = d.id;

    // // North region (yellowish)
    // if (['53', '41', '16', '56', '38', '46', '27', '55', '36', '09', '50', '33', '25', '44', '10'].includes(String(id))) {
    //   return regionColors.north;
    // }

    // // Mid-West region (purplish)
    // if (['30', '49', '08', '32', '35', '04', '20', '31', '29', '19', '40'].includes(String(id))) {
    //   return regionColors.midwest;
    // }

    // // Mid-Atlantic region (teal/blue)
    // if (['17', '18', '39', '21', '54', '42', '34', '11', '24', '51', '37', '45', '13', '01', '28', '47', '05', '22', '48'].includes(String(id))) {
    //   return regionColors.midAtlantic;
    // }

    // // Coastal region (orange)
    // if (['06', '02', '15', '12'].includes(String(id))) {
    //   return regionColors.coastal;
    // }
    if (['06', '12', '48', '17', '18', '26', '39'].includes(String(id))) {
        return regionColors.available;
      }
    // Default gray for any other states
    return '#bcb3b3';
  };

  useEffect(() => {
    // Load US map data
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(response => response.json())
      .then((topology: TopoJSON.Topology<TopoJSON.Objects<TopoJSON.Properties>>) => {
        const features = feature(topology, topology.objects.states as TopoJSON.GeometryCollection).features;
  
        // Définir le type pour le mapping ID → Code
        type StateId = keyof typeof stateIdToCode;
        const stateIdToCode = {
          "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", 
          "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL", 
          "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", 
          "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", 
          "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS", 
          "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", 
          "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", 
          "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", 
          "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", 
          "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI", 
          "56": "WY"
        } as const;
  
        // Ajouter le code d'état à chaque feature
        const enhancedFeatures = features.map(f => {
          const id = f.id as StateId;
          return {
            ...f,
            properties: {
              ...f.properties,
              stateCode: stateIdToCode[id]
            }
          };
        });
        console.log(enhancedFeatures);
        setUsData(enhancedFeatures);
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !usData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoAlbersUsa()
      .fitSize([width, height], { type: 'FeatureCollection', features: usData });

    const path = d3.geoPath().projection(projection);

    // Create staticLabel
    const staticLabel = d3.select(staticLabelRef.current);

    // Create the map
    const g = svg.append('g');

    // Draw states
    g.selectAll('path')
      .data(usData)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('class', 'state')
      .attr('fill', d => getRegionColor(d as Feature<Geometry, any>))
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
      .on('click', (event, d: any) => {
        onStateSelect(d.properties.name, d.properties.stateCode);
      });

    // Add state codes as labels
    g.selectAll('text')
      .data(usData)
      .enter()
      .append('text')
      .attr('transform', d => {
        const centroid = path.centroid(d as any);
        return centroid ? `translate(${centroid})` : '';
      })
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-semibold text-gray-800')
      .text(d => d.id ?? '');

  }, [usData, width, height, onStateSelect]);

  return (
      <div className="position-relative">
          <div
              ref={staticLabelRef}
              className="position-absolute top-0 left-0 w-100 text-center mb-2 bg-white px-3 rounded shadow-sm font-weight-bold"
              style={{ opacity: 0, transition: 'opacity 0.2s ease' }}
          />
          <svg
              ref={svgRef}
              width={width}
              height={height}
              className="d-block mx-auto"
          />
          <div className="mb-1 ml-1">
            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                <span style={{ backgroundColor: '#98FB98', padding: '5px', marginRight: '5px' }}></span> Available
                </li>
                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                <span style={{ backgroundColor: '#bcb3b3', padding: '5px', marginRight: '5px' }}></span> Not Available
                </li>                                     
            </ul>
        </div>
      </div>
  );
};

export default USMap;