import React, { useState, useRef, useEffect, useMemo } from "react";
import { BeatLoader } from "react-spinners";
import SearchItemAgent from "../Models/SearchItemAgent";
import SearchItemOffice from "../Models/SearchItemOffice";
import SearchItemArea from "../Models/SearchItemArea";
import SearchItemHistory from "../Models/SearchItemHistory";

interface SavedSearchMenuProps {
  agents: SearchItemAgent[];
  offices: SearchItemOffice[];
  areas: SearchItemArea[];
  areasTeam: SearchItemArea[];
  loanOfficers: SearchItemHistory[];
  team: SearchItemHistory[];
  loading: boolean;
  onFetchFavorites: () => Promise<void>;
  onSelectAgent?: (id: string) => void;
  onSelectOffice?: (id: string) => void;
  onSelectArea?: (area: any) => void;
  onSelectLoanOfficer?: (id: string) => void;
  onSelectTeam?: (teamName: string) => void;

}

function useSidebarExpanded(){
  const [expanded, setExpanded] = useState(!document.body.classList.contains("sidebar-collapse"));
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setExpanded(!document.body.classList.contains("sidebar-collapse"));
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return expanded;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    handler(mq);
    mq.addEventListener
      ? mq.addEventListener("change", handler)
      : mq.addListener(handler as any);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", handler)
        : mq.removeListener(handler as any);
    };
  }, [breakpoint]);
  return isMobile;
}

