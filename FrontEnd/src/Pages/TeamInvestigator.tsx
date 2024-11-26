import React, { useState,useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import AgentService from "../Services/AgentService";
import AgentInfos from "../Models/AgentInfos";
import FutureMetrics from '../Models/FutureMetrics';
import LoadingBar from 'react-top-loading-bar';
import TierPersonaReport from '../Components/TierPersonaReport';
import AgentTierPersona from "../Models/AgentTierPersona";
import BackButtonToArea from '../Components/BackButtonToArea';
import { Checkbox,CheckboxChangeEvent } from 'primereact/checkbox'; 
import TeamInvestigatorGraph from '../Components/TeamInvestigatorGraph';
import TeamInvestigatorSecondLevel from '../Components/TeamInvestigatorSecondLevel';
import { TabView, TabPanel } from 'primereact/tabview';
import TeamInvestigatorProductiveGroup from '../Components/TeamInvestigatorProductiveGroup';


import 'driver.js/dist/driver.css'; 











  function TeamInvestigator() {
    const [agentInfosData, setagentInfosData] = useState<Array<AgentInfos>>([]);
    const [idAgent, setidAgent] = useState<string>();
    const params= useParams(); 
    const [agentTierPersonaData, setAgentTierPersonaData] = useState<Array<AgentTierPersona>>([]);
    const [progress, setProgress] = useState(0);
    const [monthData, setMonthData] = useState<[{list: number;sell: number;dna: number}]>();
    const [totalFutureMetrics, setTotalFutureMetrics] = useState<Array<FutureMetrics>>([]);
    const [activpendinglisting, setActivpendinglisting] = useState<[{active: number;pending: number}]>();
    const [checkedOffice, setCheckedOffice] = useState(false);
  const [checkedTier1, setCheckedTier1] = useState(false);
  const [checkedTier2, setCheckedTier2] = useState(false);
  const [checkedTier3, setCheckedTier3] = useState(false);
  const [checkedTier4, setCheckedTier4] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        office: false,
        tiers: {
          T1: false,
          T2: false,
          T3: false,
          T4: false,
        },
      });
    const navigate = useNavigate();


    useEffect(() => {
        setProgress(0);
        if (params) {
            setidAgent(params.param ? params.param :'');

            var data = {
                id: params.param ? params.param :''
              };
              //Agent infos
              AgentService.getAgentInfos(data)
              .then((response: any) => {
                
                setagentInfosData(response.data);
                
              })
              .catch((e: Error) => {
                console.log(e);
              }); 
              //
              AgentService.getTotalPresent(data)
              .then((response: any) => {
                setMonthData(response.data); 
               
              })
              .catch((e: Error) => {
                console.log(e);
              
              });

              AgentService.getTotalFuture(data)
              .then((response: any) => {
                setTotalFutureMetrics(response.data);
               
              })
              .catch((e: Error) => {
                console.log(e);
              });                      
             //Tier persona
             AgentService.getAgentTierPersona(data)
             .then((response: any) => {
               setAgentTierPersonaData(response.data);
               
             })
             .catch((e: Error) => {
               console.log(e);
             }); 
               
                     

        }
        setProgress(100);

    }, [ params.param]);

    useEffect(() => {
        if(monthData && totalFutureMetrics){
        
            setActivpendinglisting([{active: monthData[0] ? monthData[0].list : 0 , pending: totalFutureMetrics[0]?totalFutureMetrics[0].pendingListings:0}]);

        }
        
    }, [monthData,totalFutureMetrics]);

    function getTier(value: number): string {
        if (value >= 0 && value <= 6) {
          return '4';
        } else if (value >= 7 && value <= 12) {
          return '3';
        } else if (value >= 13 && value <= 24) {
          return '2';
        } else if (value >= 25) {
          return '1';
        } else {
          return '';
        }
    }

    const redirectToAPR = () => {
  
        navigate(`/AgentProdReports/${idAgent}`);
      };
    const handleOfficeChange = (checked: boolean) => {
        console.log(checked);

        setCheckedOffice(checked);
        setFilterCriteria(prevState => ({
            ...prevState,
            office: checked,
        }));
        console.log(filterCriteria);
    };

    const handleTierChange = (tier: string, checked: boolean) => {
        if(tier == "T1"){
            setCheckedTier1(checked);
        }

        if(tier == "T2" ){
            setCheckedTier2(checked);
        }

        if(tier == "T3" ){
            setCheckedTier3(checked);
        }

        if(tier == "T4" ){
            setCheckedTier4(checked);
        }
        setFilterCriteria(prevState => ({
          ...prevState,
          tiers: {
            ...prevState.tiers,
            [tier]: checked,
          },
        }));
        console.log(filterCriteria);

    };

    return (
    <div>
        <LoadingBar
        color="#f11946"
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
        {/* Content Wrapper. Contains page content */}
        {/* Content Header (Page header) */}
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div>  
                    <button type="button" className="btn btn-info btn-sm mb-1 ml-1" onClick={redirectToAPR}>
                                            <span className="mr-1 text-bold">Return to APR Reports </span>
                                            <i className="bi bi-box-arrow-right text-xl"></i>

                    </button>
                    </div>
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                    <i id="idInfoIcon" className="bi bi-info-circle" /></a> Agent Information : <strong>{agentInfosData[0] ? agentInfosData[0].agentfirstName : ''} {agentInfosData[0] ? agentInfosData[0].agentlastName : ''}</strong></h3>

                            </div>
                            {/* /.card-header */}
                            {/* form start */}
                            <div className="card-body">
                                <div className="row text-left">
                                    <div className="col-md-6 text-nowrap text-left">
                                        <span className="small ">Phone1 : </span><strong>{agentInfosData[0] ? agentInfosData[0].agentPhone : ''}</strong>
                                    </div>
                                    <div className="col-md-6 text-nowrap text-left">
                                    <span className="small text-left">Email : </span><strong>{agentInfosData[0] ? agentInfosData[0].agentEmail : ''}</strong>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <span className="small text-left">Office : </span><strong>{agentInfosData[0] ? agentInfosData[0].officeName : ''}</strong>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-auto">
                                        <span className="small text-left">Address : </span><strong>{agentInfosData[0] ? agentInfosData[0].officeAddress : ''}</strong>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-md-6 text-nowrap">
                                        <span className="small d-inline-block text-left">Office Phone : </span><strong>{agentInfosData[0] ? agentInfosData[0].officePhone : ''}</strong>
                                    </div>
                                    <div className="col-md-6 text-nowrap ">
                                        <span className="small d-inline-block text-left">City/State : </span> <strong>{agentInfosData[0] ? agentInfosData[0].officeCity : ''}</strong>, <strong>{agentInfosData[0] ? agentInfosData[0].officeState : ''}</strong>
                                    </div>
                                </div>
                            </div>
                            {/* /.card-body */}
                            
                        </div>


                        
                    </div>{/* /.col */}
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0 "><a  className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The information in this area describes the important Tier ranking and Persona of this agent. Note that Tier 4 denotes agent who have 1-6 listings per year. This is significant, because the APR will not show agents who have no listings. The persona reveals the nature of the agent’s sales history over the past 12 months.">
                                    <i className="bi bi-info-circle" /></a> Agent Profile :<strong>Tier and Persona</strong></h3>
                            </div>
                            {/* /.card-header */}
                            {/* form start */}
                            <div className="card-body pb-0">        
                                <div className="row ">
                                    <div className="col-md-4 text-nowrap">
                                        <div className="row text-nowrap">
                                            <div className="col-md-4 text-nowrap">
                                            <span className="small  text-left">Tier : </span><strong>{getTier(agentTierPersonaData[0] ? agentTierPersonaData[0].total :-1)}</strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 text-nowrap">
                                            <span className="small d-inline-block text-left">Persona : </span><strong> {agentTierPersonaData[0] ? agentTierPersonaData[0].persona :''}</strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 text-nowrap">
                                            <span className="small d-inline-block text-left">Active Listings : </span><strong> {activpendinglisting ? activpendinglisting[0].active :''}</strong>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 text-nowrap">
                                            <span className="small d-inline-block text-left">Pending Listings : </span><strong> {activpendinglisting ? activpendinglisting[0].pending :''}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-nowrap ">
                                        <ul style={{listStyleType: 'disc'}}>
                                        <li><strong>Tier 4 (1-6)*</strong></li>
                                        <li><strong>Tier 3 (7-12)</strong></li>
                                        <li><strong>Tier 2 (13-24)</strong></li>
                                        <li><strong>Tier 1 (25+)</strong></li>
                                        </ul>   
                                    </div>
                                    <div className="col-md-4 text-nowrap">
                                        <div className="pb-0 pt-0 pr-0 pl-0 mr-0 mb-0 ml-0 mt-0" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <TierPersonaReport id={idAgent?idAgent:''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /.card-body */}
                            
                        </div>


                    </div>{/* /.col */}
                    {/* /.col */}
                </div>{/* /.row */}


                        <div className="row ">
                        <fieldset className="border-1  rounded" style={{ backgroundColor: '#F8F8F8'}}>
                            <legend className="text-bold"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The purpose of the Level One Team Investigator is to reveal what other agents completed transactions with this agent in the past year. The color and size of the agent nodes represents the Tier of each one. (green=Tier1, tan=Tier 2, pink=Tier 3, blue=Tier 4) In addition, the thickness of the connecting line indicates the number of transactions between each agent.  The role that each agent performed in the transactions is not represented in the graph. But the second part of this report, a table, shows all the agents, their offices, and the number of times they performed each role in the transactions. There is another section of the COI called “Level Two Team Investigator” which extends the connections to agents beyond this group.">
                                    <i className="bi bi-info-circle fs-6" /></a> Team Investigator (COI): First-Level and Second-Level Connections :</legend>                       
                             <ul className="list-group d-flex flex-row gap-3 ml-1 mb-1" > 
                                <li className="d-flex align-items-center">
                                Filter criteria :
                                </li>                         
                                <li className="d-flex align-items-center gap-3">
                                 Only This Office :
                                <Checkbox onChange={e => handleOfficeChange(e.checked ?? false)} checked={checkedOffice}></Checkbox>

                                </li>  
                                <li className="d-flex align-items-center gap-2">
                                 Remove Tier 1 <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '5px' }}></span> :
                                <Checkbox onChange={e => handleTierChange('T1', e.checked ?? false)} checked={checkedTier1}></Checkbox>

                                </li>
                                <li className="d-flex align-items-center gap-2">
                                 Remove Tier 2 <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '5px' }}></span> :
                                <Checkbox onChange={e => handleTierChange('T2', e.checked ?? false)} checked={checkedTier2}></Checkbox>

                                </li>
                                <li className="d-flex align-items-center gap-2">
                                 Remove Tier 3 <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '5px' }}></span> :
                                <Checkbox onChange={e => handleTierChange('T3', e.checked ?? false)} checked={checkedTier3}></Checkbox>

                                </li>
                                <li className="d-flex align-items-center gap-2">
                                 Remove Tier 4 <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '5px' }}></span> :
                                <Checkbox onChange={e => handleTierChange('T4', e.checked ?? false)} checked={checkedTier4}></Checkbox>

                                </li>
                            </ul> 
                            </fieldset>
                        </div>
                        <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                            <div className="card mt-3">
                                <TabView>
                                    <TabPanel header="First-Level Graph" rightIcon="bi bi-diagram-3-fill ml-2">
                                        
                                        <TeamInvestigatorGraph id={idAgent ? idAgent : ''} filterCriteria={filterCriteria}/>
                                        {/* Legend Section */}
                                        <div className="mb-1 ml-1">
                                            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '5px' }}></span> Tier 1
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '5px' }}></span> Tier 2
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '5px' }}></span> Tier 3
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '5px' }}></span> Tier 4
                                                </li>                                        
                                            </ul>
                                        </div>
                                    </TabPanel>
                                    <TabPanel header="First-Level Table" rightIcon="bi bi-table ml-2">
                                        
                                        <TeamInvestigatorProductiveGroup id={idAgent ? idAgent : ''} />

                                    </TabPanel>
                                    <TabPanel header="Second-Level Graph" rightIcon="bi bi-diagram-3-fill ml-2">

                                        <TeamInvestigatorSecondLevel id={idAgent ? idAgent : ''}/>
                                         {/* Legend Section */}
                                         <div className="mb-1 ml-1">
                                            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0' }}>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '5px' }}></span> Tier 1
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '5px' }}></span> Tier 2
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '5px' }}></span> Tier 3
                                                </li>
                                                <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '5px' }}></span> Tier 4
                                                </li>                                        
                                            </ul>
                                        </div>

                                    </TabPanel>
                                    <TabPanel header="Second-Level Table" rightIcon="bi bi-table ml-2">

                                        <TeamInvestigatorProductiveGroup id={idAgent ? idAgent : ''} />

                                    </TabPanel>
                                    
                                </TabView>
                            </div>                                                      
                        </div>
                        {/*<!-- /.row (main row) -->*/}                                          



            </div>{/* /.container-fluid */}


        </div>
    </div>
    
    );
  };
  
  export default TeamInvestigator;