import React, { useState,useEffect,useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import { Checkbox,CheckboxChangeEvent } from 'primereact/checkbox'; 
import TeamInvestigationGraph from '../../Components/TeamInvestigation/TeamInvestigationGraph';
import { TabView, TabPanel } from 'primereact/tabview';
import TeamInvestigationAgentsTable from '../../Components/TeamInvestigation/TeamInvestigationAgentsTable';
import TeamInvestigationService from "../../Services/TeamInvestigation/TeamInvestigationService";
import TeamOrgOvalChartMock from '../../Components/TeamOrgOvalChartMock';
import { Skeleton } from 'primereact/skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Store';
import { useAppDispatch } from '../../Hooks/DispatchHook';
import {getOrgNodesByTeamKey, setSelectedTabIndex, setTier, TierKey, setOffice} from '../../Redux/Slices/TeamInvestigationSlice'
import TeamsListOverlay from '../../Components/TeamInvestigation/TeamsListOverlay';




import 'driver.js/dist/driver.css'; 
import { log } from 'console';











  function TeamInvestigationGraphPage() {
    const [dataTeam, setDataTeam] = useState<any>();
    const [idAgent, setidAgent] = useState<string>();
    const params= useParams(); 
    const [progress, setProgress] = useState(0);
    const [monthData, setMonthData] = useState<[{list: number;sell: number;dna: number}]>();
    const [activpendinglisting, setActivpendinglisting] = useState<[{active: number;pending: number}]>();
    const [checkedOffice, setCheckedOffice] = useState(false);
    const [checkedTier1, setCheckedTier1] = useState(false);
    const [checkedTier2, setCheckedTier2] = useState(false);
    const [checkedTier3, setCheckedTier3] = useState(false);
    const [checkedTier4, setCheckedTier4] = useState(false);
    const [checkedTier0, setCheckedTier0] = useState(false);
    // const [filterCriteria, setFilterCriteria] = useState({
    //     office: false,
    //     officeName :'',
    //     currentTab :'0',
    //     tiers: {
    //     T0: false,
    //     T1: false,
    //     T2: false,
    //     T3: false,
    //     T4: false,
    //     hideAdmin: false
    //     },
    // });
    const filterCriteria = useSelector((state: RootState) => state.TeamInvestigation.filterCriteria);

        // const [filterCriteria, setFilterCriteria] = useState({
        //         onlyThisOffice: false,
        //         removeTier1: false,
        //         removeTier2: false,
        //         removeTier3: false,
        //         removeTier4: false,
        //         removeTier5: false,
        //         hideAdmin: false
        //         });


    const navigate = useNavigate();
    const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);
    // const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const selectedTabIndex = useSelector((state: RootState) => state.TeamInvestigation.selectedTabIndex);
    const dispatch = useAppDispatch();

    const [dataTeamLoading, setDataTeamLoading] = useState<boolean>(false);
    



    useEffect(() => {
        setProgress(0);
        setDataTeamLoading(true);
        if (params) {            

            var data = {
                teamId: params.param ? params.param :''
              };
              //Team infos
               TeamInvestigationService.getTeamInfos(data)
                .then((response: any) => {
                    setDataTeam(response.data);
                })
                .catch((e: Error) => {
                    setDataTeam('');
                    console.log(e);
                })
                .finally(() => {      
                    setDataTeamLoading(false);
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

    const handleTierChange = (tier: TierKey, checked: boolean) => {
        dispatch(setTier({ key: tier, value: checked }));
        console.log(filterCriteria);
    };

    // const handleTierChange = (tier: string, checked: boolean) => {
    //     if(tier == "T0"){
    //         setCheckedTier0(checked);
    //     }

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
          dispatch(setOffice(checked));          

    };


 const handleTabChange = (e:any) => {

        dispatch(setSelectedTabIndex(e.index)); // Update the active tab index
    

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
                        <div className="row mb-2">
                            <div className="col-12 d-flex justify-content-start">
                                <TeamsListOverlay />
                            </div>
                        </div>
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
                                             {dataTeamLoading ? <Skeleton width="10rem" className="d-inline-block" /> :<strong>{dataTeam?.teamName}</strong>}
                                        </div>
                                    </h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body">
                                    <div className="row text-left">                                      
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Office Name Brokerage: </span>
                                            {dataTeamLoading ? <Skeleton width="10rem" className="d-inline-block" /> :<strong>{dataTeam?.officeNameBrokerage}</strong>}
                                        </div>
                                        {/* <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">City: </span><strong>{dataTeam?.city}</strong>
                                        </div> */}
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Brand: </span>
                                            {dataTeamLoading ? <Skeleton width="10rem" className="d-inline-block" /> :<strong>{dataTeam?.brand}</strong>}
                                        </div>
                                        {/* <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">State: </span><strong>{dataTeam?.state}</strong>
                                        </div> */}
                                      
                                    </div>
                                    <div className="row">
                                         
                                        <div className="col-md-6 text-nowrap text-left">
                                            <span className="small text-left">Team Size: </span>
                                            {dataTeamLoading ? <Skeleton width="10rem" className="d-inline-block" /> :<strong>{dataTeam?.teamSize}</strong>}
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
                            Team Investigator:
                        </legend>

                        <ul
                            className="list-group list-unstyled d-flex flex-row flex-wrap align-items-center gap-2 gap-md-3 ml-1 mb-1 filter-list"
                        >
                            <li className="d-flex align-items-center filter-item">
                                Filter criteria:
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Only This Office:
                                <Checkbox onChange={e => handleOfficeChange(e.checked ?? false)} checked={filterCriteria.office} />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 1 <span style={{ backgroundColor: '#98EFBF', padding: '5px', marginRight: '1px' }} />
                                : <Checkbox onChange={e => handleTierChange('T1', e.checked ?? false)} checked={filterCriteria.tiers.T1} />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 2 <span style={{ backgroundColor: '#F6DDCC', padding: '5px', marginRight: '1px' }} />
                                : <Checkbox onChange={e => handleTierChange('T2', e.checked ?? false)} checked={filterCriteria.tiers.T2} />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 3 <span style={{ backgroundColor: '#F5B7B1', padding: '5px', marginRight: '1px' }} />
                                : <Checkbox onChange={e => handleTierChange('T3', e.checked ?? false)} checked={filterCriteria.tiers.T3} />
                            </li>

                            <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Remove Tier 4 <span style={{ backgroundColor: '#AED6F1', padding: '5px', marginRight: '1px' }} />
                                : <Checkbox onChange={e => handleTierChange('T4', e.checked ?? false)} checked={filterCriteria.tiers.T4} />
                            </li>

                             <li className="d-flex align-items-center gap-1 filter-item sep-md">
                                Hide Admin <span style={{ backgroundColor: '#bb8fce', padding: '5px', marginRight: '1px' }} />
                                : <Checkbox onChange={e => handleTierChange('T0', e.checked ?? false)} checked={filterCriteria.tiers.T0} />
                            </li>
                        </ul>

                    </fieldset>
                </div>

                    <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                        <div className="card mt-3" id="custom-tabview">
                            <TabView activeIndex={selectedTabIndex} onTabChange={handleTabChange}>
                                <TabPanel header="Team Graph" rightIcon="bi bi-diagram-3-fill ml-2">

                                    <TeamInvestigationGraph id={params.param ? params.param :''} filterCriteria={filterCriteria} />
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
                                            <li style={{ display: 'inline-block', marginRight: '20px' }}>
                                                <span style={{ backgroundColor: '#bb8fce', padding: '5px', marginRight: '5px' }}></span> Admin
                                            </li>
                                        </ul>
                                    </div>
                                </TabPanel>
                                 <TabPanel header="Team Table" rightIcon="bi bi-table ml-2">

                                    <TeamInvestigationAgentsTable id={params.param ? params.param :''} filterCriteria={filterCriteria} />


                                </TabPanel>

                                <TabPanel header="Org Chart" rightIcon="bi bi-diagram-3-fill ml-2">

                                    <TeamOrgOvalChartMock teamKey={dataTeam?.teamName}/>


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
  
  export default TeamInvestigationGraphPage;