"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SECTOR_LABELS, GENDER_LABELS } from "@/lib/constants";

type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  sector: string;
  lookingFor: string | null;
  phone: string | null;
};

const SECTORS = [
  { value: "", label: "הכל" },
  { value: "HAREDI", label: "חרדי" },
  { value: "DATI", label: "דתי" },
  { value: "MASORTI", label: "מסורתי" },
  { value: "HILONI", label: "חילוני" },
  { value: "OTHER", label: "אחר" },
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (sector) params.set("sector", sector);

    const timeout = setTimeout(() => {
      fetch(`/api/candidates?${params}`)
        .then((r) => r.json())
        .then((data) => {
          setCandidates(data);
          setLoading(false);
        });
    }, 200);

    return () => clearTimeout(timeout);
  }, [q, sector]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">מועמדים</h1>
        <Link href="/candidates/new">
          <Button size="sm">+ הוסף מועמד</Button>
        </Link>
      </div>

      <Input
        placeholder="חיפוש לפי שם..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="flex gap-2 flex-wrap">
        {SECTORS.map((s) => (
          <button
            key={s.value}
            onClick={() => setSector(s.value)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              sector === s.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">טוען...</p>
      ) : candidates.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">אין מועמדים עדיין</p>
      ) : (
        <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
          {candidates.map((c) => (
            <Link
              key={c.id}
              href={`/candidates/${c.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium">
                  {c.firstName} {c.lastName}
                </p>
                {c.lookingFor && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                    {c.lookingFor}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{c.age}</span>
                <Badge variant="secondary">{SECTOR_LABELS[c.sector]}</Badge>
                <Badge variant="outline">{GENDER_LABELS[c.gender]}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
