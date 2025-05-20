import React, { useState,useEffect } from 'react';
import LoanOfficerService from "../Services/LoanOfficerService";
import { Chart } from 'react-google-charts';
import { useNavigate } from 'react-router-dom';



interface ComponentProps {
    officerId: string,
    agentId: string,
    officeId: string,
  }


const LoanOfficerOfficeRanking : React.FC<ComponentProps> = ({ officerId,agentId,officeId }) => {


    const [data, setData] = useState<(any[])>([]);
    const [officeName, setOfficeName] = useState<(string)>();
    const navigate = useNavigate();




    useEffect(() => {

                
            const fetchData=()=>{
                LoanOfficerService.getOfficeRankingReportLO(officerId,agentId,officeId)
                .then((response: any) => {
                    //console.log(response.data);
                    if(response.data){
                        setOfficeName(response.data[0].officeName);
                        const data = [
                            ['Agents', '12 month Performance', { role: 'annotation' }, { role: 'style' }, 'agentId'],
                            ...response.data.map((element: any) => [
                              element.firstName + ' ' + element.lastName + ' (' + element.ranking + ')',
                              parseInt(element.nombre || 0),
                              parseInt(element.nombre || 0) +' ('+element.capturePercentage+'%)', // Annotation de base (gauche)
                              (element.agentId === agentId) ? 'color: orange' : 'color: blue',
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
            if(agentId){
                fetchData();
            }

    }, [officerId,agentId,officeId]); 

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
        height={'500px'}
        chartType="BarChart"
        data={data}  
        options={{
            title: 'Office Ranking '+officeName,
            chartArea: {width: '50%'},
            hAxis: {
              title: 'Total Production',
              minValue: 0
            },
            vAxis: {
              title: 'Agent Name'
            },
            
            bar: { groupWidth: "60%" },
            legend: { position: "bottom" },
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

  export default LoanOfficerOfficeRanking;