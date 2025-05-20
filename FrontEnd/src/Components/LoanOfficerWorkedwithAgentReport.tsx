import React, { useState,useEffect } from 'react';
import LoanOfficerService from "../Services/LoanOfficerService";
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';



interface ComponentProps {
    agentId: string,
  }


const LoanOfficerWorkedwithAgentReport : React.FC<ComponentProps> = ({agentId }) => {


    const [data, setData] = useState<(any[])>([]);
    const [AgentName, setAgentName] = useState<(string)>();
    const navigate = useNavigate();




    useEffect(() => {

                
            const fetchData=()=>{
                LoanOfficerService.getDataLOWorkedWithAgent(agentId)
                .then((response: any) => {
                    //console.log(response.data);
                    if(response.data){
                      setAgentName(response.data[0].agentName);
                        const data = [
                            ['Agents', '12 month Performance', { role: 'annotation' },{ role: 'style' }],
                            ...response.data.map((element: any) => [
                              element.officerName,
                              parseInt(element.total || 0),
                              parseInt(element.total || 0) +' ('+element.captureRate+'%)', 
                              'color: green'
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
            if(agentId){
                fetchData();
            }

    }, [agentId]); 

   /*   if (loading) {
        return <div className="overlay">
        <i className="fas fa-2x fa-sync-alt"> </i>
      </div>;
      } */ 
    
    // const handleChartSelect = ({ chartWrapper }: any) => {
    //     const chart = chartWrapper.getChart();
    //     const selection = chart.getSelection();
    //     if (selection.length > 0) {
    //         const selectedRow = selection[0].row;
    //         const agentId = data[selectedRow + 1][4]; // Retrieve agentId from data array
    //         //const url = `https://crems-labs.com/AgentProdReports/${agentId}`;
    //        // window.location.href = url;
    //         navigate(`/AgentProdReports/${agentId}`);

    //     }
    // }; 

   

    return (
        <div>
        {data[1] ? <Chart
        width={'100%'}
        height={'500px'}
        chartType="BarChart"
        data={data}  
        options={{
            title: 'Agent Name: '+AgentName,
            chartArea: {width: '50%'},
            hAxis: {
              title: 'Total Production',
              minValue: 0
            },
            vAxis: {
              title: 'Officer Name',
              reverse: true

            },
            
            bar: { groupWidth: "60%" },
            legend: { position: "bottom" },
            colors: ['green'],
            annotations: {
                alwaysOutside: true,
                stem: {
                  length: -5 // Ajuste la position verticale
                },
                textStyle: {
                  fontSize: 12,
                  bold: true
                },
                datum: {
                  position: 'start',
                  stem: {
                    color: 'transparent'
                  }
                }
              }
		  }}
        //   chartEvents={[
        //     {
        //         eventName: 'select',
        //         callback: handleChartSelect
        //     }
        // ]}
        // chartWrapperParams={{
        //     view : {columns :[0,1,2]}
        // }}
        
        />
        : <div>Loading Chart...</div>
        
        }
        </div>
    )
  };

  export default LoanOfficerWorkedwithAgentReport;