import React, { createContext, useState, useContext,ReactNode,useRef } from 'react';
import SearchItemOffice from "../../Models/SearchItemOffice";
import AgentOfficeData from "../../Models/AgentOfficeData";
import OfficeService from "../../Services/OfficeService";
import { Panel } from 'primereact/panel';




// Define the type of the context
type ContextType = {
  handleSearchAction: (search: SearchItemOffice) => void;
  isLoadingSearchOffice: boolean;
  dataAgent: any[];
  setDataAgent : React.Dispatch<React.SetStateAction<AgentOfficeData[]>>;
  setIsLoadingSearchOffice : React.Dispatch<React.SetStateAction<boolean>>;
  panelRef: React.RefObject<Panel>;
  togglePanel: () => void;
  collapsed : boolean;
  setCollapsed : React.Dispatch<React.SetStateAction<boolean>>;


  

};

// Create the context with a default value (could be null or a default implementation)
const SearchContext = createContext<ContextType | undefined>(undefined);

interface ctxProviderProps {
    children: ReactNode;
  }
// Create a provider component
export const SearchProvider: React.FC<ctxProviderProps>  = ({ children }) => {
    const [isLoadingSearchOffice, setIsLoadingSearchOffice] = useState(Boolean);
    const [dataAgent, setDataAgent] = useState<Array<AgentOfficeData>>([]);
    const panelRef = useRef<Panel>(null);
    const [collapsed, setCollapsed] = useState(Boolean);




  const handleSearchAction = (search: SearchItemOffice) => {
    setIsLoadingSearchOffice(true);
    const data = {
      id: search.officeId,
    };
    OfficeService.getAgentsByOffice(data)
      .then((response: any) => {
        if (response.data) {
          setDataAgent(response.data);
          setIsLoadingSearchOffice(false);
        }
      })
      .catch((e: Error) => {
        setIsLoadingSearchOffice(false);
        console.log(e);
      });
  };
  const togglePanel = () => {
    panelRef.current?.toggle(undefined);
    setCollapsed(!collapsed); // Call toggle with undefined
  };

  return (
    <SearchContext.Provider value={{ handleSearchAction, isLoadingSearchOffice, dataAgent,setDataAgent,setIsLoadingSearchOffice ,panelRef, togglePanel,collapsed,setCollapsed}}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for using the context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
