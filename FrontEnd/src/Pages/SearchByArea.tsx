import  { useState, useEffect, useRef, useCallback } from 'react';
import ReactNode from 'react'
import CremsMap from '../Components/Map';
import { MultiSelect } from 'primereact/multiselect';
import { CascadeSelect } from 'primereact/cascadeselect';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
// import { GeoService } from './services/geoService';

import { MapProvider,  useMapContext } from '../Components/Map/MapContext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';

import ZoomButton from '../Components/ZoomButton';
import ClearButton from '../Components/ClearButton';

// import CremsTable from './cremsTable'

import { Panel, PanelHeaderTemplateOptions } from 'primereact/panel';
import { RadioButton } from "primereact/radiobutton";

import { Divider } from 'primereact/divider';
import { AutoComplete,AutoCompleteChangeEvent   } from 'primereact/autocomplete';
import { Messages } from 'primereact/messages';
import States from "../Models/States";
import GeoAreaService from "../Services/GeoAreaService";
import { stat } from 'fs';
import { initial } from 'lodash';
import Counties from "../Models/Counties";
import Cities from "../Models/Cities";
import Zip from "../Models/Zip";
import CremsTable from '../Components/CremsTable';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Pane } from 'react-leaflet';
import PrimeReact from 'primereact/api';












// interface AutocompleteItem {
//     value: number;
//     label: string;
//   }

interface MonthSuggestion {
    value: number;
}


