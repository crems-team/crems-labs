import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AgentService from "../Services/AgentService";//enlever

import OfficeService from "../Services/OfficeService";
import OfficeInfos from "../Models/OfficeInfos";

import AgentInfos from "../Models/AgentInfos";//Enlever

import AgentTotalPast from '../Models/AgentTotalPast';
import OfficePastYearOverYearTrendReport from '../Components/Office/OfficePastYearOverYearTrendReport';
import FutureMetrics from '../Models/FutureMetrics';
import PresentOfficeProductionReport from '../Components/Office/PresentOfficeProductionReport';
import FutureAgentListingsReport from '../Components/FutureAgentListingsReport';
import GeoDataTot from '../Models/GeoDataTot';
import OfficeGeographyListingsZipCode from '../Components/Office/OfficeGeographyListingsZipCode';
import OfficeProductionMetrics from '../Models/Office/OfficeProductionMetrics';
import OfficeRankingAgentPerformance from '../Components/Office/OfficeRankingAgentPerformance';
import LoadingBar from 'react-top-loading-bar';
import TeamData from '../Models/TeamData';
import TeamInvestigatorProductiveGroup from '../Components/TeamInvestigatorProductiveGroup';
import TeamNeo4jGraph from '../Components/TeamNeo4jGraph';
import OfficeMixOfSalesReport from '../Components/Office/OfficeMixOfSalesReport';
import AgentTierPersona from "../Models/AgentTierPersona";
import BackButtonToArea from '../Components/BackButtonToArea';
import { useNavigate } from 'react-router-dom';
import OfficeTopCities from "../Models/Office/OfficeTopCities";
import { Skeleton } from 'primereact/skeleton';
import { ProgressSpinner } from 'primereact/progressspinner';





import 'driver.js/dist/driver.css';











