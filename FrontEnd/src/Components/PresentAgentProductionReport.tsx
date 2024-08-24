import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';
import DataPresentRep from '../Models/DataPresentRep';


interface OtherComponentProps {
    id: string;
  }


const PresentAgentProductionReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [presentRepoData, setPresentRepoData] = useState<Array<DataPresentRep>>([]);
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
                AgentService.getDataPresentReport({id})
                .then((response: any) => {
                    setPresentRepoData(response.data) ;
                    //console.log(response.data);
                    if(response.data){
                        console.log('in response');
                        console.log(id);


                        const data = [
                            ['Year-to-Date', 'Total MLS List', 'Total MLS Sell', 'Total Non-MLS', 'Total', { role: 'annotation' }],
                            ...response.data.map((element: any) => [
                                element.monthName,
                                element.LIST || 0,
                                element.SELL || 0,
                                element.DNA || 0,
                                0,
                                (element.LIST + element.SELL + element.DNA ).toString()

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
        chartType="ColumnChart"
        data={data}
        options={{
            title: "12 Months Production Performance",
            //width: 900,
            //height: 500,
            chartArea: {width:'85%'},
            isStacked: true,
            legend: { position: 'bottom' },
            series: {
                0: { color: 'red' },
                1: { color: 'blue' },
                2: { color: 'green' },
                3: {
                    annotations: {
                        stem: {
                            color: "transparent",
                            length: 28
                        },
                        textStyle: {
                            color: "#000000",
                        }
                    },
                    enableInteractivity: false,
                    tooltip: "none",
                    visibleInLegend: false
                }
            }
        }}
        />)
        :<div>Loading Chart...</div>
        
}
        </div>
    )
  };

  export default PresentAgentProductionReport;