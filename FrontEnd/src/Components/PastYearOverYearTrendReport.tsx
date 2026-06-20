import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';

interface OtherComponentProps {
    id: string;
  }

type MonthData = [string, string, string];

const PastYearOverYearTrendReport : React.FC<OtherComponentProps> = ({ id }) => {


    const [monthData, setMonthData] = useState<(MonthData)[]>();

    const [data, setData] = useState<(string | number)[][]>([]);
    const [options, setOptions] = useState<any>(null);



 


    useEffect(() => {

                
            const fetchData=()=>{
                AgentService.getAgentHistoData({id})
                .then((histoData: any) => {
                    setMonthData(histoData) ;
                    //console.log(response.data);
                    if(histoData){
                        console.log('in response');
                        console.log(id);


                        const data = [
                            ['Month', 'Past 12-Months', 'Current 12-Months'],
                            ...histoData.map((element: any) => [
                                element[0],
                                parseInt(element[1] || '0'),
                                parseInt(element[2] || '0')
                            ])
                        ];
                        const options = {
                            title: 'Agent Performance',
                            legend: { position: 'bottom' },
                            chartArea: { width: '85%' },
                            curveType: 'function',
                            pointSize: 5,
                            colors: ['orange', 'red'],
                            vAxis: {
                                viewWindowMode: 'explicit',
                                viewWindow: {
                                    min: 0
                                }
                            }
                        };
                        
    
                        setData(data);
                        setOptions(options);
             
                
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
        chartType="LineChart"
        data={data}
        options={options}

        />
        : <div>Loading Chart...</div>
    }   
        </div>
    )
    
  };

  export default PastYearOverYearTrendReport;