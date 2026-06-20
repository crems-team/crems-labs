import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AgentService from "../Services/AgentService";
import AgentInfos from "../Models/AgentInfos";
import AgentTotalPast from '../Models/AgentTotalPast';
import PastYearOverYearTrendReport from '../Components/PastYearOverYearTrendReport';
import FutureMetrics from '../Models/FutureMetrics';
import PresentAgentProductionReport from '../Components/PresentAgentProductionReport';
import FutureAgentListingsReport from '../Components/FutureAgentListingsReport';
import GeoDataTot from '../Models/GeoDataTot';
import GeoAgentListZipCodeRepo from '../Components/GeographyAgentListingsZipCode';
import OfficeProd from '../Models/OfficeProd';
import OfficeRankingAgentPerformance from '../Components/OfficeRankingAgentPerformance';
import LoadingBar from 'react-top-loading-bar';
import TeamData from '../Models/TeamData';
import TeamInvestigatorProductiveGroup from '../Components/TeamInvestigatorProductiveGroup';
import TeamNeo4jGraph from '../Components/TeamNeo4jGraph';
import TierPersonaReport from '../Components/TierPersonaReport';
import AgentTierPersona from "../Models/AgentTierPersona";
import BackButtonToArea from '../Components/BackButtonToArea';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { Knob } from 'primereact/knob';
import { ProgressSpinner } from 'primereact/progressspinner';
import AgentListOverlay from '../Components/AgentListOverlay';







import 'driver.js/dist/driver.css';











