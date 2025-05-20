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
import LoanOfficerSankeyReport from '../Components/LoanOfficerSankeyReport';
import LoanOfficerOfficeRanking from '../Components/LoanOfficerOfficeRanking'; 
import LoanOfficerWorkedwithAgentReport from '../Components/LoanOfficerWorkedwithAgentReport';
import 'driver.js/dist/driver.css'; 
import LoanOfficerService from '../Services/LoanOfficerService';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { setSankeyReportClicked,setOfficeRankingLOClicked, setLoanOfficerByAgentClicked} from '../Redux/Slices/MapSlice'
import { useAppDispatch } from '../Hooks/DispatchHook';
import OfficeProd from '../Models/OfficeProd';

import { off } from 'process';

interface NameItem {
    officeName: string;
  }

  function LoanOfficerProdReport() {
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
    // const [sankeyReportClicked, setSankeyReportClicked] = useState(true);
    const [loanOfficerInfos, setLoanOfficerInfos] = useState<AgentInfos>();
    const [totalAgents, setTotalAgents] = useState<any>();
    const [salesCapRate, setSalesCapRate] = useState<any>();
    // const [rankingReportClicked, setRankingReportClicked] = useState(true);
    const sankeyReportClicked = useSelector((state: RootState) => state.map.sankeyReportClicked);
    const officeRankingLOClicked = useSelector((state: RootState) => state.map.officeRankingLOClicked);
    const loanOfficerByAgentClicked = useSelector((state: RootState) => state.map.loanOfficerByAgentClicked);
    const idOfficeLO = useSelector((state: RootState) => state.map.idOfficeLO);
    const idAgentLO = useSelector((state: RootState) => state.map.idAgentLO);
    const dispatch = useAppDispatch();
    const [officeProd, setOfficeProd] = useState<OfficeProd>();
    const [names, setNames] = useState<NameItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [headerCardClicked, setHeaderCardClicked] = useState(true);



    // useEffect(() => {
    //     console.log(sankeyReportClicked);
    //     if(!sankeyReportClicked){
    //     setSankeyReportClicked(!sankeyReportClicked);
    //     }
    // }, [sankeyReportClicked]);

    useEffect(() => {
        setProgress(0);
        if (params) {
            setidAgent(params.param ? params.param :'');

            var data = {
                id: params.param ? params.param :''
              };
              //Agent infos
              LoanOfficerService.findLoanOfficerById(data)
              .then((response: any) => {
                
                setLoanOfficerInfos(response.data);
                
              })
              .catch((e: Error) => {
                console.log(e);
              });
              //Total agents
              LoanOfficerService.getTotalAgents(data)
              .then((response: any) => {
                
                setTotalAgents(response.data);
                
              })
              .catch((e: Error) => {
                console.log(e);
              });
              //Sales Cap Rate
                LoanOfficerService.getTotalSalesAndCapRate(data)    
                .then((response: any) => {
                    
                    setSalesCapRate(response.data);
                    
                })
                .catch((e: Error) => {
                    console.log(e);
                });
               //
               LoanOfficerService.getOfficeNamesLo(data)    
               .then((response: any) => {
                   
                   setNames(response.data);
                   setLoading(false);
                   console.log(response.data);
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
          // Step 1: Scroll fieldset into view smoothly
          fieldsetRef.current.scrollIntoView({ behavior: 'smooth' });
    
          // Step 2: Adjust for header height after scrolling finishes
          setTimeout(() => {
            const headerHeight = 10; // Adjust to your header’s height
            window.scrollBy(0, -headerHeight);
          }, 500); // Adjust the timeout as needed for your layout
        }
      }, []);

  const handleTabChange = (e:any) => {
    setSelectedTabIndex(e.index); // Update the active tab index
    setFilterCriteria(prevState => ({
        ...prevState,
        currentTab:e.index !== undefined && e.index !== null ? e.index.toString() : '0',
        typeTable: e.index.toString() === '1' ? 'level1' : e.index.toString() === '3' ? 'level2' : ''
    }));

    }
    const handleClickSankeyReport = () => {

        dispatch(setSankeyReportClicked(!sankeyReportClicked));    
    };

    const handleClickRankingReport = () => {
        // setIdAgentForGeoReport(idAgent);
        // setDisplayGeoReport(true);
        // setRankingReportClicked(!rankingReportClicked);
        dispatch(setOfficeRankingLOClicked(!officeRankingLOClicked));     
    };

    const handleClickLOOfficericerReport = () => {
        // setIdAgentForGeoReport(idAgent);
        // setDisplayGeoReport(true);
        // setRankingReportClicked(!rankingReportClicked);
        dispatch(setLoanOfficerByAgentClicked(!loanOfficerByAgentClicked));     
    };
    

        //Ranking report
        useEffect(() => {
            if(idOfficeLO && idAgentLO){
                var input = {
                    id: idAgentLO,
                    officeId : idOfficeLO
                };
                AgentService.getofficeproduction(input)
                .then((response: any) => {
                    setOfficeProd(JSON.parse(response.data)); 
                })
                .catch((e: Error) => {
                    console.log(e);
                });       
                }
            
        }, [idAgentLO,idOfficeLO]);
    
        // Fonction for devise the table in 3 columns
    const splitArray = (arr: NameItem[], chunks: number) => {
        const result = [];
        const chunkSize = Math.ceil(arr.length / chunks);
        for (let i = 0; i < chunks; i++) {
        result.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
        }
        return result;
    };

    const columns = splitArray(names, 5);

    const handleClickLOheader = () => {

        setHeaderCardClicked(!headerCardClicked);
    
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
                    
                

                    <div className="col-md-12 col-sm-6">
                        <div className={`card ${!headerCardClicked ? '' : 'collapsed-card'}`}>
                                    <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-6 border-right">
                                           <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                           <i id="idInfoIcon" className="bi bi-info-circle" /></a> LO Information: <strong>{loanOfficerInfos ? loanOfficerInfos.officerName : ''} </strong></h3>
                                           </div>                                                                 
                                           
                                           <div className="col-sm-6 text-right">
                                               <button type="button" className="btn btn-tool"  onClick={handleClickLOheader}>
                                               {!headerCardClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                               </button>
                                           </div>
                                       </div>
                                       {/* /.card-tools */}
                                   </div>
                                   {/* /.card-header */}
                                   <div  className={`card-body pb-0 pt-0 pr-0 pl-0 ${!headerCardClicked ? '' : 'd-none'}`}>
                                    <div className="row  pb-0 pt-1 pr-0 pl-0">
                                        
                                        <h3 className="card-title mb-0 ml-3"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Offices: </h3>

                                    {!loading && columns.map((column, colIndex) => (
                                            <div key={colIndex} className=" col-md-2">
                                            {/* <div className="card-column"> */}
                                                {column.map((item) => (
                                                <div 
                                                    className="card shadow-sm  hover-card"
                                                >
                                                    <div className="card-body d-flex align-items-center">
                                                    {/* <div className="bg-primary text-white rounded-circle mr-3 d-flex align-items-center justify-content-center" 
                                                        style={{ width: '40px', height: '40px' }}>
                                                    </div> */}
                                                    <h6 className="mb-0 mr-0 text-nowrap">{item.officeName}</h6>
                                                    </div>
                                                </div>
                                                ))}
                                            {/* </div> */}
                                            </div>
                                        ))}
                                                        
                                    </div>
                   
                                   </div>
                                   {/* /.card-body */}
                                   
                               </div> 
                        
                </div>{/* /.row */}
                </div>

                    <div className="row ">
                    <div className="col-md-12 col-sm-6">

                    <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 15 agents this loan officer (LO) has completed sales with during the past year. The left column lists them from highest to lowest number of sales. The right column re-orders them by the lowest capture rate at the top to the highest capture rate at the bottom. The purpose of the graph is to illustrate which of the agents has the most potential or opportunity to increase total sales by increasing the capture rate.">
                                    <i className="bi bi-info-circle fs-6" /></a> Who are the Loan Officer's top agents in the last year? & Which agents offer the best opportunity to grow sales?</h5>                               
                                    <div className={`card ${!sankeyReportClicked ? '' : 'collapsed-card'}`}>
                                    <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-2 border-right">
                                               <div className="description-block">
                                                   <h5 className="">{totalAgents ? totalAgents.total || 0: '0' }</h5>
                                                   <span className="">Total Agents</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-2 border-right">
                                               <div className="description-block">
                                                   <h5 className="">{salesCapRate ? salesCapRate.sales || 0: '0'}</h5>
                                                   <span className="">Sales 12m</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-2 border-right">
                                               <div className="description-block">
                                                    <h5 className="">{salesCapRate ? salesCapRate.capRate || 0: '0'} %</h5>
                                                    <span className="">Capture</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                      
                                           
                                           <div className="col-sm-6 text-right">
                                               <button type="button" className="btn btn-tool"  onClick={handleClickSankeyReport}>
                                               {!sankeyReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                               </button>
                                           </div>
                                       </div>
                                       {/* /.card-tools */}
                                   </div>
                                   {/* /.card-header */}
                                   <div id="LoanOfficerCard" className={`card-body pb-0 pt-0 pr-0 pl-0 ${!sankeyReportClicked ? '' : 'd-none'}`}>
                                    {/* <div className="row  pb-0 pt-0 pr-0 pl-0"> */}
                                    
                                            {!sankeyReportClicked&&(<LoanOfficerSankeyReport officerId={idAgent?idAgent:''} />)}

                                                        
                                    {/* </div> */}
                   
                                   </div>
                                   {/* /.card-body */}
                                   
                               </div>   
                        </div> 

                        <section className="col-sm-6">
                        <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 agents in this office alongside a graph of their sales volume in the past 12 months. If the agent of your search is part of the top 10, you can note their ranking in the office highlighted with a yellow bar graph. If the agent is below the top 10, then they will be shown in the 11th row so that you can see their relative sized graph. If you are interested in any of the other agents named on this graph, you can click on the bar chart next to their name and the report will move to that agent’s production reporting.">
                                    <i className="bi bi-info-circle fs-6" /></a> Office Ranking: Who else in the agent’s office is best to approach?</h5>
                               
                                <div className={`card ${!officeRankingLOClicked ? '' : 'collapsed-card'}`}>
                                   <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                                <h5 className="">{officeProd ? officeProd.ranking : '0' }</h5>
                                                <span className="">Of {officeProd ? officeProd.numAgents : '0'} agents</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                               <h5 className="">{officeProd ? officeProd.officeProd : '0'} %</h5>
                                               <span className="">Of Office</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-4">
                                               <div className="description-block">
                                                   
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                      
                                           
                                           <div className="col-sm-2 text-right">
                                               <button type="button" className="btn btn-tool" onClick={handleClickRankingReport}>
                                               {!officeRankingLOClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                               </button>
                                           </div>
                                       </div>
                                       {/* /.card-tools */}
                                   </div>
                                   {/* /.card-header */}
                                   <div className={`card-body pb-0 pt-0 pr-0 pl-0 ${!officeRankingLOClicked ? '' : 'd-none'}`}>

                                   <div className="row  pb-0 pt-0 pr-0 pl-0">
                                   {!officeRankingLOClicked&&<LoanOfficerOfficeRanking officerId={idAgent?idAgent:''} agentId={idAgentLO?idAgentLO:''}  officeId={idOfficeLO ? idOfficeLO : ''}/>}

                                                      
                                   </div>
                   
                                   </div>
                                   {/* /.card-body */}
                                   
                               </div>
                        </section>

                        <section className="col-sm-6">
                        <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 agents in this office alongside a graph of their sales volume in the past 12 months. If the agent of your search is part of the top 10, you can note their ranking in the office highlighted with a yellow bar graph. If the agent is below the top 10, then they will be shown in the 11th row so that you can see their relative sized graph. If you are interested in any of the other agents named on this graph, you can click on the bar chart next to their name and the report will move to that agent’s production reporting.">
                                    <i className="bi bi-info-circle fs-6" /></a> Competition: What other Loan Officer’s does this agent work with?</h5>
                               
                                <div className={`card ${!loanOfficerByAgentClicked ? '' : 'collapsed-card'}`}>
                                   <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                                <h5 className="">{officeProd ? officeProd.ranking : '0' }</h5>
                                                <span className="">Of {officeProd ? officeProd.numAgents : '0'} agents</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                               <h5 className="">{officeProd ? officeProd.officeProd : '0'} %</h5>
                                               <span className="">Of Office</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-4">
                                               <div className="description-block">
                                                   
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                      
                                           
                                           <div className="col-sm-2 text-right">
                                               <button type="button" className="btn btn-tool" onClick={handleClickLOOfficericerReport}>
                                               {!loanOfficerByAgentClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                               </button>
                                           </div>
                                       </div>
                                       {/* /.card-tools */}
                                   </div>
                                   {/* /.card-header */}
                                   <div className={`card-body pb-0 pt-0 pr-0 pl-0 ${!loanOfficerByAgentClicked ? '' : 'd-none'}`}>

                                   <div className="row  pb-0 pt-0 pr-0 pl-0">
                                   {!loanOfficerByAgentClicked&&<LoanOfficerWorkedwithAgentReport agentId={idAgentLO?idAgentLO:''}/>}

                                                      
                                   </div>
                   
                                   </div>
                                   {/* /.card-body */}
                                   
                               </div>
                        </section>
 
                                                
                    </div>
                        {/*<!-- /.row (main row) -->*/}                                          



            </div>{/* /.container-fluid */}


        </div>
    </div>
    
    );
  };
  
  export default LoanOfficerProdReport;