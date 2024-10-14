import React from 'react';
import { BeatLoader } from 'react-spinners'; // Assuming you're using this loader
import { Checkbox,CheckboxChangeEvent } from 'primereact/checkbox'; // Or whatever checkbox component you use

interface SearchHistoryProps {
  title: string;
//   subtitle: string;
  isLoading: boolean;
  searchHistory: any[];
  onSearchClick: (search: any) => void;
  onToggleFavorite: (search: any, event: CheckboxChangeEvent) => void;
  parent: string;

}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  title,
//   subtitle,
  isLoading,
  searchHistory,
  onSearchClick,
  onToggleFavorite,
  parent
}) => {
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
                    {parent === 'Area' && (
                        "City: " + search.city.split(',')[0]+" | zip [" + search.zips + "] | Mo [" + search.nbrMonth + "]"
                    )}
                    {parent === 'Agent' && (
                        `${search.firstName} ${search.lastName}`
                    )}
                    {parent === 'Office' && (
                        search.officeName
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
