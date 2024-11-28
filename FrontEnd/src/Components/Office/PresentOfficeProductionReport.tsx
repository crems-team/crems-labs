import React, { useState,useEffect } from 'react';
import OfficeService from "../../Services/OfficeService";
import { Chart } from 'react-google-charts';
import OfficeDataPresentRep from '../../Models/Office/OfficeDataPresentRep';


interface OtherComponentProps {
    id: string;
  }


const PresentOfficeProductionReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [officePresentRepoData, setofficePresentRepoData] = useState<Array<OfficeDataPresentRep>>([]);
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
                OfficeService.getOfficeDataPresentReport({id})
                .then((response: any) => {
                    setofficePresentRepoData(response.data) ;
                    //console.log(response.data);
                    if(response.data){                


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

  export default PresentOfficeProductionReport;