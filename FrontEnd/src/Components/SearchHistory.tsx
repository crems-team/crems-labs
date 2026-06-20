import React from 'react';
import { BeatLoader } from 'react-spinners'; 
import { Checkbox,CheckboxChangeEvent } from 'primereact/checkbox'; 

interface SearchHistoryProps {
  title: string;
//   subtitle: string;
  isLoading: boolean;
  searchHistory: any[];
  onSearchClick: (search: any) => void;
  onToggleFavorite: (search: any, event: CheckboxChangeEvent) => void;
  onDeteteNonFavorite: () => void;
  parent: string;

}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  title,
//   subtitle,
  isLoading,
  searchHistory,
  onSearchClick,
  onToggleFavorite,
  onDeteteNonFavorite,
  parent
}) => {

  const formatAreaHistory = (search: any) => {
    const cities = search.city
        ? search.city.split(',').filter(Boolean)
        : [];

    const zips = search.zips
        ? search.zips.split(',').filter(Boolean)
        : [];

    let text = `State: ${search.state}`;

    if (search.county) {
        text += ` | County [${search.county}]`;
    }

    if (cities.length > 0) {
        const displayedCities = cities.slice(0, 2).join(', ');
        const remainingCities = cities.length - 2;

        text += ` | City [${displayedCities}`;

        if (remainingCities > 0) {
            text += `, ${remainingCities} Cities Selected`;
        }

        text += ']';
    }

    if (zips.length > 0) {
        const displayedZips = zips.slice(0, 2).join(', ');
        const remainingZips = zips.length - 2;

        text += ` | Zip [${displayedZips}`;

        if (remainingZips > 0) {
            text += `, ${remainingZips} Zip Codes Selected`;
        }

        text += ']';
    }

    return text;
  };

  return (
      <div className="card">
        <div className="card-header bg-primary text-white">
          <span className="page-title">{title}</span>
          <span className="subtitle" style={{ fontSize: '12px' }}>
          Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                              </svg> icon to save. Click the <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square-fill" viewBox="0 0 16 16">
                                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"></path>
                              </svg> icon to unsave.
          </span>
          <button
            className="btn btn-sm btn-light text-primary mt-1"
            onClick={onDeteteNonFavorite}
            title="Clear Non-Favorite"
            style={{ display: 'flex', alignItems: 'center' }}
          >
    <i className="bi bi-x-circle mr-1"></i> Clear Non-Favorite
  </button>
        </div>
        <div className="card-body cardRecentSearch">
          {isLoading ? (
            <div>
              <ul style={{ listStyleType: 'none' }}>
                <li>
                  <BeatLoader className="loading-container mt-3" size={20} color="#36d7b7" />
                </li>
              </ul>
            </div>
          ) : searchHistory.length > 0 ? (
            <ul className="list-group">
              {searchHistory.map((search, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span role="button" onClick={() => onSearchClick(search)}>
                    {/* {search.officeName || `${search?.firstName} ${search?.lastName}` || `City: ${search.city.split(',')[0]} | zip [${search.zips}] | Mo [${search.nbrMonth}]`} */}
                    {/* {parent === 'Area' && (
                        `State: ${search.state}`
                        + (search.city ? ` | City [${search.city}]` : '')
                        + (search.county ? ` | County [${search.county}]` : '')
                        + (search.zips ? ` | Zip [${search.zips}]` : '')
                    )} */}
                    {parent === 'Area' && formatAreaHistory(search)}
                    {parent === 'Agent' && (
                        `${search.fullName}${search.state ? " | State: " + search.state : ""}`
                    )}
                    {parent === 'Office' && (
                        `${search.officeName}${search.state ? " | State: " + search.state : ""}`
                    )}
                    {parent === 'SearchSource' && (
                        `${search.agentId ? "AgentId: " + search.agentId : ""}${search.officeName ? " | Office: " + search.officeName : ""}${search.address ? " | Address: " + search.address : ""}${search.city ? " | City: " + search.city : ""}`
                    )}
                    {parent === 'LoanOfficer' && (
                        `${search.officerName}`
                    )}
                    {parent === 'Team' && (
                        `${search.teamName}`
                    )}
                    
                  </span>
                  <Checkbox onChange={(event) => onToggleFavorite(search, event)} checked={!search.isFavorite} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">No recent searches.</li>
            </ul>
          )}
        </div>
      </div>
  );
};

export default SearchHistory;