function AgentProdReports() {
    const [officeInfosData, setOfficeInfosData] = useState<Array<OfficeInfos>>([]);
    const [officeTotalPastData, setOfficeTotalPastData] = useState<AgentTotalPast>();
    const [officeId, setOfficeId] = useState<string>();
    const params = useParams();
    const [prct, setPrct] = useState<string>();

    const [dataa, setDataa] = useState<(string | number)[][]>();
    const [options, setOptions] = useState<{ chart: { title: string; subtitle: string } }>();
    const [isLoading, setIsLoading] = useState(true);
    const [displayPastReport, setdisplayPastReport] = useState<boolean>(false);
    const [idAgentForPastReport, setIdAgentForPastReport] = useState<string>();
    const [displayPresentReport, setdisplayPresentReport] = useState<boolean>(false);
    const [officeIdForPresentReport, setOfficeIdForPresentReport] = useState<string>();


    const [monthData, setMonthData] = useState<[{ list: number; sell: number; dna: number }]>();

    const [officeNbrAgents, setOfficeNbrAgents] = useState<number>();

    const [displayfutureReport, setdisplayfutureReport] = useState<boolean>(false);
    const [idAgentForFutureReport, setIdAgentForFutureReport] = useState<string>();
    const [officeIdForGeoReport, setOfficeIdForGeoReport] = useState<string>();
    const [displayGeoReport, setDisplayGeoReport] = useState<boolean>(false);

    const [geoDataTot, setGeoDataTot] = useState<number>();
    const [pastReportClicked, setPastReportClicked] = useState(true);
    const [presentReportClicked, setPresentReportClicked] = useState(true);
    const [futureReportClicked, setFutureReportClicked] = useState(true);
    const [geoReportClicked, setGeoReportClicked] = useState(true);
    const [rankingReportClicked, setRankingReportClicked] = useState(true);


    const [officeProd, setOfficeProd] = useState<OfficeProductionMetrics>();

    const [progress, setProgress] = useState(0);
    const [teamData, setTeamData] = useState<TeamData>();
    const [teamReportClicked, setTeamReportClicked] = useState(true);


    const [showDataTableModal, setShowDataTableModal] = useState(false);

    const [agentTierPersonaData, setAgentTierPersonaData] = useState<Array<AgentTierPersona>>([]);

    const [activpendinglisting, setActivpendinglisting] = useState<[{ active: number; pending: number }]>();
    const navigate = useNavigate();
    const [officeTopCities, setOfficeTopCities] = useState<Array<OfficeTopCities>>([]);
    //Loading state
    const [officeInfosDataLoading, setOfficeInfosDataLoading] = useState<boolean>(false);
    const [officeNbrAgentsLoading, setOfficeNbrAgentsLoading] = useState<boolean>(false);
    const [monthDataLoading, setMonthDataLoading] = useState<boolean>(false);
    const [officeTopCitiesLoading, setOfficeTopCitiesLoading] = useState<boolean>(false);
    const [officeTotalPastDataLoading, setOfficeTotalPastDataLoading] = useState<boolean>(false);
    const [geoDataTotLoading, setGeoDataTotLoading] = useState<boolean>(false);
    const [officeProdLoading, setOfficeProdLoading] = useState<boolean>(false);




    const toggleDataTableModal = () => {
        setShowDataTableModal(prevState => !prevState);
    };

    const redirectToTeamInvestigator = (id: string) => {
        navigate(`/TeamInvestigator/${id}`);
    };

    useEffect(() => {
        setProgress(0);
        console.log(params);
        if (params) {
            setOfficeId(params.param ? params.param : '');

            var data = {
                id: params.param ? params.param : ''
            };

            setOfficeInfosDataLoading(true);

            OfficeService.getOfficeInfos(data)
                .then((response: any) => {

                    setOfficeInfosData(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeInfosDataLoading(false);
                });
            //
            setOfficeTopCitiesLoading(true);
            OfficeService.getOfficeTopCities(data)
                .then((response: any) => {

                    setOfficeTopCities(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeTopCitiesLoading(false);
                });
            //
            setOfficeTotalPastDataLoading(true);
            OfficeService.getTotalPastOffice(data)
                .then((response: any) => {
                    setOfficeTotalPastData(response.data);

                    setPrct(((response.data.current - response.data.last) * 100 / response.data.current).toFixed(2));


                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeTotalPastDataLoading(false);
                });



            //
            setMonthDataLoading(true);
            OfficeService.getOfficePresentMetrics(data)
                .then((response: any) => {
                    setMonthData(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);

                })
                .finally(() => {
                    setMonthDataLoading(false);
                });

            setOfficeNbrAgentsLoading(true);

            OfficeService.getOfficeNbrAgents(data)
                .then((response: any) => {
                    setOfficeNbrAgents(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeNbrAgentsLoading(false);
                });
            //
            setGeoDataTotLoading(true);
            OfficeService.getGeoDataTot10(data)
                .then((response: any) => {
                    setGeoDataTot(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setGeoDataTotLoading(false);
                });

            setOfficeProdLoading(true);
            OfficeService.getOfficeProduction(data)
                .then((response: any) => {
                    setOfficeProd(response.data[0]);

                }) 
                .catch((e: Error) => {
                    console.log(e);
                })
                .finally(() => {
                    setOfficeProdLoading(false);
                });
            //
            //
            // AgentService.getTeamData(data)
            //     .then((response: any) => {
            //         console.log(JSON.parse(response.data));
            //         setTeamData(JSON.parse(response.data));

            //     })
            //     .catch((e: Error) => {
            //         console.log(e);
            //     });
            // //Tier persona
            // AgentService.getAgentTierPersona(data)
            //     .then((response: any) => {
            //         setAgentTierPersonaData(response.data);

            //     })
            //     .catch((e: Error) => {
            //         console.log(e);
            //     });

        }
        setProgress(100);

    }, [params.param]);

    // useEffect(() => {
    //     if(agentInfosData[0]){
    //         var input = {
    //             id: params.parasetOfficeProdm ? params.param :'',
    //             officeId : agentInfosData[0] ? agentInfosData[0].officeId :''
    //           };
    //           AgentService.getofficeproduction(input)
    //           .then((response: any) => {
    //             (JSON.parse(response.data)); 
    //           })
    //           .catch((e: Error) => {
    //             console.log(e);
    //           });       
    //         }

    // }, [agentInfosData]);

    // useEffect(() => {
    //     if(monthData && totalFutureMetrics){

    //         setActivpendinglisting([{active: monthData[0] ? monthData[0].list : 0 , pending: totalFutureMetrics[0]?totalFutureMetrics[0].pendingListings:0}]);

    //     }

    // }, [monthData,totalFutureMetrics]);




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

        if (officeId) {

            setIdAgentForPastReport(officeId);
            setdisplayPastReport(true);
            setPastReportClicked(!pastReportClicked);
        }


    };

    const handleClickPresentReport = () => {
        if (officeId) {

            setOfficeIdForPresentReport(officeId);
            setdisplayPresentReport(true);
            setPresentReportClicked(!presentReportClicked);
        }

    };


    const handleClickGeoReport = () => {
        if (officeId) {
            setOfficeIdForGeoReport(officeId);
            setDisplayGeoReport(true);
            setGeoReportClicked(!geoReportClicked);
        }
    };

    const handleClickRankingReport = () => {

            setRankingReportClicked(!rankingReportClicked);
        
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
                        <div><BackButtonToArea /></div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title mb-0 "><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Office Information: {officeInfosDataLoading ? <Skeleton width="10rem" className="d-inline-block" /> :<strong>{officeInfosData[0] ? officeInfosData[0].officeName : ''}</strong>}</h3>

                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-auto">
                                            <span className="small text-left">Address: </span>
                                            {officeInfosDataLoading ? <Skeleton width="15rem" className="d-inline-block" /> : <strong>{officeInfosData[0] ? officeInfosData[0].officeAddress1 : ''}</strong>}
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-6 text-nowrap">
                                            <span className="small d-inline-block text-left mr-1">Office Phone: </span> 
                                            {officeInfosDataLoading ? <Skeleton width="10rem" className="d-inline-block" /> : <strong>{officeInfosData[0] ? officeInfosData[0].officePhone : ''}</strong>}
                                            
                                        </div>
                                        <div className="col-md-6 text-nowrap ">
                                            <span className="small d-inline-block text-left mr-1">City/State: </span> 
                                            {officeInfosDataLoading ? (
                                                <Skeleton width="8rem" className="d-inline-block ml-1" />
                                            ) : (
                                                <>
                                                    <strong>{officeInfosData[0] ? officeInfosData[0].officeCity : ''}</strong>, <strong>{officeInfosData[0] ? officeInfosData[0].officeState : ''}</strong>
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
                                        <i className="bi bi-info-circle" /></a> Office Profile: <strong>Size and Persona</strong></h3>
                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body pb-0 ">
                                    <div className="row ">
                                        <div className="col-md-4 text-nowrap">
                                            <div className="row text-nowrap">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small  text-left">Active Agents: </span>
                                                    {officeNbrAgentsLoading ? <Skeleton width="3rem" className="d-inline-block" /> : <strong>{officeNbrAgents ? officeNbrAgents : '0'}</strong>}
                                                    
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Annual Sides: </span>
                                                    {monthDataLoading ? <Skeleton width="3rem" className="d-inline-block ml-1" /> : <strong> {monthData ? monthData[0].list + monthData[0].sell + monthData[0].dna : '0'}</strong>}
                                                    
                                                    
                                                 </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap ">
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap pl-0 mr-3">
                                                    Top Two Cities:
                                                </div>
                                                <div className="col-md-6 text-nowrap  ">
                                                    {officeTopCitiesLoading ? <Skeleton width="4rem" className="d-inline-block ml-1" /> : 
                                                    officeTopCities[0] ? (
                                                        <ul className="pr-1" style={{ listStyleType: 'none' }}>

                                                            {officeTopCities.map((element, index) => (
                                                                <li key={index}><strong>{element.city}</strong></li>

                                                            ))}
                                                         </ul>
                                                    ):(<ul className="pr-1 "style={{ listStyleType: 'none' }}>
                                                        <li className="text-white"><strong>-</strong></li>
                                                        <li className="text-white"><strong>-</strong></li>

                                                    </ul>)}
                                                   
                                                    {/* <ul className="pr-1"style={{ listStyleType: 'none' }}>
                                                        <li><strong>Irvine</strong></li>
                                                        <li><strong>Mission Vieja</strong></li>

                                                    </ul> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap">
                                            <div className="pb-0 pt-0 pr-0 pl-0 mr-0 mb-0 ml-2 mt-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                {/* <OfficeMixOfSalesReport id={officeId ? officeId : ''} /> */}
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
                                <i className="bi bi-info-circle fs-6" /></a> Past: How is the office doing this year over last year?</h5>
                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                            {officeTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :

                                                    <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Recent 12m</span>
                                                                <span className="font-bold text-lg">{officeTotalPastData ? officeTotalPastData.current : '0'}</span>
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
                                            <div className="description-block">
                                                {officeTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                        :
                                                        <div className="mx-3">
                                                        <div className="flex justify-content-between gap-1">
                                                            <div className="flex flex-column gap-1">
                                                                <span className="text-secondary text-sm">Previous 12m</span>
                                                                <span className="font-bold text-lg">{officeTotalPastData ? officeTotalPastData.last : '0'}</span>
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
                                                

                                                {officeTotalPastDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <h5 className="mb-0">
                                                        {officeTotalPastData ?
                                                            <span id="spanOverYearIcon" className={`strong ${officeTotalPastData?.current >= officeTotalPastData.last ? "text-success" : "text-danger"}`}>
                                                                <i className={`bi-arrow-${officeTotalPastData.current >= officeTotalPastData.last ? "up" : "down"}-circle-fill`}></i>

                                                            </span>
                                                            : '0'
                                                        }
                                                    </h5>
                                                }
                                                {officeTotalPastDataLoading ? '' : <div className="">{prct ? prct : ''}%</div  >}

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

                                        {!pastReportClicked && <OfficePastYearOverYearTrendReport id={officeId ? officeId : ''} />}
                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}

                            {/* /.card */}

                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 zip codes that the agent has sales in the past 12 months, including this month. They can be a listing or selling agent. Plus, sales outside of the MLS, if we have that data.">
                                <i className="bi bi-info-circle fs-6" /></a> Geo: Where do most of their sales take place?</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-4 border-right">
                                            <div className="description-block">

                                                {geoDataTotLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Percent in 10 Zips</span>
                                                            <span className="font-bold text-lg">{geoDataTot ? geoDataTot || 0 : 0}</span>
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

                                        {!geoReportClicked && <OfficeGeographyListingsZipCode id={officeIdForGeoReport ? officeIdForGeoReport : ''} />}


                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}








                        </section>
                        {/*<!-- /.Left col -->*/}

                        {/*<!-- /.Right col -->*/}
                        <section className="col-sm-6 ">
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the agent’s most recent 12-months sales for both Listing and Selling transactions.Plus, sales outside of the MLS, if we have that data. The values include listing and co-listing plus selling and co-selling transactions. It includes this partial month’s totals as well.">
                                <i className="bi bi-info-circle fs-6" /></a> Present: What's their mix of business, listing or selling?</h5>

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
                                                        <span className="font-bold text-lg">{monthData ? monthData[0].list || '0' : '0'}</span>
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
                                            <div className="description-block">                                            

                                            {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                :
                                                <div className="mx-1">
                                                <div className="flex justify-content-between gap-1">
                                                    <div className="flex flex-column gap-1">
                                                        <span className="text-secondary text-sm">Sell Agent</span>
                                                        <span className="font-bold text-lg">{monthData ? monthData[0].sell || '0' : '0'}</span>
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
                                            <div className="description-block">
                                            
                                            {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                :
                                                <div className="mx-0">
                                                <div className="flex justify-content-between gap-1">
                                                    <div className="flex flex-column gap-1">
                                                        <span className="text-secondary text-sm">Non MLS</span>
                                                        <span className="font-bold text-lg">{monthData ? monthData[0].dna || '0' : '0'}</span>
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
                                            <div className="description-block">
                                            
                                            {monthDataLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                :
                                                <div className="mx-1">
                                                <div className="flex justify-content-between gap-1">
                                                    <div className="flex flex-column gap-1">
                                                        <span className="text-secondary text-sm">12 Months</span>
                                                        <span className="font-bold text-lg">{monthData ? monthData[0].list + monthData[0].sell + monthData[0].dna : '0'}</span>
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
                                        {!presentReportClicked && <PresentOfficeProductionReport id={officeIdForPresentReport ? officeIdForPresentReport : ''} />}


                                    </div>

                                </div>
                                {/* /.card-body */}

                            </div>
                            {/* /.card */}
                            <h5 className="mb-2 mt-0"><a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="This chart shows the top 10 agents in this office alongside a graph of their sales volume in the past 12 months. If the agent of your search is part of the top 10, you can note their ranking in the office highlighted with a yellow bar graph. If the agent is below the top 10, then they will be shown in the 11th row so that you can see their relative sized graph. If you are interested in any of the other agents named on this graph, you can click on the bar chart next to their name and the report will move to that agent’s production reporting.">
                                    <i className="bi bi-info-circle fs-6" /></a> Office Ranking: How do the agents rank in their office?</h5>
                               
                               <div className="card  collapsed-card">
                                   <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                               
                                            {officeProdLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                :
                                                <div className="mx-1">
                                                <div className="flex justify-content-between gap-1">
                                                    <div className="flex flex-column gap-1">
                                                    <span className="text-secondary text-sm">Agents</span>
                                                    <span className="font-bold text-lg">{officeProd ? officeProd.num_agents || 0: '0' }</span>
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
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                              
                                                {officeProdLoading ? <ProgressSpinner className="spinner-agent-metrics mb-0 mt-0 pb-0 pt-0" style={{ width: '20px', height: '24px' }} strokeWidth="5" />
                                                    :
                                                    <div className="mx-1">
                                                    <div className="flex justify-content-between gap-1">
                                                        <div className="flex flex-column gap-1">
                                                            <span className="text-secondary text-sm">Office Prod</span>
                                                            <span className="font-bold text-lg">{officeProd ? officeProd.nombre || 0: '0'}</span>
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

                                   {!rankingReportClicked&&<OfficeRankingAgentPerformance id={officeId?officeId:''} />}

                                                      
                                   </div>
                   
                                   </div>
                                   {/* /.card-body */}
                                   
                               </div>
                        </section>
                        {/*<!-- /.Right col -->*/}

                    </div>
                    {/*<!-- /.row (main row) -->*/}



                </div>{/* /.container-fluid */}


            </div>
        </div>

    );
};

export default AgentProdReports;