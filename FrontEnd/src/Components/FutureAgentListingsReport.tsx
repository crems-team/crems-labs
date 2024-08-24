import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';
import DataFutureRep from '../Models/DataFutureRep';


interface OtherComponentProps {
    id: string;
  }


const FutureAgentListingsReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [futureRepoData, setFutureRepoData] = useState<Array<DataFutureRep>>([]);
    const [data, setData] = useState<(any[])>([]);
    const [options, setOptions] = useState<any>(null);






 /*    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                setLoading(true);

                AgentService.getAgentHistoData({ id })
                .then((response: any) => {
                  setMonthData(response.data);
                  setIsFetched(true);
                  //console.log(response.data);                
  
                })
                .catch((e: Error) => {
                  console.log(e);
                });
                setLoading(false);

            }
            fetchData();
        }
    }, []); */

 


    useEffect(() => {

                
            const fetchData=()=>{
                AgentService.getDataFutureReport({id})
                .then((response: any) => {
                    //setFutureRepoData(response.data) ;
                    //console.log(response.data);
                    if(response.data){

                        const data = [
                            ['Month', 'New Listings This Month', 'Pending Listings Today'],
                            ...response.data.map((element: any) => [
                                element.MonthName,
                                parseInt(element.newListings) || 0,
                                parseFloat(element.pendingListings) || 0

                            ])
                        ];
                        
                        
    
                        setData(data);
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
            {data[1]?(<Chart
        width={'100%'}
        height={'400px'}
        chartType="ComboChart"
        data={data}
        options={{
            title : 'Monthly Listing Trend',
            isStacked: false,
            chartArea: {width:'85%'},
            colors:['Purple','red'],
            legend: { position: 'bottom' },
            vAxis: {
                viewWindowMode:'explicit',
                viewWindow: {
                    min:0
                }
            },
            
            curveType: 'function',
            seriesType: 'bars',
            series: {1: {type: 'line'}}
          }}
        />)
        : <div>Loading Chart...</div>
        
        }
        </div>
    )
  };

  export default FutureAgentListingsReport;