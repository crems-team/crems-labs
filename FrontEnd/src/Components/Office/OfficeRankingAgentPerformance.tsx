import React, { useState,useEffect } from 'react';
import OfficeService from "../../Services/OfficeService";
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';



interface ComponentProps {
    id: string,
  }


const OfficeRankingAgentPerformance : React.FC<ComponentProps> = ({ id }) => {


    const [data, setData] = useState<(any[])>([]);
    const [officeName, setOfficeName] = useState<(string)>();
    const navigate = useNavigate();




    useEffect(() => {

                
            const fetchData=()=>{
                OfficeService.getOfficeRankingReport({id})
                .then((response: any) => {
                    console.log(id);
                    if(response.data){

                        setOfficeName(response.data[0].officeName);
                        const data = [
                            ['Agents', '12 month Performance',{ role: 'annotation' },{ role: 'style' },'agentId'],
                            ...response.data.map((element: any) => [
                                element.firstName+' '+element.lastName,
                                parseInt(element.nombre|| 0),
                                parseInt(element.ranking|| 0),
                                'color: blue',
                                element.agentId



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
    
    const handleChartSelect = ({ chartWrapper }: any) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length > 0) {
            const selectedRow = selection[0].row;
            const officeId = data[selectedRow + 1][4]; // Retrieve agentId from data array
            //const url = `https://crems-labs.com/AgentProdReports/${agentId}`;
           // window.location.href = url;
            navigate(`/AgentProdReports/${officeId}`);

        }
    }; 

   

    return (
        <div>
        {data[1] ? <Chart
        width={'100%'}
        height={'400px'}
        chartType="BarChart"
        data={data}  
        options={{
			title: 'Office Ranking '+officeName,
			chartArea: {width: '60%'},
			hAxis: {
			  title: 'Total Production',
			  minValue: 0
			},
			vAxis: {
			  title: 'Agent Name'
			},
            bars: "horizontal",

		  }}
          chartEvents={[
            {
                eventName: 'select',
                callback: handleChartSelect
            }
        ]}
        chartWrapperParams={{
            view : {columns :[0,1,2,3]}
        }}
        
        />
        : <div>Loading Chart...</div>
        
        }
        </div>
    )
  };

  export default OfficeRankingAgentPerformance;