function SearchByArea() {
    

    const [states, setstates] = useState<Array<States>>([]);
    const [copyStates, setCopyStates] = useState<Array<States>>([]);
    const [Currentstate, setCurrentstate] = useState<States | null>(null);
    const [filteredStates, setFilteredStates] = useState<States[]>(states);

    const [counties, setCounties] = useState<Array<Counties>>([]);
    const [copyCounties, setCopyCounties] = useState<Array<Counties>>([]);
    const [CurrentCountie, setCurrentCountie] = useState<Counties | null>();
    const [filteredCounties, setFilteredCounties] = useState<Counties[]>(counties);

    const [cities, setCities] = useState<Array<Cities>>([]);
    const [copyCities, setCopyCities] = useState<Array<Cities>>([]);
    const [currentCity, setCurrentCity] = useState<Cities | null>();
    const [filteredCities, setFilteredCities] = useState<Cities[]>(cities);

    const [zipcodes, setZipcodes] = useState<Array<Zip>>([]);
    // const [selectedZipCode, setSelectedZipCode] = useState<Zip>();
     const [currentZip, setCurrentZip] = useState<Zip[]>();
    // const [currentZip, setCurrentZip] = useState<string>('');
    const [selectedZipCode, setSelectedZipCode] = useState<Zip[]>([]);
    const msgs = useRef<Messages>(null);

    const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);

    const handleLoadingTransactions = (newBoolean: boolean) => {
        setIsLoadingTransactions(newBoolean);
    };
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentMonth, setCurrentMonth] = useState<MonthSuggestion | null>(null);
    const [listSuggestionsMonth, setListSuggestionsMonth] = useState<MonthSuggestion[]>([]);

    const [ingredient, setIngredient] = useState('');

    const ListMonthSuggestions: MonthSuggestion[] = [
        { value: 12 },
        { value: 9 },
        { value: 6 },
        { value: 3 }
      ];


    const showMessages = (text: string) => {
        if (msgs.current) {
          msgs.current.clear();
          msgs.current.show([
            { severity: 'info', summary: 'Info', detail: text, sticky: true, closable: false }
          ]);
        }
      }






    

    useEffect(() => {
        // Fetch autocomplete suggestions from API based on inputValue
        const fetchStates = async () => {
    
            GeoAreaService.getStates()
            .then((response: any) => {
              setstates(response.data);
              setCopyStates(response.data);
              localStorage.setItem('states', JSON.stringify(response.data));

              
            })
            .catch((e: Error) => {
              console.log(e);
            }); 
        };
    
        fetchStates();
    
      }, []);

      const setCurrentStates = async (state : States) => {
        try {
          //const result = await geoservice.fetchState(state.code);
          console.log(state);
          setCurrentstate(state); 
          loadCounties(state)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    //   const filterStates = (event: any) => {
        
    //     // Timeout to emulate a network connection

    //       let _filtered: States[];
    //       //var initialFilteres = states;
    //       _filtered = states;
    //       if (!event.query.trim().length) {
    //         //console.log(initialFilteres);
    //         console.log('in copy block');
    //         //console.log(copyStates);
    //         _filtered = copyStates//[...states];
    //        // setstates(copyStates);
    //       } else {
    //         console.log('else');
    //         _filtered = states.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }
    //       console.log(_filtered);

    //      // setstates(_filtered);
    
    //   };

    const filterStates = (event : any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
          let _filtered;
          if (!event.query.trim().length) {
            _filtered = [...copyStates];
          }
          else {

            var list = JSON.parse(localStorage.getItem('states')||'[]');

            _filtered = list.filter((item : States) => {
    
              return item.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
          }
    
          setstates(_filtered);
        }, 250);
      }

    //  const filterStates = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredStates(states);
    //     } else {
    //       const filtered = states.filter((state) => state.name.toLowerCase().startsWith(query));
    //       setFilteredStates(filtered);
    //     }
    //   };

      const loadCounties = async (state: States) => {

        GeoAreaService.getCounties(state.code)
        .then((response: any) => {
          setCounties(response.data);
          setCopyCounties(response.data);
          localStorage.setItem('counties', JSON.stringify(response.data));

          
        })
        .catch((e: Error) => {
          console.log(e);
        });
      };

      const setCurrentCounties = async (county : Counties) => {
        try {
          setCurrentCountie(county);
          loadCities(county);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

    //   const filterCounties = (event: any) => {
        
    //     // Timeout to emulate a network connection
    //     setTimeout(() => {
    //       let _filtered: Counties[];
      
    //       if (!event.query.trim().length) {
    //         _filtered = copyCounties//[...states];
    //       } else {
    //         _filtered = counties.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }
      
    //       setCounties(_filtered);
    //     }, 250);
    //   };

    const filterCounties = (event : any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
          let _filtered;
          if (!event.query.trim().length) {
            _filtered = [...copyCounties];
          }
          else {

            var list = JSON.parse(localStorage.getItem('counties')||'[]');

            _filtered = list.filter((item : Counties) => {
    
              return item.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
          }
    
          setCounties(_filtered);
        }, 250);
      }

    // const filterCounties = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredCounties(counties);
    //     } else {
    //       const filtered = counties.filter((county) => county.name.toLowerCase().startsWith(query));
    //       setFilteredCounties(filtered);
    //     }
    //   };


      const loadCities = async (county: Counties) => {

        GeoAreaService.getCities(county.code)
        .then((response: any) => {
          setCities(response.data);
          setCopyCities(response.data);
          localStorage.setItem('cities', JSON.stringify(response.data));

          
        })
        .catch((e: Error) => {
          console.log(e);
        });
      };

      const setCurrentCities = async (city : Cities) => {
        try {
          setCurrentCity(city);
          loadZips(city);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }

    //   const filterCities = (event: any) => {
        
    //     // Timeout to emulate a network connection
    //     setTimeout(() => {
    //       let _filtered: Cities[];
      
    //       if (!event.query.trim().length) {
    //         _filtered = copyCities//[...states];
    //       } else {
    //         _filtered = cities.filter((item) => {
    //           return item.name.toLowerCase().startsWith(event.query.toLowerCase());
    //         });
    //       }
      
    //       setCities(_filtered);
    //     }, 250);
    //   };

    const filterCities = (event : any) => {
        // Timeout to emulate a network connection
        setTimeout(() => {
          let _filtered;
          if (!event.query.trim().length) {
            _filtered = [...copyCities];
          }
          else {

            var list = JSON.parse(localStorage.getItem('cities')||'[]');

            _filtered = list.filter((item : Cities) => {
    
              return item.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
          }
    
          setCities(_filtered);
        }, 250);
      }

    // const filterCities = (event: any) => {
    //     const query = event.query.toLowerCase();
    //     if (query.trim().length === 0) {
    //       setFilteredCities(cities);
    //     } else {
    //       const filtered = cities.filter((city) => city.name.toLowerCase().startsWith(query));
    //       setFilteredCities(filtered);
    //     }
    //   };

      const loadZips = async (city: Cities) => {

        GeoAreaService.getZips(city.code)
        .then((response: any) => {
          setZipcodes(response.data);
          
        })
        .catch((e: Error) => {
          console.log(e);
        });
      };

     
  const handleClickZip = async (val: Zip[]) => {
    const param = val.map((element) => element.zip);
    // show zips before encoding
    showMessages(`City: ${currentCity ? currentCity.name : ''} | zip [${param.join(', ')}]`);

    // const encodedParam = encodeURIComponent(param.join(','));

    // const zip = await GeoAreaService.getZipByCode(encodedParam);
    // setCurrentZip(zip);
    await GeoAreaService.getZipByCode(param.toString())
        .then((response: any) => {
          setCurrentZip(response.data);
         

          
        })
        .catch((e: Error) => {
          console.log(e);
        });
  };
  const clearData = () =>{

    if (msgs.current) {
        msgs.current.clear();
        }

    setCurrentstate(null);
    setCurrentCountie(null);
    setCurrentCity(null);
    setSelectedZipCode([]);
    setCurrentMonth(null);
    setRefreshKey(prevKey => prevKey + 1); // Change the refresh key to force re-render    
  }

const completeMethod = (e: any) => {
    setListSuggestionsMonth(ListMonthSuggestions);
};

const handleChangeMonth = (e: AutoCompleteChangeEvent) => {
    setCurrentMonth(e.value);
};


/*
const showMapPanel = () => {
    panelLayout1.current.expand()
    panelLayout2.current.collapse()
    panelLayout3.current.collapse()

};*/

  
  

  const headerPane1 = ( options:PanelHeaderTemplateOptions) => {
      const className = `${options.className} justify-content-space-between`;
      

      return (

          <div className={className}>
              
              <div className="flex align-items-center gap-2">
                  <Avatar icon="pi pi-search" size="large" shape="circle" />
                  <span className="font-bold">Choose Area</span>
                  <a className="badge badge-info" role="button" tabIndex={0} data-bs-toggle="popover" data-placement="bottom" title="Note" data-bs-content="The agent and office information shown here comes from the most recent phone numbers and email addresses used in their MLS listings.">
                    <i id="idInfoIcon" className="bi bi-info-circle" />
                  </a>
              </div>
              <div className='grid'>
                 <div className='col'>
                  test 1
                 </div>
                 <div className='col'>
                 {options.togglerElement}
                 </div>
                  
            </div>
          </div>
      );
  };

  const headerPane2 = ( options:PanelHeaderTemplateOptions) => {
    const className = `${options.className} justify-content-space-between`;

    return (
        <div className={className}>
            <div className="flex align-items-center gap-2">
             
                <Avatar icon="pi pi-map" size="large" shape="circle" />
                <span className="font-bold">Area Activity: Transactions in these zip codes</span>
            </div>
            <div className='grid'>
                 <div className='col'>
                  test
                 </div>
                 <div className='col'>
                 {options.togglerElement}
                 </div>
                  
            </div>
        </div>
    );
};

const headerPane3 = ( options:PanelHeaderTemplateOptions) => {
  const className = `${options.className} justify-content-space-between`;

  return (
      <div className={className}>
          <div className="flex align-items-center gap-2">
           
              <Avatar icon="pi pi-map-marker" size="large" shape="circle" />
              <span className="font-bold">Area Dynamics: Months of inventory in these zip codes</span>
          </div>
          <div>
               
                {options.togglerElement}
            </div>
      </div>
  );
};


  return (
    
    <MapProvider>

      <Panel  header="Choose Area" headerTemplate={headerPane1} toggleable>
        <div className="grid" key={refreshKey}>



          <div className="col-6 md:col-4 col-3">
            <span className="p-float-label">
              <AutoComplete inputId="autocompletstate" field="name" value={Currentstate} suggestions={states} completeMethod={filterStates} onChange={(e) => { setCurrentStates(e.value) }} dropdown />
              <label htmlFor="autocompletstate">Choose State</label>

            </span>
          </div>

          <div className="col-6 md:col-4 col-3">
            <span className="p-float-label">
              <AutoComplete inputId="autocompletcounty" field="name" value={CurrentCountie} suggestions={counties} completeMethod={filterCounties} onChange={(e) => { setCurrentCounties(e.value) }} dropdown />
              <label htmlFor="autocompletcounty">Choose County</label>
            </span>
          </div>

          <div className="col-6 md:col-4 col-3">
            <span className="p-float-label">
              <AutoComplete inputId="autocompletcity" field="name" value={currentCity} suggestions={cities} completeMethod={filterCities} onChange={(e) => { setCurrentCities(e.value) }} dropdown />
              <label htmlFor="autocompletcity">Choose City</label>
            </span>
          </div>

          <div className="col-6 md:col-6 col-3">
            <span className="p-float-label">
              <MultiSelect inputId="multiselect" value={selectedZipCode} options={zipcodes} onChange={(e) => { setSelectedZipCode(e.value); handleClickZip(e.value) }} optionLabel="zip" className="w-full md:w-20rem" />
              <label htmlFor="multiselect">Zip Codes</label>

            </span>

          </div>

          <div className="col-12 md:col-6 col-4">

            <div className="flex flex-wrap gap-2">
              <div className="flex align-items-center">
                <span>Number of month</span>
              </div>
              <div className="flex align-items-center">
                <RadioButton inputId="ingredient1" name="pizza" value="Cheese" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Cheese'} />
                <label htmlFor="ingredient1" className="ml-2">3</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton inputId="ingredient2" name="pizza" value="Mushroom" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Mushroom'} />
                <label htmlFor="ingredient2" className="ml-2">6</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton inputId="ingredient3" name="pizza" value="Pepper" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Pepper'} />
                <label htmlFor="ingredient3" className="ml-2">9</label>
              </div>
              <div className="flex align-items-center">
                <RadioButton inputId="ingredient4" name="pizza" value="Onion" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Onion'} />
                <label htmlFor="ingredient4" className="ml-2">12</label>
              </div>

            </div>

          </div>
          <div className="col-12 md:col-fixed">
              <ZoomButton  zoom={15} zips={currentZip ? currentZip : []} city={currentCity ? currentCity : null} isLoadingTransactions={isLoadingTransactions} onLoadingTransactionsChange={handleLoadingTransactions} nbrMonth={currentMonth ? currentMonth.value : 12} />
              <ClearButton clearData={clearData} />
          </div>

          <Divider />
          <Messages ref={msgs} />
          {isLoadingTransactions ? (<div className="col-12 mb-5"><BeatLoader className="loading-container" size={10} color="#36d7b7" /></div>)
            : (
              <div className="col-12 mb-5" style={{ width: "100%", overflow: "auto", display: "flex" }}>

                <CremsTable></CremsTable>
              </div>
            )
          }


        </div>
      </Panel>

      <Panel  headerTemplate={headerPane2} toggleable>
        <CremsMap center={[36.7783, -119.4179]} zoom={5} />

      </Panel>

      <Panel headerTemplate={headerPane3} toggleable>


      </Panel>








    </MapProvider>

  );
};

export default SearchByArea;
