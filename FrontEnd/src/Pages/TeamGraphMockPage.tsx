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
import TeamGraphMock from '../Components/TeamGraphMock';
import TeamInvestigatorSecondLevel from '../Components/TeamInvestigatorSecondLevel';
import { TabView, TabPanel } from 'primereact/tabview';
import TeamAgentTableMock from '../Components/TeamAgentTableMock';
import TeamService from "../Services/TeamService";
import TeamOrgOvalChartMock from '../Components/TeamOrgOvalChartMock';



import 'driver.js/dist/driver.css'; 











  function TeamGraphMockPage() {
    const [agentInfosData, setagentInfosData] = useState<Array<AgentInfos>>([]);
    const [dataTeam, setDataTeam] = useState<any>();
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
        // const [filterCriteria, setFilterCriteria] = useState({
        //     office: false,
        //     officeName :'',
        //     currentTab :'0',
        //     tiers: {
        //     T1: false,
        //     T2: false,
        //     T3: false,
        //     T4: false,
        //     },
        // });
        const [filterCriteria, setFilterCriteria] = useState({
                onlyThisOffice: false,
                removeTier1: false,
                removeTier2: false,
                removeTier3: false,
                removeTier4: false,
                removeTier5: false,
                hideAdmin: false
                });


        const navigate = useNavigate();
        const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
        const [selectedTabIndex, setSelectedTabIndex] = useState(0);



    useEffect(() => {
        setProgress(0);
        if (params) {
            setidAgent('58288960');

            var data = {
                name: params.param ? params.param :''
              };
              //Team infos
               TeamService.getTeamInfos(data)
                .then((response: any) => {
                    setDataTeam(response.data);
                    console.log(response.data);
                })
                .catch((e: Error) => {
                    setDataTeam('');
                    console.log(e);
                });

               
                     

        }
        setProgress(100);

    }, [ params.param]);

   

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
    // const handleOfficeChange = (checked: boolean) => {

    //     setCheckedOffice(checked);
    //     setFilterCriteria(prevState => ({
    //         ...prevState,
    //         office: checked,
    //         // currentTab:selectedTabIndex.toString(),
    //         officeName : checked?agentInfosData[0].officeName : '',
    //     }));
    // };

    // const handleTierChange = (tier: string, checked: boolean) => {
    //     console.log('before change', localStorage);

    //     if(tier == "T1"){
    //         setCheckedTier1(checked);
    //     }

    //     if(tier == "T2" ){
    //         setCheckedTier2(checked);
    //     }

    //     if(tier == "T3" ){
    //         setCheckedTier3(checked);
    //     }

    //     if(tier == "T4" ){
    //         setCheckedTier4(checked);
    //     }
    //     setFilterCriteria(prevState => ({
    //       ...prevState,
    //     //   currentTab:selectedTabIndex.toString(),
    //       tiers: {
    //         ...prevState.tiers,
    //         [tier]: checked,
    //       },
    //     }));

    //     console.log(checked);

    // };


    // useEffect(() => {
    //     if (fieldsetRef.current) {
    //       fieldsetRef.current.scrollIntoView({ behavior: 'smooth' });
    
    //       setTimeout(() => {
    //         const headerHeight = 10; 
    //         window.scrollBy(0, -headerHeight);
    //       }, 500); 
    //     }
    //   }, []);
    const handleOfficeChange = (checked: boolean) => {
  setFilterCriteria(prev => ({
    ...prev,
    onlyThisOffice: checked
  }));
};

const handleTierChange = (tierKey: 'T1' | 'T2' | 'T3' | 'T4' | 'T5', checked: boolean) => {
  setFilterCriteria(prev => {
    switch (tierKey) {
      case 'T1':
        return { ...prev, removeTier1: checked };
      case 'T2':
        return { ...prev, removeTier2: checked };
      case 'T3':
        return { ...prev, removeTier3: checked };
      case 'T4':
        return { ...prev, removeTier4: checked };
      case 'T5':
        return { ...prev, removeTier5: checked };
      default:
        return prev;
    }
  });
};

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

                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Team Information: 
                                       <div style={{
                                            background: '#cbe6faff',
                                            color: '#0d47a1',
                                            padding: '4px 12px',
                                            borderRadius: '14px',
                                            display: 'inline-block',
                                            fontWeight: 700
                                        }}>
                                            <i className="bi bi-people-fill" style={{color:'#007bff', marginRight:'4px'}}/>
                                            {dataTeam?.teamName}
                                        </div>
                                    </h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body">
                                    <div className="row text-left">                                      
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Office Name: </span><strong>{dataTeam?.officeName}</strong>
                                        </div>
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">City: </span><strong>{dataTeam?.city}</strong>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Office Address: </span><strong>{dataTeam?.officeAddress}</strong>
                                        </div>
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">State: </span><strong>{dataTeam?.state}</strong>
                                        </div>
                                      
                                    </div>
                                    <div className="row">
                                         
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Team Size: </span><strong>{dataTeam?.teamSize}</strong>
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
                                data-bs-content="The purpose of the Level One Team Investigator is..."
                            >
                                <i className="bi bi-info-circle fs-6" />
                            </a>{" "}
                            Team Connections:
                        </legend>

                        <ul
                            className="list-group list-unstyled d-flex flex-row flex-wrap align-items-center gap-2 gap-md-3 ml-1 mb-1 filter-list"
                        >
                            <li className="d-flex align-items-center filter-item">
                                Filter criteria:
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Only This Office:
                                <Checkbox
                                    onChange={e => handleOfficeChange(e.checked ?? false)}
                                    checked={filterCriteria.onlyThisOffice}
                                    />                            
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 1 <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '1px' }} />
                                :
                                <Checkbox
                                onChange={e => handleTierChange('T1', e.checked ?? false)}
                                checked={filterCriteria.removeTier1}
                                />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 2 <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '1px' }} />
                                :
                                <Checkbox
                                onChange={e => handleTierChange('T2', e.checked ?? false)}
                                checked={filterCriteria.removeTier2}
                                />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 3 <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '1px' }} />
                                :
                                <Checkbox
                                onChange={e => handleTierChange('T3', e.checked ?? false)}
                                checked={filterCriteria.removeTier3}
                                />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 4 <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '1px' }} />
                                :
                                <Checkbox
                                onChange={e => handleTierChange('T4', e.checked ?? false)}
                                checked={filterCriteria.removeTier4}
                                />
                            </li>
                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Hide Admin
                                :
                                <Checkbox
                                    onChange={e =>
                                    setFilterCriteria(prev => ({
                                        ...prev,
                                        hideAdmin: e.checked ?? false
                                    }))
                                    }
                                    checked={filterCriteria.hideAdmin}
                                />
                            </li>
                        </ul>

                    </fieldset>
                </div>

                    <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                        <div className="card mt-3"id="custom-tabview">
                            <TabView activeIndex={selectedTabIndex} >
                                <TabPanel header="Team Graph" rightIcon="bi bi-diagram-3-fill ml-2">

                                    <TeamGraphMock teamName={params.param ? params.param :''} filterCriteria={filterCriteria} />
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
                                 <TabPanel header="Team Table" rightIcon="bi bi-table ml-2">

                                    <TeamAgentTableMock name={params.param ? params.param :''} filterCriteria={filterCriteria} />


                                </TabPanel>

                                <TabPanel header="Org Chart" rightIcon="bi bi-diagram-3-fill ml-2">

                                    {/* <TeamOrgOvalChartMock /> */}


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
  
  export default TeamGraphMockPage;