import React, { useState,useEffect,useRef } from 'react';
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
import FirstSecondLevelTeamTable from '../Components/FirstSecondLevelTeamTable';


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
        officeName :'',
        currentTab :'0',
        tiers: {
          T1: false,
          T2: false,
          T3: false,
          T4: false,
        },
      });
    const navigate = useNavigate();
    const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);



    useEffect(() => {
        setProgress(0);
        if (params) {
            setidAgent(params.param ? params.param :'');

            var data = {
                id: params.param ? params.param :''
              };
              //Agent infos
              AgentService.getAgentInfos(data)
              .then(setagentInfosData)
              .catch(() => setagentInfosData([]));
            //   .finally(() => setAgentInfosDataLoading(false));
              //
              AgentService.getTotalPresent(data)
              .then(setMonthData)
              .catch((e: Error) => {
                console.log(e);
                })

              AgentService.getTotalFuture(data)
             .then(setTotalFutureMetrics)
             .catch(() => setTotalFutureMetrics([]));
                   
             //Tier persona
             AgentService.getAgentTierPersona(data)
             .then(setAgentTierPersonaData)
             .catch(() => setAgentTierPersonaData([]));

               
                     

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

        setCheckedOffice(checked);
        setFilterCriteria(prevState => ({
            ...prevState,
            office: checked,
            // currentTab:selectedTabIndex.toString(),
            officeName : checked?agentInfosData[0].officeName : '',
        }));
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
        //   currentTab:selectedTabIndex.toString(),
          tiers: {
            ...prevState.tiers,
            [tier]: checked,
          },
        }));

    };


    useEffect(() => {
        if (fieldsetRef.current) {
          fieldsetRef.current.scrollIntoView({ behavior: 'smooth' });
    
          setTimeout(() => {
            const headerHeight = 10; 
            window.scrollBy(0, -headerHeight);
          }, 500); 
        }
      }, []);

  const handleTabChange = (e:any) => {
    setSelectedTabIndex(e.index); 
    setFilterCriteria(prevState => ({
        ...prevState,
        currentTab:e.index !== undefined && e.index !== null ? e.index.toString() : '0',
        typeTable: e.index.toString() === '1' ? 'level1' : e.index.toString() === '3' ? 'level2' : ''
    }));

    }
    

    return (
        <div>
            <LoadingBar
                color="#f11946"
                height={3}
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />

            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">

                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Agent Information: <strong>{agentInfosData[0] ? agentInfosData[0].agentfirstName : ''} {agentInfosData[0] ? agentInfosData[0].agentlastName : ''}</strong></h3>

                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body">
                                    <div className="row text-left">
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small ">Phone1: </span><strong>{agentInfosData[0] ? agentInfosData[0].agentPhone : ''}</strong>
                                        </div>
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Email: </span><strong>{agentInfosData[0] ? agentInfosData[0].agentEmail : ''}</strong>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-auto">
                                            <span className="small text-left">Office: </span><strong>{agentInfosData[0] ? agentInfosData[0].officeName : ''}</strong>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-auto">
                                            <span className="small text-left">Address: </span><strong>{agentInfosData[0] ? agentInfosData[0].officeAddress : ''}</strong>
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-6 text-nowrap">
                                            <span className="small d-inline-block text-left">Office Phone: </span><strong>{agentInfosData[0] ? agentInfosData[0].officePhone : ''}</strong>
                                        </div>
                                        <div className="col-md-6 text-nowrap ">
                                            <span className="small d-inline-block text-left">City/State: </span> <strong>{agentInfosData[0] ? agentInfosData[0].officeCity : ''}</strong>, <strong>{agentInfosData[0] ? agentInfosData[0].officeState : ''}</strong>
                                        </div>
                                    </div>
                                </div>
                                {/* /.card-body */}

                            </div>



                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The information in this area describes the important Tier ranking and Persona of this agent. Note that Tier 4 denotes agent who have 1-6 listings per year. This is significant, because the APR will not show agents who have no listings. The persona reveals the nature of the agent’s sales history over the past 12 months.">
                                        <i className="bi bi-info-circle" /></a> Agent Profile:<strong>Tier and Persona</strong></h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body pb-0">
                                    <div className="row ">
                                        <div className="col-md-4 text-nowrap">
                                            <div className="row text-nowrap">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small  text-left">Tier: </span><strong>{getTier(agentTierPersonaData[0] ? agentTierPersonaData[0].total : -1)}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Persona: </span><strong> {agentTierPersonaData[0] ? agentTierPersonaData[0].persona : ''}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Active Listings: </span><strong> {activpendinglisting ? activpendinglisting[0].active : ''}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Pending Listings: </span><strong> {activpendinglisting ? activpendinglisting[0].pending : ''}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap ">
                                            <ul style={{ listStyleType: 'disc' }}>
                                                <li><strong>Tier 4 (1-6)*</strong></li>
                                                <li><strong>Tier 3 (7-12)</strong></li>
                                                <li><strong>Tier 2 (13-24)</strong></li>
                                                <li><strong>Tier 1 (25+)</strong></li>
                                            </ul>
                                        </div>
                                        <div className="col-md-4 text-nowrap">
                                            <div className="pb-0 pt-0 pr-0 pl-0 mr-0 mb-0 ml-0 mt-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <TierPersonaReport id={idAgent ? idAgent : ''} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /.card-body */}

                            </div>


                        </div>{/* /.col */}
                        {/* /.col */}
                    </div>{/* /.row */}


                    <div className="row">
                        <fieldset
                            className="border-1 rounded p-2"
                            style={{ backgroundColor: "#F8F8F8" }}
                            id="idfieldset"
                            ref={fieldsetRef}
                        >
                            <legend className="fw-bold">
                                <a
                                    className="badge bg-info"
                                    role="button"
                                    tabIndex={0}
                                    data-bs-toggle="popover"
                                    data-placement="bottom"
                                    title="Note"
                                    data-bs-content="The purpose of the Interaction report for each agent is to reveal their Circle of Influence (COI) during the past year. The color and size of the agent nodes indicates the Tier of each agent. In addition, the thickness of the connecting lines and the number on them indicate the number of transactions between each agent. Lines that loop back and forth between two agents, or just back on the same agent, mean that the agents performed both sides of some transactions. The role that each agent performed is not represented in the graph, but a table of agents and their roles is available on the “Table of Agents” link. An additional report is available by clicking the “Enlarge Display” link. On the new page there is a link labeled “Second-Level Graph”. This expands the view to reveal the agents who worked with the First-Level agents. Note the “filters” that are available in this view. You can filter for “Only This Office” and remove any combination of Tiers, too."
                                >
                                    <i className="bi bi-info-circle fs-6" />
                                </a>{" "}
                                {/* Circle of Influence (COI) : First-Level and Second-Level Connections: */}
                                Interaction: What other agents they worked with?
                            </legend>

                            <ul
                                className="list-group list-unstyled d-flex flex-row flex-wrap align-items-center gap-2 gap-md-3 ml-1 mb-1 filter-list"
                            >
                                <li className="d-flex align-items-center filter-item">
                                    Filter criteria:
                                </li>

                                <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                    Only This Office:
                                    <Checkbox onChange={e => handleOfficeChange(e.checked ?? false)} checked={checkedOffice} />
                                </li>

                                <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                    Remove Tier 1 <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '1px' }} />
                                    : <Checkbox onChange={e => handleTierChange('T1', e.checked ?? false)} checked={checkedTier1} />
                                </li>

                                <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                    Remove Tier 2 <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '1px' }} />
                                    : <Checkbox onChange={e => handleTierChange('T2', e.checked ?? false)} checked={checkedTier2} />
                                </li>

                                <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                    Remove Tier 3 <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '1px' }} />
                                    : <Checkbox onChange={e => handleTierChange('T3', e.checked ?? false)} checked={checkedTier3} />
                                </li>

                                <li className="d-flex align-items-center gap-1 filter-item">
                                    Remove Tier 4 <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '1px' }} />
                                    : <Checkbox onChange={e => handleTierChange('T4', e.checked ?? false)} checked={checkedTier4} />
                                </li>
                            </ul>

                        </fieldset>
                    </div>

                    <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                        <div className="card mt-3">
                            <TabView activeIndex={selectedTabIndex} onTabChange={handleTabChange}>
                                <TabPanel header="First-Level Graph" rightIcon="bi bi-diagram-3-fill ml-2">

                                    <TeamInvestigatorGraph id={idAgent ? idAgent : ''} filterCriteria={filterCriteria} />
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

                                    <FirstSecondLevelTeamTable id={idAgent ? idAgent : ''} filterCriteria={filterCriteria} />


                                </TabPanel>
                                <TabPanel header="Second-Level Graph" rightIcon="bi bi-diagram-3-fill ml-2">

                                    <TeamInvestigatorSecondLevel id={idAgent ? idAgent : ''} filterCriteria={filterCriteria} />
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

                                    <FirstSecondLevelTeamTable id={idAgent ? idAgent : ''} filterCriteria={filterCriteria} />

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