function AgentProdReports() {
    const [agentInfosData, setagentInfosData] = useState<Array<AgentInfos>>([]);
    const [agentTotalPastData, setagentTotalPastData] = useState<AgentTotalPast>();
    const [idAgent, setidAgent] = useState<string>();
    const params = useParams();
    const [prct, setPrct] = useState<string>();

    const [dataa, setDataa] = useState<(string | number)[][]>();
    const [options, setOptions] = useState<{ chart: { title: string; subtitle: string } }>();
    const [isLoading, setIsLoading] = useState(true);
    const [displayPastReport, setdisplayPastReport] = useState<boolean>(false);
    const [idAgentForPastReport, setIdAgentForPastReport] = useState<string>();
    const [displayPresentReport, setdisplayPresentReport] = useState<boolean>(false);
    const [idAgentForPresentReport, setIdAgentForPresentReport] = useState<string>();


    const [monthData, setMonthData] = useState<[{ list: number; sell: number; dna: number }]>();

    const [totalFutureMetrics, setTotalFutureMetrics] = useState<Array<FutureMetrics>>([]);

    const [displayfutureReport, setdisplayfutureReport] = useState<boolean>(false);
    const [idAgentForFutureReport, setIdAgentForFutureReport] = useState<string>();
    const [idAgentForGeoReport, setIdAgentForGeoReport] = useState<string>();
    const [displayGeoReport, setDisplayGeoReport] = useState<boolean>(false);

    const [geoDataTot, setGeoDataTot] = useState<GeoDataTot>();
    const [pastReportClicked, setPastReportClicked] = useState(true);
    const [presentReportClicked, setPresentReportClicked] = useState(true);
    const [futureReportClicked, setFutureReportClicked] = useState(true);
    const [geoReportClicked, setGeoReportClicked] = useState(true);
    const [rankingReportClicked, setRankingReportClicked] = useState(true);


    const [officeProd, setOfficeProd] = useState<OfficeProd>();

    const [progress, setProgress] = useState(0);
    const [teamData, setTeamData] = useState<TeamData>();
    const [teamReportClicked, setTeamReportClicked] = useState(true);


    const [showDataTableModal, setShowDataTableModal] = useState(false);

    const [agentTierPersonaData, setAgentTierPersonaData] = useState<Array<AgentTierPersona>>([]);

    const [activpendinglisting, setActivpendinglisting] = useState<[{ active: number; pending: number }]>();
    const navigate = useNavigate();
    //loading
    const [agentInfosDataLoading, setAgentInfosDataLoading] = useState<boolean>(false);
    const [agentTierPersonaDataLoading, setAgentTierPersonaDataLoading] = useState<boolean>(false);
    const [monthDataLoading, setMonthDataLoading] = useState<boolean>(false);
    const [totalFutureMetricsLoading, setTotalFutureMetricsLoading] = useState<boolean>(false);
    const [teamDataLoading, setTeamDataLoading] = useState<boolean>(false);
    const [agentTotalPastDataLoading, setAgentTotalPastDataLoading] = useState<boolean>(false);
    const [geoDataTotLoading, setGeoDataTotLoading] = useState<boolean>(false);
    const [officeProdLoading, setOfficeProdLoading] = useState<boolean>(false);


    const agent = agentInfosData[0] || {};


    const toggleDataTableModal = () => {
        setShowDataTableModal(prevState => !prevState);
    };

    const redirectToTeamInvestigator = (id: string) => {
        navigate(`/TeamInvestigator/${id}`);
    };

    useEffect(() => {
        setProgress(0);
        if (!params?.param) return;
      
        const id = params.param;
        setidAgent(id);
      
        const data = { id };

        setagentInfosData([]);
        setagentTotalPastData({ current: 0, last: 0});
        setMonthData([{ list: 0, sell: 0, dna: 0 }]);
        setTotalFutureMetrics([{ newListings: '',existListing: '', pendingListings: 0}]);
        setGeoDataTot({total: 0});
        setTeamData({count: 0, Listings: '', CoListings: '',  Transactions: 0});        
        setAgentTierPersonaData([]);
        setPrct('');
      
        setAgentInfosDataLoading(true);
        AgentService.getAgentInfos(data)
          .then(setagentInfosData)
          .catch(() => setagentInfosData([]))
          .finally(() => setAgentInfosDataLoading(false));
      
        setAgentTotalPastDataLoading(true);
        AgentService.getTotalPast(data) 
          .then((past) => {
            setagentTotalPastData(past);
            setPrct(((past.current - past.last) * 100 / past.current).toFixed(2));
          })
          .catch((e: Error) => {
            console.log(e);
           })
          .finally(() => setAgentTotalPastDataLoading(false));
      
        setMonthDataLoading(true);
        AgentService.getTotalPresent(data)
          .then(setMonthData)
          .catch((e: Error) => {
            console.log(e);
            })
          .finally(() => setMonthDataLoading(false));
      
        setTotalFutureMetricsLoading(true);
        AgentService.getTotalFuture(data)
          .then(setTotalFutureMetrics)
          .catch((e: Error) => {
            console.log(e);
           })
          .finally(() => setTotalFutureMetricsLoading(false));
      
        setGeoDataTotLoading(true);
        AgentService.getGeoDataTot(data)
          .then(setGeoDataTot)
          .catch((e: Error) => {
            console.log(e);
           })
          .finally(() => setGeoDataTotLoading(false));
      
        setTeamDataLoading(true);
        AgentService.getTeamData(data) 
          .then(setTeamData)
          .catch((e: Error) => {
            console.log(e);
           })
          .finally(() => setTeamDataLoading(false));
      
        setAgentTierPersonaDataLoading(true);
        AgentService.getAgentTierPersona(data)
          .then(setAgentTierPersonaData)
          .catch((e: Error) => {
            console.log(e);
           })
          .finally(() => setAgentTierPersonaDataLoading(false));
        setProgress(100);
    }, [params?.param]);
      

    useEffect(() => {
        if (agentInfosData[0]) {
            var input = {
                id: params.param ? params.param : '',
                officeId: agentInfosData[0] ? agentInfosData[0].officeId : ''
            };
            setOfficeProdLoading(true);
            AgentService.getofficeproduction(input)
                .then(setOfficeProd)
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeProdLoading(false);
                });
        }

    }, [agentInfosData]);

    useEffect(() => {
        if (monthData && totalFutureMetrics) {

            setActivpendinglisting([{ active: monthData[0] ? monthData[0].list : 0, pending: totalFutureMetrics[0] ? totalFutureMetrics[0].pendingListings : 0 }]);
        }

    }, [monthData, totalFutureMetrics]);




    const handleSearch = () => {
        if (isLoading) {
            setDataa([["Year", "Sales", "Expenses", "Profit"],
            ["2014", 1000, 400, 200],
            ["2015", 1170, 460, 250],
            ["2016", 660, 1120, 300],
            ["2017", 1030, 540, 350],]);

            setOptions({
                chart: {
                    title: "Company Performance",
                    subtitle: "Sales, Expenses, and Profit: 2014-2017",
                },
            })
            if (dataa) {
            }
            setIsLoading(false);
        }
    }

    const handleClickPastReport = () => {

        if (idAgent) {

            setIdAgentForPastReport(idAgent);
            setdisplayPastReport(true);
            setPastReportClicked(!pastReportClicked);
        }


    };

    const handleClickPresentReport = () => {
        if (idAgent) {

            setIdAgentForPresentReport(idAgent);
            setdisplayPresentReport(true);
            setPresentReportClicked(!presentReportClicked);
        }

    };

    const handleClickFutureReport = () => {
        if (idAgent) {

            setIdAgentForFutureReport(idAgent);
            setdisplayfutureReport(true);
            setFutureReportClicked(!futureReportClicked);
        }

    };

    const handleClickGeoReport = () => {
        if (idAgent) {
            setIdAgentForGeoReport(idAgent);
            setDisplayGeoReport(true);
            setGeoReportClicked(!geoReportClicked);
        }
    };

    const handleClickRankingReport = () => {
        if (idAgent) {
            setIdAgentForGeoReport(idAgent);
            setDisplayGeoReport(true);
            setRankingReportClicked(!rankingReportClicked);
        }
    };

    const handleClickTeamReport = () => {
        if (idAgent) {

            setTeamReportClicked(!teamReportClicked);
        }

    };

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
                        <div className="row mb-2">
                            <div className="col-12 d-flex justify-content-start">
                                <AgentListOverlay />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Agent Information: {agentInfosDataLoading ? <Skeleton width="10rem" className="d-inline-block" /> : <strong>{agentInfosData[0] ? agentInfosData[0].agentfirstName : ''} {agentInfosData[0] ? agentInfosData[0].agentlastName : ''}</strong>}</h3>

                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body">
                                    <div className="row text-left">
                                        <div className="col-md-6 text-nowrap text-left">
                                            {/* <span className="small ">Phone1: </span><strong>{agentInfosData[0] ? agentInfosData[0].agentPhone : ''}</strong> */}
                                            <span className="small">Phone1: </span>

                                            {agentInfosDataLoading ? <Skeleton width="10rem" className="d-inline-block" /> : <strong>{agent.agentPhone}</strong>}

                                        </div>
                                        <div className="col-md-6 text-nowrap text-left">
                                            {/* <span className="small text-left">Email: </span><strong>{agentInfosData[0] ? agentInfosData[0].agentEmail : ''}</strong> */}
                                            <span className="small">Email: </span>
                                            {agentInfosDataLoading ? <Skeleton width="10rem" className="d-inline-block" /> : <strong>{agent.agentEmail}</strong>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 text-nowrap text-left">
                                            {/* <span className="small text-left">Office: </span><strong>{agentInfosData[0] ? agentInfosData[0].officeName : ''}</strong> */}
                                            <span className="small">Office: </span>
                                            {agentInfosDataLoading ? <Skeleton width="12rem" className="d-inline-block" /> : <strong>{agent.officeName}</strong>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-auto">
                                            {/* <span className="small text-left">Address: </span><strong>{agentInfosData[0] ? agentInfosData[0].officeAddress : ''}</strong> */}
                                            <span className="small">Address: </span>
                                            {agentInfosDataLoading ? <Skeleton width="15rem" className="d-inline-block" /> : <strong>{agent.officeAddress}</strong>}
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-6 text-nowrap">
                                            {/* <span className="small d-inline-block text-left">Office Phone: </span><strong>{agentInfosData[0] ? agentInfosData[0].officePhone : ''}</strong> */}
                                            <span className="small d-inline-block">Office Phone: </span>
                                            {agentInfosDataLoading ? <Skeleton width="8rem" className="d-inline-block" /> : <strong>{agent.officePhone}</strong>}
                                        </div>
                                        <div className="col-md-6 text-nowrap ">
                                            {/* <span className="small d-inline-block text-left">City/State: </span> <strong>{agentInfosData[0] ? agentInfosData[0].officeCity : ''}</strong>, <strong>{agentInfosData[0] ? agentInfosData[0].officeState : ''}</strong> */}
                                            <span className="small d-inline-block mr-1">City/State: </span>
                                            {agentInfosDataLoading ? (
                                                <Skeleton width="8rem" className="d-inline-block ml-1" />
                                            ) : (
                                                <>
                                                    <strong>{agent.officeCity}</strong>, <strong>{agent.officeState}</strong>
                                                </>
                                            )}
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
                                        <i className="bi bi-info-circle" /></a> Agent Profile: <strong>Tier and Transaction Focus</strong></h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body pb-0">
                                    <div className="row ">
                                        <div className="col-md-4 text-nowrap">
                                            <div className="row text-nowrap">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small  text-left">Tier: </span><strong>{agentTierPersonaDataLoading ? <Skeleton width="3rem" className="d-inline-block" /> : getTier(agentTierPersonaData[0] ? agentTierPersonaData[0].total : -1)}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Focus: </span><strong> {agentTierPersonaDataLoading ? <Skeleton width="3rem" className="d-inline-block" /> : agentTierPersonaData[0] ? agentTierPersonaData[0].persona : ''}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Active Listings: </span> <strong> {(monthDataLoading && totalFutureMetricsLoading) ? <Skeleton width="3rem" className="d-inline-block" /> : activpendinglisting ? activpendinglisting[0].active : ''}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Pending Listings: </span><strong> {(monthDataLoading && totalFutureMetricsLoading) ? <Skeleton width="3rem" className="d-inline-block" /> : activpendinglisting ? activpendinglisting[0].pending : ''}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap ">
                                            <ul style={{ listStyleType: 'disc' }}>
                                                <li><strong>Tier 1 (25+)</strong></li>
                                                <li><strong>Tier 2 (13-24)</strong></li>
                                                <li><strong>Tier 3 (7-12)</strong></li>
                                                <li><strong>Tier 4 (1-6)*</strong></li>
                                                
                                                
                                                
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


                    <div className="row mt-1">
                        {/*<!-- Left col -->*/}
                        <section className="col-sm-6 ">
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s total monthly production for the most recently completed 12 months, compared to the same 12-month period a year ago. It does not include the current “partial” month’s production. The values include listing and co-listing transactions. Plus, sales outside of the MLS, if we have that data.">
                                <i className="bi bi-info-circle fs-6" /></a> Performance Focus- 24mo & 12mo</h5>
                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {agentTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-3">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Recent 12m</span>
                                                            <span className="font-bold text-lg">{agentTotalPastData?.current || 0}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-calendar-check" />
                                                        </span>
                                                    </div>
                                                </div>  

                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {agentTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-3">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Previous 12m</span>
                                                            <span className="font-bold text-lg">{agentTotalPastData?.last || 0}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-history" />
                                                        </span>
                                                    </div>
                                                </div>  
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                {agentTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <h5 className="mb-0">
                                                        {agentTotalPastData ?
                                                            <span id="spanOverYearIcon" className={`strong ${agentTotalPastData?.current >= agentTotalPastData.last ? "text-success" : "text-danger"}`}>
                                                                <i className={`bi-arrow-${agentTotalPastData.current >= agentTotalPastData.last ? "up" : "down"}-circle-fill`}></i>

                                                            </span>
                                                            : '0'
                                                        }
                                                    </h5>
                                                }
                                                {agentTotalPastDataLoading ? '' : <div className="">{prct ? prct : ''}%</div  >}
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-1">


                                        </div>

                                        <div className="col-sm-2 text-right">
                                            <button id="idDisplayChart" type="button" className="btn btn-tool " data-card-widget="collapse" onClick={handleClickPastReport}>

                                                {!pastReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                                {/* <i id="idDisplayChart" className="fas fa-plus" /> */}
                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-tools */}
                                </div>
                                {/* /.card-header */}
                                <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
                                    <div className="row  pb-0 pt-0 pr-0 pl-0">

                                        {!pastReportClicked && <PastYearOverYearTrendReport id={idAgent ? idAgent : ''} />}
                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}

                            {/* Future graph in bottom commanted  */}
                            {/* /.card */}
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The purpose of the Interaction report for each agent is to reveal their Circle of Influence (COI) during the past year. The color and size of the agent nodes indicates the Tier of each agent. In addition, the thickness of the connecting lines and the number on them indicate the number of transactions between each agent. Lines that loop back and forth between two agents, or just back on the same agent, mean that the agents performed both sides of some transactions. The role that each agent performed is not represented in the graph, but a table of agents and their roles is available on the “Table of Agents” link. An additional report is available by clicking the “Enlarge Display” link. On the new page there is a link labeled “Second-Level Graph”. This expands the view to reveal the agents who worked with the First-Level agents. Note the “filters” that are available in this view. You can filter for “Only This Office” and remove any combination of Tiers, too.">
                                <i className="bi bi-info-circle fs-6" /></a> Professional Network</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-3 border-right pl-0 pr-0 mr-0">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {teamDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                <div className="mx-3">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Agents</span>
                                                            <span className="font-bold text-lg">{teamData ? teamData.count : '0'}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-users" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {teamDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-3">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Sides</span>
                                                            <span className="font-bold text-lg">{teamData?.Transactions ? teamData.Transactions : 0}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-handshake" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        {/* <div className="col-sm-4 "> */}
                                            {/* <div className="description-block">
                                                <h5 className="">{teamData?.Listings ? teamData.Listings : '0'}</h5>
                                                <span className="">Listings</span>
                                            </div> */}
                                            {/* /.description-block */}
                                        {/* </div> */}
                                        {/* <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="">{teamData?.CoListings ? teamData.CoListings : '0'}</h5>
                                                <span className="">CoListings</span>
                                            </div>
                                        </div> */}
                                        <div className="col-sm-4">


                                        </div>

                                        <div className="col-sm-2 text-right ">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={handleClickTeamReport} >
                                                {!teamReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-tools */}
                                </div>
                                {/* /.card-header */}
                                <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
                                    <button type="button" className="btn btn-light btn-sm mt-1 ml-1" onClick={toggleDataTableModal}>
                                        <span className="mr-1">Table of Agents </span>
                                        <i className="bi bi-arrows-angle-expand"></i>
                                    </button>
                                    <button type="button" className="btn btn-light btn-sm mt-1 ml-1" onClick={() => redirectToTeamInvestigator(idAgent ? idAgent : '')}>
                                        <span className="mr-1">Enlarge Display</span>
                                        <i className="bi bi-microsoft-teams"></i>
                                    </button>
                                    <div className="row  pb-0 pt-0 pr-0 pl-0  ">
                                        <div>
                                        {!teamReportClicked && <TeamNeo4jGraph id={idAgent ? idAgent : ''} />}
                                        </div>

                                    </div>
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


                                </div>
                                {/* /.card-body */}

                            </div>







                        </section>
                        {/*<!-- /.Left col -->*/}

                        {/*<!-- /.Right col -->*/}
                        <section className="col-sm-6 ">
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s most recent 12-months sales for both Listing and Selling transactions.Plus, sales outside of the MLS, if we have that data. The values include listing and co-listing plus selling and co-selling transactions. It includes this partial month’s totals as well.">
                                <i className="bi bi-info-circle fs-6" /></a> Transaction Focus</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-2 border-right pl-0 pr-0 mr-0">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">List Agent</span>
                                                            <span className="font-bold text-lg">{monthData ? monthData[0].list : '0'}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-clipboard-list" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Sell Agent</span>
                                                            <span className="font-bold text-lg">{monthData ? monthData[0].sell : '0'}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-key" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-2 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-0">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Non MLS</span>
                                                            <span className="font-bold text-lg">{monthData ? monthData[0].dna || 0 : 0}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-eye-slash" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">12 Months</span>
                                                            <span className="font-bold text-lg">{monthData ? monthData[0].list + monthData[0].sell + monthData[0].dna || 0 : '0'}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-chart-line" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        {/* <div className="col-sm-1">


                                        </div> */}

                                        <div className="col-sm-2 text-right ">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={handleClickPresentReport} >
                                                {!presentReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-tools */}
                                </div>
                                {/* /.card-header */}
                                <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
                                    <div className="row  pb-0 pt-0 pr-0 pl-0">
                                        {!presentReportClicked && <PresentAgentProductionReport id={idAgentForPresentReport ? idAgentForPresentReport : ''} />}


                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}

                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 zip codes that the agent has sales in the past 12 months, including this month. They can be a listing or selling agent. Plus, sales outside of the MLS, if we have that data.">
                                <i className="bi bi-info-circle fs-6" /></a> Market Intelligence</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-4 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {geoDataTotLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Percent in 10 Zips</span>
                                                            <span className="font-bold text-lg">{geoDataTot?.total ? geoDataTot.total || 0 : 0}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-map-marker-alt" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>

                                        <div className="col-sm-6">


                                        </div>

                                        <div className="col-sm-2 text-right">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={handleClickGeoReport}>
                                                {!geoReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-tools */}
                                </div>
                                {/* /.card-header */}
                                <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
                                    <div className="row  pb-0 pt-0 pr-0 pl-0">

                                        {!geoReportClicked && <GeoAgentListZipCodeRepo id={idAgentForGeoReport ? idAgentForGeoReport : ''} />}


                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 agents in this office alongside a graph of their sales volume in the past 12 months. If the agent of your search is part of the top 10, you can note their ranking in the office highlighted with a yellow bar graph. If the agent is below the top 10, then they will be shown in the 11th row so that you can see their relative sized graph. If you are interested in any of the other agents named on this graph, you can click on the bar chart next to their name and the report will move to that agent’s production reporting.">
                                <i className="bi bi-info-circle fs-6" /></a> Office Ranking</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {agentInfosDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            {agentInfosDataLoading ? '' : <span className="text-secondary text-sm">Of {officeProd ? officeProd.numAgents : '0'} agents</span>}
                                                            <span className="font-bold text-lg">{officeProd ? officeProd.ranking : '0'}</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-trophy" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                                {/* {agentInfosDataLoading ? '' : <div className="pl-0 pr-0 mr-0">Of {officeProd ? officeProd.numAgents : '0'} agents</div>} */}
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                {agentInfosDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Of Office</span>
                                                            <span className="font-bold text-lg">{officeProd ? officeProd.officeProd : '0'} %</span>
                                                        </div>
                                                        <span
                                                            className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
                                                            style={{ backgroundColor:'#3adcf2', color: '#ffffff' }}
                                                        >
                                                            <i className="fa fa-percent" />
                                                        </span>
                                                    </div>
                                                </div>
                                                }
                                            </div>

                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="description-block">

                                            </div>
                                            {/* /.description-block */}
                                        </div>


                                        <div className="col-sm-2 text-right">
                                            <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={handleClickRankingReport}>
                                                {!rankingReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

                                            </button>
                                        </div>
                                    </div>
                                    {/* /.card-tools */}
                                </div>
                                {/* /.card-header */}
                                <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
                                    <div className="row  pb-0 pt-0 pr-0 pl-0">

                                        {!rankingReportClicked && <OfficeRankingAgentPerformance id={idAgent ? idAgent : ''} officeId={agentInfosData[0] ? agentInfosData[0].officeId : ''} />}


                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>


                            <div className={`modal fade ${showDataTableModal ? 'show' : ''}`} tabIndex={-1} role="dialog" style={{ display: showDataTableModal ? 'block' : 'none' }}>
                                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Circle of Influence (COI): Team Investigator</h5>
                                            <button type="button" className="close" onClick={toggleDataTableModal}>
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <TeamInvestigatorProductiveGroup id={idAgent ? idAgent : ''} />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={toggleDataTableModal}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>






                        </section>
                        {/*<!-- /.Right col -->*/}

                    </div>
                    {/*<!-- /.row (main row) -->*/}



                </div>{/* /.container-fluid */}


            </div>
        </div>

        // <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s past 12 months of new listings and pending listings for each month. It includes this partial month’s totals as well. New listings can be an A, C, U, or P status. Pending listings are “P” status. Each of the previous months show a snapshot at that time.">
        //                         <i className="bi bi-info-circle fs-6" /></a> Future: What sales do they expect in the near future?</h5>

        //                     <div className="card  collapsed-card">
        //                         <div className="card-header">

        //                             <div className="row">
        //                                 <div className="col-sm-3 border-right pl-0 pr-0 mr-0">
        //                                     <div className="description-block pl-0 pr-0 mr-0">
        //                                         {/* {totalFutureMetricsLoading? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0"style={{width: '20px', height: '24px'}} strokeWidth="5"  />
        //                                     :                                            
        //                                     <h5 className="">{totalFutureMetrics[0] ? totalFutureMetrics[0].newListings|| 0 : 0}</h5>
        //                                     }
        //                                     <div className="pl-0 pr-0 mr-0">New This Mo</div> */}

        //                                         {totalFutureMetricsLoading? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0"style={{width: '20px', height: '24px'}} strokeWidth="5"  />
        //                                         :                                            
        //                                         <div className="mx-3">
        //                                             <div className="flex justify-content-between gap-1">
        //                                                 <div className="flex flex-column gap-1">
        //                                                     <span className="text-secondary text-sm">New This Mo</span>
        //                                                     <span className="font-bold text-lg">{totalFutureMetrics[0] ? totalFutureMetrics[0].newListings|| 0 : 0}</span>
        //                                                 </div>
        //                                                 <span
        //                                                     className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
        //                                                     style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
        //                                                 >
        //                                                     <i className="fa fa-star" />
        //                                                 </span>
        //                                             </div>
        //                                         </div>
        //                                         }
                                                
        //                                     </div>
        //                                     {/* /.description-block */}
        //                                 </div>
        //                                 <div className="col-sm-3 border-right">
        //                                     <div className="description-block pl-0 pr-0 mr-0">
        //                                         {teamDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
        //                                             :
        //                                         <div className="mx-3">
        //                                             <div className="flex justify-content-between gap-1">
        //                                                 <div className="flex flex-column gap-1">
        //                                                     <span className="text-secondary text-sm">Pending</span>
        //                                                     <span className="font-bold text-lg">{totalFutureMetrics[0] ? totalFutureMetrics[0].pendingListings || 0 : 0}</span>
        //                                                 </div>
        //                                                 <span
        //                                                     className="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center"
        //                                                     style={{ backgroundColor: '#3adcf2', color: '#ffffff' }}
        //                                                 >
        //                                                     <i className="fa fa-hourglass-half" />
        //                                                 </span>
        //                                             </div>
        //                                         </div>     
        //                                         }
        //                                     </div>
        //                                     {/* /.description-block */}
        //                                 </div>
        //                                 <div className="col-sm-4">
        //                                     <div className="description-block">
        //                                     </div>
        //                                     {/* /.description-block */}
        //                                 </div>
        //                                 <div className="col-sm-2 text-right ">
        //                                     <button type="button" className="btn btn-tool" data-card-widget="collapse" onClick={handleClickFutureReport}>
        //                                         {!futureReportClicked ? <strong>Close</strong> : <strong>Open</strong>}

        //                                     </button>
        //                                 </div>
        //                             </div>
        //                             {/* /.card-tools */}
        //                         </div>
        //                         {/* /.card-header */}
        //                         <div className="card-body pb-0 pt-0 pr-0 pl-0 " >
        //                             <div className="row  pb-0 pt-0 pr-0 pl-0">

        //                                 {!futureReportClicked && <FutureAgentListingsReport id={idAgent ? idAgent : ''} />}


        //                             </div>

        //                         </div>
        //                         {/* /.card-body */}

        //                     </div>

    );
};

export default AgentProdReports;