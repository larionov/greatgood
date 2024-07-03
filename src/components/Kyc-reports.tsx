import React, { Suspense, useState, useEffect } from "react";

import type { Entry } from "./data";
import { getData } from "./data";
import Pie from "./Pie";
import { IconDocument, IconCheck, IconCheckCircle, IconEllipsis, IconEye } from "./Icons";

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
  const freq = frequencies(data.map((entry) => entry.Status));

  const res = columns.map((key) => {
    return {
      name: key,
      value: freq[key] ?? 0,
    };
  });
  return res;
}

function useData() {
  const [data, setData] = useState<Entry[]>([]);

  useEffect(() => {
    getData().then((d) => setData(d));
  }, []);
  return data;
}

function getRiskColor(RiscScore: string) {
  return { LOW: "text-green-600" }[RiscScore] ?? "";
}

function getStatusIcon(Status: string) {
  const iconClass = "size-6 mr-2 inline-block";
  return (
    {
      "In Progress": <IconEllipsis className={iconClass} />,
      Approved: <IconCheck className={iconClass} />,
    }[Status] ?? <IconEye className={iconClass} />
  );
}

function getRiskIcon(Status: string) {
  const iconClass = "mr-2 size-6 inline-block";
  return (
    {
      LOW: <IconCheckCircle className={iconClass} />,
    }[Status] ?? null
  );
}

const KycReports = () => {
  const rows = useData();
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
          data={dataToPie(rows, Object.keys(ChartColors))}
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
            <Suspense
              fallback={
                <tr>
                  <td>Loading...</td>
                </tr>
              }
            >
              {rows.map((row) => {
                return (
                  <tr key={row.id}>
                    <td className={`${tableCellStyle} align-top`}>
                      {new Date(row.Created).toLocaleDateString()}
                      <div className="text-sm text-slate-600">{new Date(row.Created).toLocaleTimeString()}</div>
                    </td>
                    <td className={`${tableCellStyle} align-top`}>
                      {row.Name}
                      <div className="text-sm text-slate-600">{row.Email}</div>
                    </td>
                    <td className={tableCellStyle}>{row.Type}</td>
                    <td className={tableCellStyle}>
                      {getRiskIcon(row.RiscScore)}
                      <span className={getRiskColor(row.RiscScore)}>{row.RiscScore}</span>
                    </td>
                    <td className={tableCellStyle}>
                      {getStatusIcon(row.Status)} {row.StatusDescription ?? row.Status}
                    </td>
                    <td className={tableCellStyle}>
                      <button>
                        <IconDocument className="size-6" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycReports;
