import React, { useState,useEffect } from 'react';
import AgentService from "../Services/AgentService";
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';



interface ComponentProps {
    id: string,
    officeId: string,
  }


const OfficeRankingAgentPerformance : React.FC<ComponentProps> = ({ id,officeId }) => {


    const [data, setData] = useState<(any[])>([]);
    const [officeName, setOfficeName] = useState<(string)>();
    const navigate = useNavigate();




    useEffect(() => {

                
            const fetchData=()=>{
                AgentService.getOfficeRankingReport({id,officeId})
                .then((response: any) => {
                    //console.log(response.data);
                    if(response.data){

                        setOfficeName(response.data[0].officeName);
                        const data = [
                            ['Agents', '12 month Performance',{ role: 'annotation' },{ role: 'style' },'agentId'],
                            ...response.data.map((element: any) => [
                                element.firstName+' '+element.lastName,
                                parseInt(element.nombre|| 0),
                                parseInt(element.ranking|| 0),
                                (element.agentId === id) ? 'color: orange' : 'color: blue',
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

    }, [id,officeId]); 

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
            const agentId = data[selectedRow + 1][4]; // Retrieve agentId from data array
            //const url = `https://crems-labs.com/AgentProdReports/${agentId}`;
           // window.location.href = url;
            navigate(`/AgentProdReports/${agentId}`);

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