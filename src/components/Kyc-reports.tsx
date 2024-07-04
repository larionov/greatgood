import { useState, useEffect } from "react";

import type { Entry } from "./data";
import { getData } from "./data";
import Pie from "./Pie";
import {
  IconDocument,
  IconCheck,
  IconCheckCircle,
  IconEllipsis,
  IconEye,
  IconQuestion,
  IconExclamation,
  IconCross,
} from "./Icons";

const ChartColors = {
  Approved: "#8bc34b",
  Rejected: "#ff9800",
  Cancelled: "#ff5722",
  "Ready For Review": "#f5f502",
  "In Progress": "#01a9f4",
};

type FrequencyMap = { [key: string]: number };

function frequencies(arr: string[]): FrequencyMap {
  return arr.reduce<FrequencyMap>((a, v) => {
    a[v] = (a[v] ?? 0) + 1;
    return a;
  }, {});
}

function dataToPie(data: Entry[], columns: string[]) {
  const freq = frequencies(data.map((entry) => entry.status));

  const res = columns
    .filter((key) => freq[key] > 0)
    .map((key) => {
      return {
        name: key,
        value: freq[key] ?? 0,
      };
    });
  return res;
}

function useData() {
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData()
      .then((d) => {
        setData(d);

        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, []);
  return { data, loading, error };
}

function getRiskColor(RiscScore: string) {
  return (
    {
      LOW: "text-green-600",
      MEDIUM: "text-slate-600",
      HIGH: "text-red-600",
    }[RiscScore] ?? ""
  );
}

function getStatusIcon(Status: string) {
  const iconClass = "size-6 mr-2 inline-block";
  return (
    {
      "In Progress": <IconEllipsis className={iconClass} />,
      Rejected: <IconCross className={iconClass} />,
      Approved: <IconCheck className={iconClass} />,
    }[Status] ?? <IconEye className={iconClass} />
  );
}

function getRiskIcon(Status: string) {
  const iconClass = "mr-2 size-6 inline-block";
  return (
    {
      LOW: <IconCheckCircle className={iconClass} />,
      MEDIUM: <IconQuestion className={iconClass} />,
      HIGH: <IconExclamation className={iconClass} />,
    }[Status] ?? null
  );
}

const KycReports = () => {
  const { data, loading, error } = useData();
  const tableCellStyle = "border-b border-slate-100 p-2";
  return (
    <div className="min-w-min mx-2 my-8 px-8 py-8 bg-white shadow-md rounded-lg overflow-hidden">
      <h2>KYC Application Reports</h2>
      <div className="flex flex-col items-center">
        <Pie
          className="flex-1"
          width={1000}
          height={600}
          colors={Object.values(ChartColors)}
          data={dataToPie(data, Object.keys(ChartColors))}
        />
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className={tableCellStyle}>Created</th>
              <th className={tableCellStyle}>Name</th>
              <th className={tableCellStyle}>Type</th>
              <th className={tableCellStyle}>Risk Score</th>
              <th className={tableCellStyle}>Status</th>
              <th className={tableCellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <tr key={row.id}>
                  <td className={`${tableCellStyle} align-top`}>
                    {new Date(row.createdAt).toLocaleDateString()}
                    <div className="text-sm text-slate-600">{new Date(row.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className={`${tableCellStyle} align-top`}>
                    {row.name}
                    <div className="text-sm text-slate-600">{row.email}</div>
                  </td>
                  <td className={tableCellStyle}>{row.type}</td>
                  <td className={tableCellStyle}>
                    {getRiskIcon(row.riskScoring)}
                    <span className={getRiskColor(row.riskScoring)}>{row.riskScoring}</span>
                  </td>
                  <td className={tableCellStyle}>
                    {getStatusIcon(row.status)} {row.statusDescription ?? row.status}
                  </td>
                  <td className={tableCellStyle}>
                    <button>
                      <IconDocument className="size-6" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <div className="mt-6 text-slate-500">Loading...</div>}
        {error && <div className="mt-6 text-red-500">Error loading data</div>}
      </div>
    </div>
  );
};

export default KycReports;
