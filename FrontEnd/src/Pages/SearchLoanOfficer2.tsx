import React, { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";
import LoanOfficerService from "../Services/LoanOfficerService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useKeycloak } from "@react-keycloak/web";
import { toast } from "react-toastify";
import { CheckboxChangeEvent } from "primereact/checkbox";
import SearchHistory from "../Components/SearchHistory";
import { useAppDispatch } from "../Hooks/DispatchHook";
import { resetMapState } from "../Redux/Slices/MapSlice";
import SearchItemHistory from "../Models/SearchItemHistory";
import { Sidebar } from "primereact/sidebar";
import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteSelectEvent } from "primereact/autocomplete";

interface AutocompleteItem {
  value: number;
  label: string;
}

function SearchLoanOfficer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { keycloak } = useKeycloak();

  // UI state
  const [visibleRight, setVisibleRight] = useState(false);

  // Search state
  const [name, setName] = useState<string>("");
  const [officerId, setOfficerId] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AutocompleteItem[]>([]);
  const [isLoadingSuggest, setIsLoadingSuggest] = useState(false);
  const [isSuggestionClicked, setIsSuggestionClicked] = useState(false);

  // Results
  const [dataAgent, setDataAgent] = useState<any[]>([]);
  const [isLoadingSearchAgent, setIsLoadingSearchAgent] = useState(false);

  // History
  const [searchHistory, setSearchHistory] = useState<Array<SearchItemHistory>>([]);
  const [isLoadingSavedSearch, setIsLoadingSavedSearch] = useState(false);

  // ------- Suggestions (AutoComplete) ----------
  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length < 1 || isSuggestionClicked) {
      setSuggestions([]);
      return;
    }
    try {
      setIsLoadingSuggest(true);
      const resp = await LoanOfficerService.getNameLoanOfficer({ term: query });
      setSuggestions(resp.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSuggest(false);
    }
  };

  // antirebond pour la complétion
  const debouncedFetch = useMemo(
    () =>
      debounce((q: string) => {
        fetchSuggestions(q);
      }, 350),
    [] // eslint-disable-line
  );

  const onAutoComplete = (e: { query: string }) => {
    setIsSuggestionClicked(false);
    debouncedFetch(e.query);
  };

  const onChange = (e: AutoCompleteChangeEvent) => {
    setName(e.value ?? "");
    if (!e.value) {
      setOfficerId("");
      setSuggestions([]);
    }
  };

  const onSelect = (e: AutoCompleteSelectEvent) => {
    const item = e.value as AutocompleteItem;
    setName(item.label);
    setOfficerId(String(item.value));
    setIsSuggestionClicked(true);
  };

  // ------- Search -------
  const handleSearch = async (searchName: string) => {
    if (!searchName?.trim()) return;
    try {
      setIsLoadingSearchAgent(true);
      const { data } = await LoanOfficerService.getAgentByName({ name: searchName });
      setDataAgent(data || []);
      await saveSearchHistory("loanOfficer", officerId, searchName);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSearchAgent(false);
    }
  };

  const handleClear = () => {
    setDataAgent([]);
    setName("");
    setOfficerId("");
    setSuggestions([]);
    setIsSuggestionClicked(false);
  };

  // ------- History logic -------
  const fetchSavedSearches = async () => {
    if (!keycloak.tokenParsed?.sub) return;
    setIsLoadingSavedSearch(true);
    const userId = keycloak.tokenParsed.sub;
    try {
      const resp = await LoanOfficerService.getSavedSearches(userId, "loanOfficer");
      setSearchHistory(resp.data  );
      localStorage.setItem(userId + "-loanOfficer", JSON.stringify(resp.data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSavedSearch(false);
    }
  };

  const saveSearchHistory = async (savedType: string, officerId: string, officerName: string) => {
    if (!keycloak.tokenParsed?.sub) return;
    const userId = keycloak.tokenParsed.sub;

    let history: SearchItemHistory[] = JSON.parse(localStorage.getItem(userId + "-loanOfficer") || "[]");
    const newSearch = { savedType, officerId, officerName, isFavorite: true } as any;

    if (!history.some((i) => i.officerId === officerId && i.officerName === officerName)) {
      if (history.length >= 10) history.pop();
      history.unshift(newSearch);
      localStorage.setItem(userId + "-loanOfficer", JSON.stringify(history));
      setSearchHistory(history);
      try {
        await LoanOfficerService.saveSearchHistory(userId, savedType, officerId, officerName);
        await fetchSavedSearches();
      } catch (e) {
        console.error("Error saving search history:", e);
      }
    }
  };

  const toggleFavorite = async (search: SearchItemHistory, event: CheckboxChangeEvent) => {
    event.preventDefault();
    if (!keycloak.tokenParsed?.sub) return;
    const userId = keycloak.tokenParsed.sub;

    try {
      await LoanOfficerService.toggleFavorite(userId, search.idHistory, !search.isFavorite);
      setSearchHistory((prev) =>
        prev.map((it) => (it.idHistory === search.idHistory ? { ...it, isFavorite: !it.isFavorite } : it))
      );
      localStorage.setItem(userId + "-loanOfficer", JSON.stringify(searchHistory));
      toast.success(
        !search.isFavorite
          ? `${search.officerName} is saved in your favorite list`
          : `${search.officerName} is deleted from your favorite list`
      );
    } catch (e) {
      console.error("Error toggling favorite:", e);
    }
  };

  const deteteNonFavorite = async () => {
    if (!keycloak.tokenParsed?.sub) return;
    const userId = keycloak.tokenParsed.sub;
    try {
      await LoanOfficerService.deteteNonFavorite(userId, "loanOfficer");
      fetchSavedSearches();
    } catch (e) {
      console.error("Error detele non favorite:", e);
    }
  };

  // ------- Init -------
  useEffect(() => {
    if (keycloak.tokenParsed?.sub) {
      dispatch(resetMapState());
      fetchSavedSearches();
    }
  }, [keycloak.tokenParsed?.sub]); // eslint-disable-line

  // ------- Helpers -------
  const buttonDataTable = (row: any) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button
        label="LO Report"
        icon="bi bi-bar-chart-line-fill"
        className="btn btn-success"
        onClick={() => navigate(`/loanOfficerProdReport/${row.officerNmlsId}`)}
      />
    </div>
  );

  return (
    <div className="container mt-3 modern-page">
      <main>
        <div className="row align-items-start g-3">
          <div className="col-md-8">
            <label className="form-label fw-semibold mb-2">Loan Officer Name</label>

            <div className="d-flex gap-3 align-items-start">
              {/* Input avec caret et coins arrondis */}
              <div className="flex-grow-1">
                <AutoComplete
                  value={name}
                  suggestions={suggestions}
                  completeMethod={onAutoComplete}
                  onChange={onChange}
                  onSelect={onSelect}
                  dropdown
                  forceSelection={false}
                  field="label"
                  placeholder="Type the first few letters of the agent's last name..."
                  className="w-100 p-inputtext-lg modern-autocomplete"
                />
                {/* mini aide */}
                <div className="form-text mt-2">
                  Type the first few letters of the agent’s last name, then select the correct choice from the drop-down
                  list.
                </div>
              </div>

              {/* Bouton Search History en pill */}
              <Button
                type="button"
                outlined
                severity="info"
                icon="pi pi-history"
                label="Search History"
                className="modern-history-btn"
                onClick={() => setVisibleRight(true)}
              />
            </div>

            {/* Actions Search / Clear */}
            <div className="d-flex gap-3 mt-3">
              <Button
                type="button"
                label="Search"
                icon="pi pi-search"
                onClick={() => handleSearch(name)}
                className="modern-action "
              />
              <Button
                type="button"
                label="Clear"
                icon="pi pi-times"
                severity="warning"
                outlined
                onClick={handleClear}
                className="modern-action"
              />
            </div>

            {/* Résultats */}
            <div className="card mt-3">
              {isLoadingSearchAgent ? (
                <div className="py-4 d-flex justify-content-center">
                  <BeatLoader size={12} />
                </div>
              ) : (
                dataAgent.length > 0 && (
                  <DataTable value={dataAgent} paginator rows={5}>
                    <Column body={buttonDataTable} />
                    <Column field="officerNmlsId" header="officer Nmls Id" />
                    <Column field="officerName" header="officer Name" />
                    <Column field="officeName" header="Office Name" />
                  </DataTable>
                )
              )}
            </div>
          </div>

          {/* Sidebar history */}
          <div className="col-md-4"></div>
        </div>
      </main>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
        style={{ width: "50rem" }}
      >
        <div className="col-12 mx-auto">
          <SearchHistory
            title="LO Search History"
            isLoading={isLoadingSavedSearch}
            searchHistory={searchHistory}
            onSearchClick={(s: any) => {
              setVisibleRight(false);
              navigate(`/loanOfficerProdReport/${s.officerId}`);
            }}
            onToggleFavorite={toggleFavorite}
            onDeteteNonFavorite={deteteNonFavorite}
            parent="LoanOfficer"
          />
        </div>
      </Sidebar>
    </div>
  );
}

export default SearchLoanOfficer;
