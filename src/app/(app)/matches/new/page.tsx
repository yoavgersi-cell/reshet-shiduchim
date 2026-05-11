"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Candidate = { id: string; firstName: string; lastName: string; gender: string };

export default function NewMatchPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/candidates").then((r) => r.json()).then(setCandidates);
  }, []);

  const males = candidates.filter((c) => c.gender === "MALE");
  const females = candidates.filter((c) => c.gender === "FEMALE");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!c1 || !c2) { setError("יש לבחור שני מועמדים"); return; }
    setLoading(true);

    const res = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate1Id: c1, candidate2Id: c2 }),
    });

    if (!res.ok) { setError("שגיאה ביצירת ההתאמה"); setLoading(false); return; }
    const data = await res.json();
    router.push(`/matches/${data.id}`);
  }

  function CandidateSelect({ value, onChange, options, label }: {
    value: string;
    onChange: (v: string) => void;
    options: Candidate[];
    label: string;
  }) {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">בחר...</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">התאמה חדשה</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <CandidateSelect label="גבר" value={c1} onChange={setC1} options={males} />
          <CandidateSelect label="אישה" value={c2} onChange={setC2} options={females} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "יוצר..." : "צור התאמה"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              ביטול
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
