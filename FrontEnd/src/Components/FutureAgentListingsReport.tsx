import React, { useEffect, useRef, useState } from "react";
import AgentService from "../Services/AgentService";
import { Chart } from "react-google-charts";
import ChartSkeleton from "./ChartSkeleton";
import DataFutureRep from "../Models/DataFutureRep";

interface Props { id: string; }

export default function FutureAgentListingsReport({ id }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seqRef = useRef(0);

  const buildData = (report: DataFutureRep[]) => ([
    ["Month", "New Listings This Month", "Pending Listings Today"],
    ...(report ?? []).map((el) => [
      el.MonthName,
      parseInt(String(el.newListings)) || 0,
      parseFloat(String(el.pendingListings)) || 0,
    ]),
  ]);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    const seq = ++seqRef.current;


    (async () => {
      try {
        setLoading(true);
        setError(null);

        const report = await AgentService
          .getDataFutureReport({ id })
          .catch((e: any) => {
            const s = e?.response?.status;
            if (s === 404) return [] as DataFutureRep[];
            throw e;
          });

        if (ignore) {
          return;
        }

        const table = buildData(report || []);
        setData(table);
      } catch (e) {
        if (!ignore) {
          setError("Data loading error.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    })();

    // cleanup 
    return () => {
      ignore = true;
    };
  }, [id]);

  const hasRows = data.length > 2;
  
  return (
    <div className="position-relative">
      {loading ? (
        <ChartSkeleton height={340} bars={12} />
      ) : error ? (
        <div className="alert alert-danger my-2">{error}</div>
      ) : !hasRows ? (
        <div className="alert alert-info my-2">No data available.</div>
      ) : (
        <Chart
          width="100%"
          height="400px"
          chartType="ComboChart"
          data={data}
          options={{
            title: "Monthly Listing Trend",
            isStacked: false,
            chartArea: { width: "85%" },
            colors: ["Purple", "red"],
            legend: { position: "bottom" },
            vAxis: { viewWindowMode: "explicit", viewWindow: { min: 0 } },
            curveType: "function",
            seriesType: "bars",
            series: { 1: { type: "line" } },
          }}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}
    </div>
  );
}
