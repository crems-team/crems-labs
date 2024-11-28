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
            OfficeService.getOfficeInfos(data)
                .then((response: any) => {

                    setOfficeInfosData(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                });
            //
            OfficeService.getTotalPastOffice(data)
                .then((response: any) => {
                    setOfficeTotalPastData(JSON.parse(response.data));

                    setPrct(((JSON.parse(response.data).current - JSON.parse(response.data).last) * 100 / JSON.parse(response.data).current).toFixed(2));


                })
                .catch((e: Error) => {
                    console.log(e);
                });



            //

            OfficeService.getOfficePresentMetrics(data)
                .then((response: any) => {
                    setMonthData(response.data);
                    console.log(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);

                });

            OfficeService.getOfficeNbrAgents(data)
                .then((response: any) => {
                    setOfficeNbrAgents(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                });
            //
            OfficeService.getGeoDataTot10(data)
                .then((response: any) => {
                    setGeoDataTot(response.data);

                })
                .catch((e: Error) => {
                    console.log(e);
                });

            OfficeService.getOfficeProduction(data)
                .then((response: any) => {
                    setOfficeProd(response.data[0]);
                    console.log(officeProd);

                }) 
                .catch((e: Error) => {
                    console.log(e);
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
                                        <i id="idInfoIcon" className="bi bi-info-circle" /></a> Office Information: <strong>{officeInfosData[0] ? officeInfosData[0].officeName : ''}</strong></h3>

                                </div>
                                {/* /.card-header */}
                                {/* form start */}
                                <div className="card-body mb-6">
                                    <div className="row">
                                        <div className="col-md-auto">
                                            <span className="small text-left">Address: </span><strong>{officeInfosData[0] ? officeInfosData[0].officeAddress1 : ''}</strong>
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-6 text-nowrap">
                                            <span className="small d-inline-block text-left">Office Phone: </span> <strong>{officeInfosData[0] ? officeInfosData[0].officePhone : ''}</strong>
                                        </div>
                                        <div className="col-md-6 text-nowrap ">
                                            <span className="small d-inline-block text-left">City/State: </span> <strong>{officeInfosData[0] ? officeInfosData[0].officeCity : ''}</strong>, <strong>{officeInfosData[0] ? officeInfosData[0].officeState : ''}</strong>
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
                                                    <span className="small  text-left">Active Agents: </span><strong>{officeNbrAgents ? officeNbrAgents : '0'}</strong>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap">
                                                    <span className="small d-inline-block text-left">Annual Sides: </span><strong> 872</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap ">
                                            <div className="row">
                                                <div className="col-md-4 text-nowrap pl-0">
                                                    Top Two Cities:
                                                </div>
                                                <div className="col-md-6 text-nowrap  ">
                                                    <ul className="pr-1"style={{ listStyleType: 'none' }}>
                                                        <li><strong>Irvine</strong></li>
                                                        <li><strong>Mission Vieja</strong></li>

                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 text-nowrap">
                                            <div className="pb-0 pt-0 pr-0 pl-0 mr-0 mb-0 ml-2 mt-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <OfficeMixOfSalesReport id={officeId ? officeId : ''} />
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
                                <i className="bi bi-info-circle fs-6" /></a> Past:  Year-over-Year Trend</h5>
                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="">{officeTotalPastData ? officeTotalPastData.current : '0'}</h5>
                                                <span className="">Recent 12m</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="">{officeTotalPastData ? officeTotalPastData.last : '0'}</h5>
                                                <span className="">Previous 12m</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="">
                                                    {officeTotalPastData ?
                                                        <span id="spanOverYearIcon" className={`strong ${officeTotalPastData?.current >= officeTotalPastData.last ? "text-success" : "text-danger"}`}>
                                                            <i className={`bi-arrow-${officeTotalPastData.current >= officeTotalPastData.last ? "up" : "down"}-circle-fill`}></i>

                                                        </span>
                                                        : '0'
                                                    }
                                                </h5>
                                                <span className="">{prct ? prct : ''}%</span>
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
                                <i className="bi bi-info-circle fs-6" /></a> Geography: Office Listings Zip Code</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-4 border-right">
                                            <div className="description-block">
                                                <h5 className="">{geoDataTot ? geoDataTot || 0 : 0}</h5>
                                                <span className="">Percent in 10 Zips</span>
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
                                <i className="bi bi-info-circle fs-6" /></a> Present: Office Production Report</h5>

                            <div className="card  collapsed-card">
                                <div className="card-header">

                                    <div className="row">
                                        <div className="col-sm-2 border-right pl-0 pr-0 mr-0">
                                            <div className="description-block pl-0 pr-0 mr-0">
                                                <h5 className="">{monthData ? monthData[0].list || '0' : '0'}</h5>
                                                <span className="pl-0 pr-0 mr-0">List Agent</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-2 border-right">
                                            <div className="description-block">
                                                <h5 className="">{monthData ? monthData[0].sell || '0' : '0'}</h5>
                                                <span className="">Sell Agent</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-2 border-right">
                                            <div className="description-block">
                                                <h5 className="">{monthData ? monthData[0].dna || '0' : '0'}</h5>
                                                <span className="">Non MLS</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-3 border-right">
                                            <div className="description-block">
                                                <h5 className="">{monthData ? monthData[0].list + monthData[0].sell + monthData[0].dna : '0'}</h5>
                                                <span className="">12 Months</span>
                                            </div>
                                            {/* /.description-block */}
                                        </div>
                                        <div className="col-sm-1">


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
                                    <i className="bi bi-info-circle fs-6" /></a> Office Ranking: Agent Performance</h5>
                               
                               <div className="card  collapsed-card">
                                   <div className="card-header">
                   
                                       <div className="row">
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                                   <h5 className="">{officeProd ? officeProd.num_agents || 0: '0' }</h5>
                                                   <span className="">Agents</span>
                                               </div>
                                               {/* /.description-block */}
                                           </div>
                                           <div className="col-sm-3 border-right">
                                               <div className="description-block">
                                                   <h5 className="">{officeProd ? officeProd.nombre || 0: '0'}</h5>
                                                   <span className="">Office Prod.</span>
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