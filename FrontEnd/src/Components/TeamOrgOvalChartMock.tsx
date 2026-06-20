import React, { useLayoutEffect, useRef, useState, useEffect, useMemo } from "react";
import { OrgChart } from "d3-org-chart";
import { Dialog } from "primereact/dialog";
import demo from "../Mock/orgchart.demo.json";
import { BeatLoader } from "react-spinners";
import TeamService from "../Services/TeamService";
import type { OrgNode, OrgNodeType } from "../types/org.types";
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
import { useAppDispatch } from '../Hooks/DispatchHook';
import {getOrgNodesByTeamKey} from '../Redux/Slices/TeamInvestigationSlice'



type Props = {
  teamKey: string;
};



type DemoStore = Record<string, OrgNode[]>;
const demoStore = demo as DemoStore;

// ---------- Grouping config ----------
const GROUP_THRESHOLD = 6; // >= 6 persons under same (parentId + roleTitle) => create GROUP
const GROUP_ROLES = new Set<string>([
  "Both Sides",
  "OSA",
  "Selling Side",
  "Listing Side",
  "Sales Manager",
]);

export default function TeamOrgOvalChart({ teamKey }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);

  // const [data, setData] = useState<OrgNode[]>([]);
  const data = useSelector((state: RootState) => state.TeamInvestigation.data);
  const [fullScreenActivated, setFullScreenActivated] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoading = useSelector((state: RootState) => state.TeamInvestigation.isLoading);

  const dispatch = useAppDispatch();
  // expand/collapse groups
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  async function fetchOrgNodesMock(teamKey: string): Promise<OrgNode[]> {
    const nodes = demoStore[teamKey] ?? [];
    return nodes
      .map((n) => ({
        ...n,
        sortOrder: typeof n.sortOrder === "string" ? Number(n.sortOrder) : n.sortOrder,
      }))
      .sort((a, b) => toNumberSort(a.sortOrder) - toNumberSort(b.sortOrder));
  }

  useEffect(() => {
    let cancelled = false;

    // (async () => {
    //   if (!teamKey) {
    //     const fallback = await fetchOrgNodesMock("demo");
    //     if (!cancelled) setData(fallback);
    //     if (!cancelled) setIsLoading(false);
    //     return;
    //   }

    //   const nodes = await fetchOrgNodesMock(teamKey);
    //   if (!cancelled) {
    //     if (nodes.length > 1) setData(nodes);
    //     else setData(await fetchOrgNodesMock("demo"));
    //     setIsLoading(false);
    //   }
    // })();

      // TeamService.getOrgNodesByTeamKey({name :teamKey})
      // .then((response: any) => {
      //   setData(response.data);
      //   setIsLoading(false);

      // })
      // .catch((e: Error) => {
      //   setIsLoading(false);
      //   console.log(e);
      
      // })
      // .finally(() => {      
      //     setIsLoading(false);
      // });
      dispatch(getOrgNodesByTeamKey({ teamKey}));

    return () => {
      cancelled = true;
    };
  }, [teamKey]);

  // build grouped data from SQL result
  const groupedData = useMemo(() => buildGroupedData(data), [data]);


  useLayoutEffect(() => {
    if (!hostRef.current) return;
    if (!groupedData.length) return;

    if (!chartRef.current) chartRef.current = new OrgChart();
    const chart = chartRef.current;

    chart
      .container(hostRef.current)
      .data(groupedData)
      .nodeWidth(() => 390)
      .nodeHeight(() => 92)
      .childrenMargin(() => 120)
      .compact(false)
      .nodeContent((d: any) => {
        const n = d.data as OrgNode;
        const bg = normalizeColor(n.color) || "#1f8b8b";

        // GROUP node
        if (n.nodeType === "GROUP") {
          const count = n.groupCount ?? 0;
          const groupKey = n.groupKey ?? "";
          const isExpanded = expandedGroups.has(groupKey);

          const top = n.roleTitle ?? "";
          const bottom = `${count} members`;

          const initials = getInitials(top);
          const avatarHtml = `<div class="oval-avatar-fallback">${escapeHtml(initials)}</div>`;

          return `
            <div class="oval-node" data-node-id="${escapeHtml(n.id)}" data-node-type="GROUP" data-group-key="${escapeHtml(groupKey)}" style="background:${bg}">
              <div class="oval-avatar">${avatarHtml}</div>
              <div class="oval-left">
                <div class="oval-top">${escapeHtml(top)}</div>
                <div class="oval-bottom">${escapeHtml(bottom)}</div>

              </div>
              
            </div>
          `;
        }

        // PERSON / VACANT
        const isVacant = n.nodeType === "VACANT";
        const top = isVacant ? (n.roleTitle ?? "") : (n.fullName ?? "");
        const bottom = isVacant ? "" : (n.roleTitle ?? "");

        const initials = getInitials(top);
        const base = process.env.PUBLIC_URL || "";
        const avatar = n.avatarUrl ? `${base}${n.avatarUrl}` : "";

        const avatarHtml = avatar
          ? `<img class="oval-avatar-img" src="${avatar}" alt="" />`
          : `<div class="oval-avatar-fallback">${escapeHtml(initials)}</div>`;

        return `
          <div class="oval-node" data-node-id="${escapeHtml(n.id)}" data-node-type="${n.nodeType}" style="background:${bg}">
            <div class="oval-avatar">${avatarHtml}</div>
            <div class="oval-left">
              <div class="oval-top">${escapeHtml(top)}</div>
              <div class="oval-bottom">${escapeHtml(bottom)}</div>
            </div>
          </div>
        `;
      })
      .render();

      try {
          chart.expandAll();    
          // chart.fit();          
          } 
      catch {}

    setTimeout(() => {
      const svg = hostRef.current?.querySelector("svg");
      if (!svg) return;

      const linkPaths = Array.from(svg.querySelectorAll<SVGPathElement>("path")).filter((p) => {
        const fill = (p.getAttribute("fill") || "").toLowerCase();
        return fill === "none" || fill === "";
      });

      linkPaths.forEach((p) => {
        p.style.stroke = "#9aa0a6";
        p.style.strokeWidth = "3";
        p.style.opacity = "0.95";
        p.style.fill = "none";
        p.style.strokeLinecap = "round";
        p.style.strokeLinejoin = "round";
      });

      try {
        chart.fit();
      } catch {}
    }, 0);

    const ro = new ResizeObserver(() => {
      try {
        chart.fit();
      } catch {}
    });
    ro.observe(hostRef.current);

    return () => ro.disconnect();
  }, [groupedData, expandedGroups]);

  // Click: expand/collapse GROUP or show dialog for PERSON/VACANT
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const handler = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;

      // group toggle
      // const groupEl = target.closest('[data-node-type="GROUP"]') as HTMLElement | null;
      // if (groupEl) {
      //   const groupKey = groupEl.getAttribute("data-group-key") || "";
      //   if (!groupKey) return;

      //   setExpandedGroups((prev) => {
      //     const next = new Set(prev);
      //     if (next.has(groupKey)) next.delete(groupKey);
      //     else next.add(groupKey);
      //     return next;
      //   });
      //   return;
      // }

      // details dialog for others
      const nodeEl = target.closest("[data-node-id]") as HTMLElement | null;
      if (!nodeEl) return;

      const id = nodeEl.getAttribute("data-node-id") || "";
      if (!id) return;

      const node = groupedData.find((x) => x.id === id);
      if (!node) return;

      setSelectedNode(node);
      setShowDialog(true);
    };

    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [groupedData]);

  const toggleFullScreen = () => {
    if (!hostRef.current) return;

    if (!document.fullscreenElement) {
      setFullScreenActivated(true);
      hostRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setFullScreenActivated(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255,255,255,0.85)",
            zIndex: 20,
          }}
        >
          <BeatLoader size={12} />
        </div>
      )}

      <div id="team-org-chart">
        <button type="button" className="btn btn-info btn-sm mb-1 ml-1" onClick={toggleFullScreen}>
          <span className="mr-1 text-bold">Fullscreen</span>
          <i className="bi bi-arrows-fullscreen text-xl"></i>
        </button>

        <style>{css}</style>

        <div
          ref={hostRef}
          style={{
            backgroundColor: "white",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>

      <Dialog
        header={selectedNode?.fullName ?? selectedNode?.roleTitle ?? "Details"}
        visible={showDialog}
        style={{ width: "420px" }}
        onHide={() => setShowDialog(false)}
      >
        {selectedNode && (
          <div>
            <div>
              <b>Name:</b> {selectedNode.fullName ?? "-"}
            </div>
            <div>
              <b>Role:</b> {selectedNode.roleTitle}
            </div>
            <div>
              <b>Type:</b> {selectedNode.nodeType}
            </div>
            {selectedNode.nodeType === "GROUP" && (
              <div>
                <b>Count:</b> {selectedNode.groupCount ?? 0}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}

// ---------- Helpers ----------
function toNumberSort(x: number | string | null | undefined) {
  const n = typeof x === "string" ? Number(x) : x ?? 0;
  return Number.isFinite(n) ? n : 0;
}

// function buildGroupedData(raw: OrgNode[]): OrgNode[] {
//   const nodes = raw.map((n) => ({ ...n, sortOrder: toNumberSort(n.sortOrder) }));

//   const persons = nodes.filter((n) => n.nodeType === "PERSON" && n.parentId);

//   const keyOf = (n: OrgNode) => `${n.parentId}|${(n.roleTitle ?? "").trim()}`;

//   const buckets = new Map<string, OrgNode[]>();
//   for (const p of persons) {
//     const role = (p.roleTitle ?? "").trim();
//     if (!GROUP_ROLES.has(role)) continue;

//     const k = keyOf(p);
//     const arr = buckets.get(k) ?? [];
//     arr.push(p);
//     buckets.set(k, arr);
//   }

//   const result: OrgNode[] = nodes.map((n) => ({ ...n }));

//   // create group nodes + re-parent persons under group ALWAYS
//   for (const [groupKey, arr] of buckets.entries()) {
//     if (arr.length < GROUP_THRESHOLD) continue;

//     const sample = arr[0];
//     const parentId = sample.parentId!;
//     const roleTitle = (sample.roleTitle ?? "").trim();
//     const baseSort = Math.min(...arr.map((x) => toNumberSort(x.sortOrder)));

//     const groupId = `G:${encodeURIComponent(parentId)}:${encodeURIComponent(roleTitle)}`;

//     // re-parent persons under group always
//     for (const n of result) {
//       if (
//         n.nodeType === "PERSON" &&
//         n.parentId === parentId &&
//         (n.roleTitle ?? "").trim() === roleTitle
//       ) {
//         n.parentId = groupId;
//         n.sortOrder = 1000 + toNumberSort(n.sortOrder);
//       }
//     }

//     result.push({
//       id: groupId,
//       parentId,
//       fullName: null,
//       roleTitle,
//       nodeType: "GROUP",
//       sortOrder: baseSort - 0.5,
//       avatarUrl: null,
//       color: sample.color ?? "#475569",
//       groupKey,
//       groupCount: arr.length,
//     });
//   }

//   result.sort((a, b) => {
//     const pa = a.parentId ?? "";
//     const pb = b.parentId ?? "";
//     if (pa !== pb) return pa.localeCompare(pb);
//     const sa = toNumberSort(a.sortOrder);
//     const sb = toNumberSort(b.sortOrder);
//     if (sa !== sb) return sa - sb;
//     return a.id.localeCompare(b.id);
//   });

//   return result;
// }

function buildGroupedData(raw: OrgNode[]): OrgNode[] {
  const nodes = raw.map((n) => ({ ...n, sortOrder: toNumberSort(n.sortOrder) }));

  const persons = nodes.filter((n) => n.nodeType === "PERSON" && n.parentId);

  const keyOf = (n: OrgNode) => `${n.parentId}|${(n.roleTitle ?? "").trim()}`;

  // buckets by (parentId + roleTitle)
  const buckets = new Map<string, OrgNode[]>();
  for (const p of persons) {
    const role = (p.roleTitle ?? "").trim();
    if (!GROUP_ROLES.has(role)) continue;

    const k = keyOf(p);
    const arr = buckets.get(k) ?? [];
    arr.push(p);
    buckets.set(k, arr);
  }

  // start as copy of all nodes
  const result: OrgNode[] = nodes.map((n) => ({ ...n }));

  // create group nodes + re-parent persons:
  // - first person under GROUP
  // - others chained under previous person => vertical stack
  for (const [groupKey, arr] of buckets.entries()) {
    if (arr.length < GROUP_THRESHOLD) continue;

    // stable ordering inside group
    arr.sort((a, b) => {
      const sa = toNumberSort(a.sortOrder);
      const sb = toNumberSort(b.sortOrder);
      if (sa !== sb) return sa - sb;
      return (a.fullName ?? a.id).localeCompare(b.fullName ?? b.id);
    });

    const sample = arr[0];
    const parentId = sample.parentId!;
    const roleTitle = (sample.roleTitle ?? "").trim();
    const baseSort = Math.min(...arr.map((x) => toNumberSort(x.sortOrder)));

    const groupId = `G:${encodeURIComponent(parentId)}:${encodeURIComponent(roleTitle)}`;

    // push GROUP node
    result.push({
      id: groupId,
      parentId,
      fullName: null,
      roleTitle,
      nodeType: "GROUP",
      sortOrder: baseSort - 0.5,
      avatarUrl: null,
      color: sample.color ?? "#475569",
      groupKey,
      groupCount: arr.length,
    });

    // map id -> index in result for fast update
    const idxById = new Map<string, number>();
    for (let i = 0; i < result.length; i++) idxById.set(result[i].id, i);

    // re-parent persons into vertical chain
    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      const idx = idxById.get(p.id);
      if (idx == null) continue;

      result[idx].parentId = i === 0 ? groupId : arr[i - 1].id; // ✅ vertical stack
      result[idx].sortOrder = 1000 + i; // keep stable under group
    }
  }

  // stable sort
  result.sort((a, b) => {
    const pa = a.parentId ?? "";
    const pb = b.parentId ?? "";
    if (pa !== pb) return pa.localeCompare(pb);
    const sa = toNumberSort(a.sortOrder);
    const sb = toNumberSort(b.sortOrder);
    if (sa !== sb) return sa - sb;
    return a.id.localeCompare(b.id);
  });

  return result;
}



function escapeHtml(s: string) {
  return (s ?? "")
    // .replaceAll("&", "&amp;")
    // .replaceAll("<", "&lt;")
    // .replaceAll(">", "&gt;")
    // .replaceAll('"', "&quot;")
    // .replaceAll("'", "&#039;");
}

function getInitials(name: string) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

function normalizeColor(c?: string | null) {
  if (!c) return "";
  const s = c.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s)) return s;
  if (/^rgba?\(/i.test(s)) return s;
  return "";
}

const css = `
.oval-node{
  position: relative;
  width: 380px;
  height: 84px;
  border-radius: 9999px;
  border: 2px solid rgba(0,0,0,.18);
  box-shadow: 0 10px 24px rgba(0,0,0,.10);
  padding: 12px 16px 12px 78px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.oval-left{ min-width: 0; }

.oval-top{
  font-size: 21px;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 270px;
}

.oval-bottom{
  margin-top: 4px;
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,.92);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 270px;
}

.oval-avatar{
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(0,0,0,.20);
  background: rgba(255,255,255,.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.oval-avatar-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.oval-avatar-fallback{
  width: 100%;
  height: 100%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: 900;
  font-size: 18px;
  color: #fff;
}

/* group badge */
.group-pill{
  font-size: 13px;
  font-weight: 900;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.28);
}

/* Toggle */
.oval-toggle{
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 44px;
  height: 26px;
  border-radius: 6px;
  background: #e6e6e6;
  border: 1px solid rgba(0,0,0,.28);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 900;
  color: #111;
  box-shadow: 0 6px 14px rgba(0,0,0,.10);
  cursor: pointer;
  user-select: none;
}

.oval-toggle-caret{
  font-size: 14px;
  line-height: 1;
  position: relative;
  top: -1px;
}
.oval-toggle-count{
  font-size: 12px;
}

svg .link, svg .links { z-index: 1; }
.oval-node { position: relative; z-index: 2; }

#team-org-chart svg path[fill="none"],
#team-org-chart svg path[fill="None"],
#team-org-chart svg path[fill=""]{
  stroke: #9aa0a6 !important;
  stroke-width: 3 !important;
  opacity: .95 !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}
`;
