    import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { feature } from 'topojson-client';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store';
import {
  setMapLevel,
  setCopyCities,
  setCities,
  setIsLoadingCities,
  getTotalAgents,getTotalTransactionAgent,setTotalTransactionsAg,setTotalListingsAgent,setTotalAgent,
  getTotalListingsAgent,setListingsGeoProduction,getListingsGeoProduction,
  getTotalTransactionForListings,getTotalAgentForListing,setTotalAgentForListing,
  setTotalTransactionForListings, getTeamGeoProduction,setZipCodes,setSelectedZipCode,setSelectedItem,setQuery,setMode,
  setSearchHistoryTeam,setSearchHistory,getZipCodesByCity, setSelectedTabIndex
} from '../../../Redux/Slices/AreaAgentSlice';
import { setSelectedLocation, getAgentGeoProduction,setGeoAreaAgentProdReportClicked,setAgentGeoProdResult,setActivityReportClicked } from '../../../Redux/Slices/MapSlice';
import { useAppDispatch } from '../../../Hooks/DispatchHook';
import GeoAreaAgentProdService from "../../../Services/GeoAreaAgentProdService";
import { BeatLoader } from 'react-spinners';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { useSearch } from '../../../Components/Context/Context';
import { useKeycloak } from "@react-keycloak/web";
import SearchItemArea from "../../../Models/SearchItemHistory";
import { log } from 'console';

type SearchMode = 'county' | 'city' | 'zip';

const stateIdToCode = {
  "01": "AL","02": "AK","04": "AZ","05": "AR","06": "CA",
  "08": "CO","09": "CT","10": "DE","11": "DC","12": "FL",
  "13": "GA","15": "HI","16": "ID","17": "IL","18": "IN",
  "19": "IA","20": "KS","21": "KY","22": "LA","23": "ME",
  "24": "MD","25": "MA","26": "MI","27": "MN","28": "MS",
  "29": "MO","30": "MT","31": "NE","32": "NV","33": "NH",
  "34": "NJ","35": "NM","36": "NY","37": "NC","38": "ND",
  "39": "OH","40": "OK","41": "OR","42": "PA","44": "RI",
  "45": "SC","46": "SD","47": "TN","48": "TX","49": "UT",
  "50": "VT","51": "VA","53": "WA","54": "WV","55": "WI",
  "56": "WY","72": "PR","60": "AS","66": "GU", "69": "MP", 
  "78": "VI"  
} as const;