const SavedSearchMenuBootstrap: React.FC<SavedSearchMenuProps> = ({
  agents,
  offices,
  areas,
  areasTeam,
  loanOfficers,
  team,
  loading,
  onFetchFavorites,
  onSelectAgent,
  onSelectOffice,
  onSelectArea,
  onSelectLoanOfficer,
  onSelectTeam,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const expanded = useSidebarExpanded();


  // Close when click out side
  useEffect(() => {
    setQ("");
    if (!open || isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, isMobile]);

  // Lock scroll in mobile
  useEffect(() => {
    if (isMobile && open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMobile, open]);

  const handleMenuToggle = async () => {
    setOpen(true);
    await onFetchFavorites();
  };

  // Filter favorites
  const filterText = q.trim().toLowerCase();
  const fAgents = useMemo(
    () =>
      !filterText
        ? agents
        : agents.filter((a) =>
            [a.firstName, a.fullName, a.State].filter(Boolean).join(" ").toLowerCase().includes(filterText)
          ),
    [agents, filterText]
  );
  const fOffices = useMemo(
    () =>
      !filterText
        ? offices
        : offices.filter((o) =>
            [o.officeName, o.state].filter(Boolean).join(" ").toLowerCase().includes(filterText)
          ),
    [offices, filterText]
  );
  const fAreas = useMemo(
    () =>
      !filterText
        ? areas
        : areas.filter((ar) =>
            [`${ar.state}`, `${ar.county || ""}`, `${ar.city || ""}`, `${ar.zips || ""}`]
              .join(" ")
              .toLowerCase()
              .includes(filterText)
          ),
    [areas, filterText]
  );
  const fAreasTeam = useMemo(
    () =>
      !filterText
        ? areasTeam
        : areasTeam.filter((ar) =>
            [`${ar.state}`, `${ar.county || ""}`, `${ar.city || ""}`, `${ar.zips || ""}`]
              .join(" ")
              .toLowerCase()
              .includes(filterText)
          ),
    [areasTeam, filterText]
  );
  const fLoans = useMemo(
    () =>
      !filterText
        ? loanOfficers
        : loanOfficers.filter((l) => (l.officerName || "").toLowerCase().includes(filterText)),
    [loanOfficers, filterText]
  );
  const fTeam = useMemo(
    () =>
      !filterText
        ? team
        : team.filter((l) => (l.teamName || "").toLowerCase().includes(filterText)),
    [team, filterText]
  );

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
  const renderList = () => (
    <>
      {/*Search bar (mobile & desktop) */}
      <div className="mb-2">
        <div className="input-group">
          <span className="input-group-text"><i className="bi bi-search" /></span>
          <input
            className="form-control"
            placeholder="Search for a favorite…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center my-3">
          <BeatLoader size={12} color="#36d7b7" />
        </div>
      ) : (
        <>
          {fAgents.length > 0 && (
            <>
              <div className="small text-muted mb-1 mt-2">Agents</div>
              {fAgents.map((search, i) => (
                <button
                  key={`ag-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectAgent?.(search.agentIdC);
                  }}
                >
                  {search.firstName} {search.fullName}
                  {search.State ? ` | ${search.State}` : ""}
                </button>
              ))}
            </>
          )}

          {fOffices.length > 0 && (
            <>
              <div className="small text-muted mb-1 mt-2">Offices</div>
              {fOffices.map((search, i) => (
                <button
                  key={`of-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectOffice?.(search.officeId);
                  }}
                >
                  {search.officeName}
                  {search.state ? ` | ${search.state}` : ""}
                </button>
              ))}
            </>
          )}

          {fAreas.length > 0 && (
            <>
              <div className="small text-muted mb-1 mt-2">Areas</div>
              {fAreas.map((search, i) => (
                <button
                  key={`ar-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectArea?.({
                     state: "",
                      stateCode: search.state,
                      county: search.county,
                      city: search.city
                      ? search.city
                          .split(',')
                          .map((c: any) => c.trim())
                          .filter(Boolean)
                      : [],
                      agentId: 0,
                      zip: search.zips
                      ? search.zips
                          .split(',')
                          .map((c: any) => c.trim())
                          .filter(Boolean)
                      : [],
                      searchType: 'A'
                    });
                  }}
                >
                  {/* State: {search.state} | City: {search.city}
                  {search.zips ? ` | Zip [${search.zips}]` : ""} */}
                  {/* State: {search.state}{search.city ? ` | City [${search.city}]` : ""}
                  {search.county ? ` | County [${search.county}]` : ""}
                  {search.zips ? ` | Zip [${search.zips}]` : ""} */}
                  {formatAreaHistory(search)}
                </button>
              ))}
              <div className="small text-muted mb-1 mt-2">Teams</div>
              {fAreasTeam.map((search, i) => (
                <button
                  key={`ar-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectArea?.({
                      state: "",
                      stateCode: search.state,
                      county: search.county,
                      city: search.city
                      ? search.city
                          .split(',')
                          .map((c: any) => c.trim())
                          .filter(Boolean)
                      : [],
                      agentId: 0,
                      zip: search.zips
                      ? search.zips
                          .split(',')
                          .map((c: any) => c.trim())
                          .filter(Boolean)
                      : [],
                      searchType: 'T'
                    });
                  }}
                >
                  {/* State: {search.state}{search.city ? ` | City [${search.city}]` : ""}
                  {search.county ? ` | County [${search.county}]` : ""}
                  {search.zips ? ` | Zip [${search.zips}]` : ""} */}
                  {formatAreaHistory(search)}
                </button>
              ))}
            </>
          )}

          {fLoans.length > 0 && (
            <>
              <div className="small text-muted mb-1 mt-2">Loan Officers</div>
              {fLoans.map((search, i) => (
                <button
                  key={`lo-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectLoanOfficer?.(search.officerId);
                  }}
                >
                  {search.officerName}
                </button>
              ))}
            </>
          )}
          {fTeam.length > 0 && (
            <>
              <div className="small text-muted mb-1 mt-2">Team</div>
              {fTeam.map((search, i) => (
                <button
                  key={`lo-${i}`}
                  className="dropdown-item py-2 mobile-item"
                  style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", fontSize: 15 }}
                  onClick={() => {
                    setOpen(false);
                    onSelectTeam?.(search.teamId);
                  }}
                >
                  {search.teamName}
                </button>
              ))}
            </>
          )}

          {fAgents.length + fOffices.length + fAreas.length + fLoans.length + fTeam.length === 0 && (
            <div className="text-center text-muted py-3">No favorites saved</div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn btn-outline-dark d-flex align-items-center"
        style={{ borderRadius: 20, minWidth: 140, fontWeight: "bold", padding: "6px 16px" }}
        onClick={handleMenuToggle}
        type="button"
      >
        <i className="bi bi-check-square-fill mr-2"></i>
        <span>{expanded?'Saved':'Saved Searches'}</span>
        <span className="ml-2">
          <i className={`fas fa-caret-${open ? "up" : "down"}`}></i>
        </span>
      </button>

      {/* Desktop: Classic dropdown */}
      {!isMobile && open && (
        <div
          className="dropdown-menu show shadow border rounded"
          style={{ minWidth: 320, right: 0, left: "auto", top: "115%", zIndex: 1051, padding: 16, position: "absolute" }}
        >
          <h6 className="mb-2 font-weight-bold">Favorites</h6>
          {renderList()}
        </div>
      )}

      {/* Mobile: bottom-sheet full screen */}
      {isMobile && (
        <>
          <div className={`favorites-backdrop ${open ? "show" : ""}`} onClick={() => setOpen(false)} />
          <section className={`favorites-sheet ${open ? "show" : ""}`} role="dialog" aria-modal="true" aria-label="Favorites">
            <header className="sheet-header">
              <h6 className="m-0 font-weight-bold">Favorites</h6>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}>
                <i className="bi bi-x-lg mr-1" /> Close
              </button>
            </header>
            <div className="sheet-body">
              {renderList()}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default SavedSearchMenuBootstrap;
