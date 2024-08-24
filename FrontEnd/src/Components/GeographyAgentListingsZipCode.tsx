import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';


interface OtherComponentProps {
    id: string;
  }


const GeoAgentListZipCodeRepo : React.FC<OtherComponentProps> = ({ id }) => {


    const [data, setData] = useState<(any[])>([]);


    useEffect(() => {

                
            const fetchData=()=>{
                AgentService.getDataGeoReport({id})
                .then((response: any) => {
                    //console.log(response.data);
                    if(response.data){

                        const data = [
                            ['Zip Code', 'Total Sell'],
                            ...response.data.map((element: any) => [
                                element.zipCode,
                                parseInt(element.total) || 0

                            ])
                        ];
                        
                        
    
                        setData(data);
                        console.log(data)
                        //setOptions(options);
                
                        }                 
                })
                .catch((e: Error) => {
                    console.log(e);
                });    
            }
            if(id){
                fetchData();
            }

    }, [id]); 

   /*   if (loading) {
        return <div className="overlay">
        <i className="fas fa-2x fa-sync-alt"> </i>
      </div>;
      } */ 
    
    
    return (
        <div>
        {data[1] ? <Chart
        width={'100%'}
        height={'400px'}
        chartType="ComboChart"
        data={data}
        options={{
            title : '12 Months Geo  Performance',
            vAxis: {title: "Agent's Listings"},
            hAxis: {title: 'Zip Code'},
            seriesType: 'bars',
            series: {5: {type: 'line'}}
          }}
        />
        : <div>Loading Chart...</div>
        
        }
        </div>
    )
  };

  export default GeoAgentListZipCodeRepo;