const SearchByInputCounty: React.FC = () => {

  const dispatch = useAppDispatch();
  const selectedLocation = useSelector((state: RootState) => state.map.selectedLocation);

  const mode = useSelector((state: RootState) => state.areaAgent.mode);
  const query = useSelector((state: RootState) => state.areaAgent.query);
  const [filtered, setFiltered] = useState<any[]>([]);
  const selectedItem = useSelector((state: RootState) => state.areaAgent.selectedItem);
  const [loading, setLoading] = useState(false);

  const [countyIndex, setCountyIndex] = useState<any[]>([]);
  const [cityIndex, setCityIndex] = useState<any[]>([]);

  const [showSearchTypeDialog, setShowSearchTypeDialog] = useState(false);
  const geoAreaAgentProdReportClicked = useSelector((state: RootState) => state.map.geoAreaAgentProdReportClicked);
  const activityReportClicked = useSelector((state: RootState) => state.map.activityReportClicked);
  const { panelRef, togglePanel,collapsed ,setCollapsed } = useSearch();
  const { keycloak, initialized } = useKeycloak();
  const zipcodes = useSelector((state: RootState) => state.areaAgent.zipcodes);
  const mapLevel = useSelector((state: RootState) => state.areaAgent.mapLevel);
  // ================= LOAD DATA =================

  useEffect(() => {
    const load = async () => {
      const [statesRes, countiesRes] = await Promise.all([
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'),
        fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json')
      ]);

      const statesTopo = await statesRes.json();
      const countiesTopo = await countiesRes.json();

      const states = (feature(statesTopo, statesTopo.objects.states) as any).features;
      const counties = (feature(countiesTopo, countiesTopo.objects.counties) as any).features;

      const stateMap: Record<string, string> = {};
      states.forEach((s: any) => stateMap[s.id] = s.properties.name);

      const index = counties.map((c: any) => {
        const stateId = c.id.substring(0, 2);
        return {
          countyId: c.id,
          county: c.properties.name,
          state: stateMap[stateId],
          stateCode: stateIdToCode[stateId as keyof typeof stateIdToCode] || stateId,
          label: `${stateMap[stateId]}, ${c.properties.name}`
        };
      });

      setCountyIndex(index);
    };

    load();
  }, []);

  useEffect(() => {
    GeoAreaAgentProdService.getAllCities()
      .then((res: any) => setCityIndex(res.data));
  }, []);

  // ================= SEARCH =================

  const search = async (value: string) => {
    dispatch(setQuery(value));

    if (!value.trim()) {
      setFiltered([]);
      return;
    }

    const q = value.toLowerCase();

    // COUNTY
    if (mode === 'county') {
      setFiltered(
        countyIndex
          .filter(i => i.county.toLowerCase().includes(q))
          .slice(0, 10)
      );
    }

    // CITY
    if (mode === 'city') {
      setFiltered(
        cityIndex
          .filter((c: any) => c.city.toLowerCase().includes(q))
          .map((c: any) => ({
            ...c,
            label: `${c.state}, ${c.county}, ${c.city}`
          }))
          .slice(0, 10)
      );
    }

    // ZIP
    if (mode === 'zip') {
      setLoading(true);
      try {
        const res = await GeoAreaAgentProdService.searchZip(value);

        setFiltered(
          (res.data || []).map((z: any) => ({
            ...z,
            label: `${z.state}, ${z.county}, ${z.city}, ${z.zip}`
          })).slice(0, 10)
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // ================= SELECT =================

  const handleSelect = (item: any) => {

    if (mode === 'county') {
      const loc = {
        ...selectedLocation,
        state: item.state,
        stateCode: item.stateCode,
        county: item.county,
        city: [],
        zip: []
      };

      dispatch(setSelectedLocation(loc));
      // loadCities(item.countyId, item.county);
    }

    if (mode === 'city') {

      const loc = {
        ...selectedLocation,
        state: item.state,
        stateCode: item.stateCode,
        county: item.county,
        city: [item.city],
        zip: []
      };

      dispatch(setSelectedLocation(loc));
      // loadCities(item.countyFips, item.county);
      // dispatch(getZipCodesByCity({ selectedLocation: loc }));

      
    }

    if (mode === 'zip') {
        
      const loc = {
        ...selectedLocation,
        state: item.state,
        stateCode: item.stateCode,
        county: item.county,
        city: [item.city],
        zip: [item.zip]
      };

      dispatch(setSelectedLocation(loc));
      // loadCities(item.countyFips, item.county);
      // dispatch(getZipCodesByCity({ selectedLocation: loc }));
      // dispatch(setSelectedZipCode([item.zip]));

    }
  };

  // useEffect(() => {
  //   if(mode === 'zip'){
  //       if (!selectedLocation.zip?.length || !zipcodes.length) return;

  //       const selected = zipcodes.filter(z =>
  //           selectedLocation.zip.includes(z.zip)
  //       );

  //       dispatch(setSelectedZipCode(selected));
  //   }
  //   }, [zipcodes]);

  const handleModeChange = (newMode: SearchMode) => {
    dispatch(setMode(newMode));

    const resetLocation = {
      ...selectedLocation,
      state: '',
      stateCode: '',
      county: '',
      city: [],
      zip: []
    };


    dispatch(setSelectedLocation(resetLocation));
    // dispatch(setZipCodes([]));
    // dispatch(setSelectedZipCode([]));

    dispatch(setQuery(''));
    setFiltered([]);
    dispatch(setSelectedItem(null));
  };

  // ================= LOAD HELPERS =================

  const loadCities = (countyId: string, county: string) => {
    
    dispatch(setIsLoadingCities(true));

    console.log(countyId);
    

    GeoAreaAgentProdService.getCitiesByCountyFips(countyId)
      .then((res: any) => {
        dispatch(setCities(res.data));
        dispatch(setCopyCities(res.data));
      })
      .finally(() => dispatch(setIsLoadingCities(false)));

    dispatch(setMapLevel({ level: 'county', selectedState: selectedLocation.state, selectedCounty: county }));
  };

//   const loadZips = (loc: any) => {
//     GeoAreaAgentProdService.getZipsbyCityName(loc)
//       .then((res: any) => dispatch(setZipCodes(res.data)));
//   };

  // ================= NEXT =================

  const handleNext = () => {
    if (!selectedItem) {
      toast.warn('Please select from list');
      return;
    }

    // if (mode === 'zip') {
    //     setShowSearchTypeDialog(true);
    //     // return;
    // }

    handleSelect(selectedItem);
            setShowSearchTypeDialog(true);

  };

    const handleSearchByZip = async () => {
        if (selectedLocation.searchType === 'A'){

                dispatch(setAgentGeoProdResult([]));
                dispatch(setTotalAgent(0));
                dispatch(setTotalTransactionsAg(0));
                dispatch(setTotalListingsAgent(0));
                
            try {

                togglePanel();
                // await dispatch(getAgentGeoProduction({selectedLocation}));
                try {
                    await dispatch(getAgentGeoProduction({ selectedLocation })).unwrap();
                } catch (err: any) {
                    toast.error(err.message);
                }
                        dispatch(getTotalAgents({selectedLocation}));
                        dispatch(getTotalTransactionAgent({selectedLocation}));
                        dispatch(getTotalListingsAgent({selectedLocation}));
                        handleSearchListingsByZip();
                        //Save Search
                        // saveSearchHistory("area", selectedLocation.city.join(','), selectedLocation.zip.join(','),selectedLocation.stateCode, selectedLocation.county);
                        saveSearchHistory(
                          "area",
                          selectedLocation.city?.join(',') || '',
                          selectedLocation.zip?.join(',') || '',
                          selectedLocation.stateCode,
                          selectedLocation.county
                        );
                                                
            } catch (e) {
                console.error(e);
            } finally {
                    
                if(geoAreaAgentProdReportClicked){
                dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
                }
            }
            }
            
            if (selectedLocation.searchType === 'T') {
            try {
                togglePanel();

                await dispatch(getTeamGeoProduction(selectedLocation));

                saveSearchHistory("areaTeam", 
                    selectedLocation.city.join(','),
                    selectedLocation.zip.join(','),
                    selectedLocation.stateCode,
                    selectedLocation.county
                    );

            } catch (e) {
                console.error(e);
            }
        }

    };

    const handleSearchListingsByZip = async () => {
            dispatch(setListingsGeoProduction([]));
            dispatch(setTotalAgentForListing(0));
            dispatch(setTotalTransactionForListings(0));
            // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

            // if(!geoAreaAgentProdReportClicked){
            //   dispatch(setGeoAreaAgentProdReportClicked(true));
            // }

            
            try {
                // dispatch(setSelectedTabIndex(0));
                // togglePanel();

                // await dispatch(getListingsGeoProduction({selectedLocation}));
                try {
                    await dispatch(getListingsGeoProduction({ selectedLocation })).unwrap();
                    } catch (err: any) {
                    toast.error(err.message);
                    }
                // dispatch(setOriginalData(listingsGeoProduction));
                // dispatch(setDisplayedData(listingsGeoProduction));
                dispatch(getTotalAgentForListing({selectedLocation}));
                dispatch(getTotalTransactionForListings({selectedLocation}));

            } catch (e) {
                console.error(e);
            } finally {
                    
                if(activityReportClicked){
                dispatch(setActivityReportClicked(!activityReportClicked));
                }
            }
    };

    const handleSearch = async () => {
            
      if (selectedLocation.searchType === 'A'){
         console.log(selectedLocation);

            dispatch(setAgentGeoProdResult([]));
            dispatch(setTotalAgent(0));
            dispatch(setTotalTransactionsAg(0));
            dispatch(setTotalListingsAgent(0));
            // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));

            // if(!geoAreaAgentProdReportClicked){
            //   dispatch(setGeoAreaAgentProdReportClicked(true));
            // }

            
            try {
                dispatch(setSelectedTabIndex(0));
                togglePanel();
                // await dispatch(getAgentGeoProduction({selectedLocation}));
                try {
                      await dispatch(getAgentGeoProduction({ selectedLocation })).unwrap();
                    } catch (err: any) {
                      toast.error(err.message);
                    }
                dispatch(getTotalAgents({selectedLocation}));
                dispatch(getTotalTransactionAgent({selectedLocation}));
                dispatch(getTotalListingsAgent({selectedLocation}));
                handleSearchListings();
                //Save Search
                // saveSearchHistory("area", selectedLocation.city.join(','), selectedLocation.zip.join(','),selectedLocation.stateCode, selectedLocation.county);
                saveSearchHistory(
                  "area",
                  selectedLocation.city?.join(',') || '',
                  selectedLocation.zip?.join(',') || '',
                  selectedLocation.stateCode,
                  selectedLocation.county
                );

            } catch (e) {
                console.error(e);
            } finally {
                    
                if(geoAreaAgentProdReportClicked){
                dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
                }
            }

            console.log(selectedLocation);
            
       }

       if (selectedLocation.searchType === 'T') {
        try {
            togglePanel();

            await dispatch(getTeamGeoProduction(selectedLocation));

            // saveSearchHistory(
            //     "areaTeam",
            //     selectedLocation.city.join(','),
            //     selectedLocation.zip.join(','),
            //     selectedLocation.stateCode,
            //     selectedLocation.county
            // );
            saveSearchHistory(
              "areaTeam",
              selectedLocation.city?.join(',') || '',
              selectedLocation.zip?.join(',') || '',
              selectedLocation.stateCode,
              selectedLocation.county
            );
        } catch (e) {
            console.error(e);
        }
      }
    };

    const handleSearchListings = async () => {
          dispatch(setListingsGeoProduction([]));
          dispatch(setTotalAgentForListing(0));
          dispatch(setTotalTransactionForListings(0));
          // dispatch(setGeoAreaAgentProdReportClicked(!geoAreaAgentProdReportClicked));
    
          // if(!geoAreaAgentProdReportClicked){
          //   dispatch(setGeoAreaAgentProdReportClicked(true));
          // }
    
          
          try {
              // dispatch(setSelectedTabIndex(0));
              // togglePanel();
    
              // await dispatch(getListingsGeoProduction({selectedLocation}));
              try {
                await dispatch(getListingsGeoProduction({ selectedLocation })).unwrap();
              } catch (err: any) {
                toast.error(err.message);
              }
              // dispatch(setOriginalData(listingsGeoProduction));
              // dispatch(setDisplayedData(listingsGeoProduction));
              dispatch(getTotalAgentForListing({selectedLocation}));
              dispatch(getTotalTransactionForListings({selectedLocation}));
    
          } catch (e) {
              console.error(e);
          } finally {
                  
              if(activityReportClicked){
              dispatch(setActivityReportClicked(!activityReportClicked));
              }
          }
        };
        
  const handleSearchTypeChange = (val: 'A' | 'T') => {
    dispatch(setSelectedLocation({ ...selectedLocation, searchType: val }));
  };

  const handleConfirmZipSearch = async () => {
  if (!selectedLocation.searchType) {
    toast.warn('Please select Agents or Teams');
    return;
  }

  setShowSearchTypeDialog(false);

      if (mode === 'zip') {


        await handleSearchByZip();
      }
      if (mode === 'county' || mode ==='city') {
        await handleSearch();
      }
  };

  const saveSearchHistory = async (savedType: string, city: string, zips: string,state : string, county : string) => {
        if (keycloak.tokenParsed?.sub) {
            const userId = keycloak.tokenParsed.sub;
            let history = JSON.parse(localStorage.getItem(userId + '-'+savedType) || '[]');
            const newSearch = { savedType, city, zips,state,county, isFavorite: true };
            if (!history.some((item: SearchItemArea) => item.city === city && item.zips === zips && item.state === state && item.county === county)) {
                
                console.log(newSearch);
                console.log(history);
                if (history.length >= 10) {
                    //history = history.slice(1);
                    history.pop();

                }
                //history.push(newSearch);
                history.unshift(newSearch);

                localStorage.setItem(userId + '-'+savedType, JSON.stringify(history));
                if(savedType === 'area'){
                dispatch(setSearchHistory(history));
                }else if(savedType === 'areaTeam'){
                dispatch(setSearchHistoryTeam(history));
                }


                try {
                    await GeoAreaAgentProdService.saveSearchHistory(userId, savedType, city, zips,state,county);
                } catch (error) {
                    console.error('Error saving search history:', error);
                }
            }
        }
    };

    const handleClear = () => {
      dispatch(setMapLevel({level: 'country', selectedState: "", selectedCounty: ""}));
      dispatch(setQuery(''));
      dispatch(setSelectedItem(null));

      setFiltered([]);

      dispatch(setSelectedLocation({
        ...selectedLocation,
        state: '',
        stateCode: '',
        county: '',
        city: [],
        zip: []
      }));

      dispatch(setZipCodes([]));
      dispatch(setSelectedZipCode([]));
    };
  return (
    <div className="flex flex-column gap-2">

      {/* MODE */}
      <div className="flex gap-3">
        <label><input type="radio" checked={mode==='county'} onChange={()=>handleModeChange('county')} /> County</label>
        <label><input type="radio" checked={mode==='city'} onChange={()=>handleModeChange('city')} /> City</label>
        <label><input type="radio" checked={mode==='zip'} onChange={()=>handleModeChange('zip')} /> Zip</label>
      </div>

      {/* SEARCH */}
      <div className="flex align-items-center gap-2">
        <AutoComplete
          value={query}
          suggestions={filtered}
          completeMethod={(e) => search(e.query)}
          field="label"
          placeholder={
            mode === 'county' ? 'Search by county' :
            mode === 'city' ? 'Search by city' :
            'Search by zip'
          }
          panelFooterTemplate={
            loading ? <div className="p-2 text-center"><BeatLoader size={10} /></div> : null
          }
          onChange={(e) => {
            dispatch(setQuery(e.value));
            dispatch(setSelectedItem(null));
          }}
          onSelect={(e) => {
            dispatch(setSelectedItem(e.value));
            dispatch(setQuery(e.value.label));
          }}
        />

        {/* <Button
          label="Next"
          icon={loading ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
          disabled={loading}
          className="p-button-sm"
          onClick={handleNext}
        /> */}
        {/* <Button
            type="button"
            outlined
            severity="info"
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
            disabled={loading}
            label="Next"
            className="modern-history-btn p-button-sm"                
            style={{ height: '34px', padding: '0 12px' }}
            onClick={handleNext}
        /> */}
        <div className="flex align-items-center gap-2">
    <Button
        type="button"
        outlined
        severity="warning"
        icon="pi pi-times"
        label="Clear"
        className="modern-history-btn p-button-sm"
        style={{ height: '34px', padding: '0 12px' }}
        onClick={handleClear}
    />

    <Button
        type="button"
        outlined
        severity="info"
        icon={loading ? "pi pi-spin pi-spinner" : "pi pi-arrow-right"}
        disabled={loading}
        label="Next"
        className="modern-history-btn p-button-sm"
        style={{ height: '34px', padding: '0 12px' }}
        onClick={handleNext}
    />
</div>
      </div>

      <Dialog
        header="Select Search Type"
        visible={showSearchTypeDialog}
        style={{ width: '320px' }}
        onHide={() => setShowSearchTypeDialog(false)}
        >
            <div className="flex flex-column gap-3">

                {/* Radios */}
                <div className="flex align-items-center gap-2">
                <RadioButton
                    inputId="zip-agents"
                    name="searchTypeZip"
                    value="A"
                    onChange={() => handleSearchTypeChange('A')}
                    checked={(selectedLocation.searchType ?? 'A') === 'A'}
                />
                <label htmlFor="zip-agents">Agents</label>
                </div>

                <div className="flex align-items-center gap-2">
                <RadioButton
                    inputId="zip-teams"
                    name="searchTypeZip"
                    value="T"
                    onChange={() => handleSearchTypeChange('T')}
                    checked={(selectedLocation.searchType ?? 'A') === 'T'}
                />
                <label htmlFor="zip-teams">Teams</label>
                </div>

                {/* Button */}
                <div className="flex justify-content-end mt-2">
                
               
                <Button
                    type="button"
                    outlined
                    severity="info"
                    icon="pi pi-search"
                    label="Search"
                    className="modern-history-btn"
                    onClick={handleConfirmZipSearch}
                />
                </div>

            </div>
        </Dialog>

    </div>
  );
};

export default SearchByInputCounty;