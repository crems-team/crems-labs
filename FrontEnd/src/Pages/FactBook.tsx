import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import AgentService from "../Services/AgentService";
import AgentModel from "../Models/AgentModel";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import http from '../http-common';
import { useKeycloak } from "@react-keycloak/web";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faStar, faStarHalfAlt,faSave ,fas  } from '@fortawesome/free-solid-svg-icons';
import { fas, faR, faSave ,faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import SearchItem from "../Models/SearchItemHistory";
import { toast } from 'react-toastify';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import SearchHistory from '../Components/SearchHistory';
import { useAppDispatch } from '../Hooks/DispatchHook';
import { resetMapState} from '../Redux/Slices/MapSlice'







interface AutocompleteItem {
    value: number;
    label: string;
  }


/*  interface SearchItem {
  savedType : string;
  firstName: string;
  lastName: string;
  isFavorite: boolean;
  agentIdC : string;
} */

function FactBook() {

  

  return (
    <div className="container mt-3">
       
    <main>
        <section >
            <div className="row align-items-center">
                <div className="col-md-12">
                <p className="custom-font">
                <strong>Purpose:</strong> This system is designed to provide Title, Mortgage, and RE Expansion Team sales managers with detailed reports* about every real estate agent and loan officer (LO) operating within their sales territory.  We call this a “FACT BOOK” of information. 
                </p>
                </div>
               
            </div>
            <div className="row align-items-center">
                <div className="col-md-12">
                <p className="custom-font">
                <strong>Information Source:</strong> The source of the FACT BOOK’s information is updated twice daily from hundreds of MLS data feeds, with title data verifications, DRE (Department of Real Estate) license information, and published reports of Agent Teams.  CREMS filters and cleans the incoming data every day with proprietary AI systems to provide a near real time update to the system’s database.  The CREMS FACT BOOK builds as complete a record of real estate transactions over multiple years as the available data makes possible.
                </p>
                </div>
               
            </div>
            <div className="row text-center">
                <span className="custom-font">
                    <strong>Using the FACT BOOK</strong>
                </span>
            </div>
        </section>
        <section>
        <div className="row align-items-center">
                <div className="col-md-8">
                <p className="custom-font">
                <strong>Reporting Format:</strong> Each of the sections of the FACT BOOK begins with a search for one of the following:</p>
                        
                        <ul className="custom-font ml-3">
                            <li>an individual Real Estate “Agent”;</li>
                            <li>Real Estate “Office”;</li>
                            <li>Geographic “Area”;</li>
                            <li>Loan Officer (“LO”).</li>
                        </ul> 
                        <p className="custom-font">
                        After locating the individual, office, or area, a series of questions about their sales performance are posed. For example, the first question asked about an agent’s sales performance is, “How is the agent doing this year over last year?”  The first report answers
                        that question in a simple graph, or a table of information, as appropriate.  Additional questions** follow and their results are presented clearly, one question at a time.  The objective of the system is to provide clear answers to the most important questions. 
                        </p>
                </div>
                <div className="col-md-4">
                    <img
                    src="./APR_Report_Example_400.jpg"
                    alt="CREMS_Industry_Venn_Diagram"
                    className="mt-5" // Marge à droite pour espacer l'image du texte
                    style={{ width: '100%', height: 'auto' }} // Taille de l'image
                    />
                </div>
               
            </div>
        </section>
        <section>
        <div className="row text-center mb-3">
                <span className="custom-font">
                    <strong>Target Industries</strong>
                </span>
            </div>
        <div className="row align-items-center">
                <div className="col-md-8">
                    <p className="custom-font">
                    <strong>Common Needs:</strong> For each of the different aspects of real estate sales, we recognize that there are overlapping sets of data (reporting) that would be useful to the respective sales managers. Common to all these industries is the question, “Are your salespeople targeting the best real estate agents to grow their sales?”  
                    For example:

                    </p>
                        
                        <ul className="custom-font ml-3">
                            <li>
                                <strong>Title Rep Sales Managers (Closing Services):</strong> In addition to determining active agents, what about transaction types, location, and pricing strategies? 
                            </li>
                            <li>
                                <strong>Mortgage Rep Sales Managers (Loan Officers):</strong> What type of properties does this agent service, and who else do they work with?  
                            </li>
                            <li>
                                <strong>Expansion Team Management:</strong> Recruiting and retaining the best agents will lead to success. Determine what agents would make a good fit with your team, and how can you support them?
                            </li>
                        </ul> 
                        
                </div>
                <div className="col-md-4">
                    <img
                    src="./CREMS_Industry_Venn_Diagram.jpg"
                    alt="CREMS_Industry_Venn_Diagram"
                    className="mt-5" // Marge à droite pour espacer l'image du texte
                    style={{ width: '100%', height: 'auto' }} // Taille de l'image
                    />
                </div>
               
            </div>
        </section>
        <section >
            <div className="row align-items-center">
            <div className="row text-center mb-3">
                <span className="custom-font">
                    <strong>How to Benefit</strong>
                </span>
            </div>
                <div className="col-md-12">
                <p className="custom-font">
                    <strong>Conclusion:</strong> Each of these industries achieves the bulk of their sales by targeting the best Real Estate agents to build working relationships with.  CREMS endeavors to help target those agents, but in addition, to build a <span style={{ textDecoration: 'underline'}}>consultive relationship</span> between the salesperson and their targeted real estate agent.  These reports are designed to accomplish that, but CREMS can also provide consultation and training on how to achieve the maximum benefit.
                </p>
                </div>
               
            </div>
        </section>
    </main>
    
    </div>
  );
};

export default FactBook;
