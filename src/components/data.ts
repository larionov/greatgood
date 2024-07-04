// object type
export type Entry = {
  id: React.Key;
  createdAt: string; // 1995-12-17T03:24:00
  name: string;
  email: string;
  type: "aiscan2";
  riskScoring: string;
  status: string;
  statusDescription?: string;
};

export async function getData(): Promise<Entry[]> {
  return fetch("/applications.json").then((res) => res.json());
}
