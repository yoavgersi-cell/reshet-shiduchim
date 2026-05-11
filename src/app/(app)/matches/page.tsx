"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MATCH_STATUS_LABELS,
  MATCH_STATUS_COLORS,
  MATCH_STATUS_ORDER,
} from "@/lib/constants";

type Match = {
  id: string;
  status: string;
  candidate1: { id: string; firstName: string; lastName: string };
  candidate2: { id: string; firstName: string; lastName: string };
  updatedAt: string;
};

const FILTERS = [{ value: "", label: "הכל" }, ...MATCH_STATUS_ORDER.map((s) => ({ value: s, label: MATCH_STATUS_LABELS[s] }))];

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    fetch(`/api/matches?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      });
  }, [status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">התאמות</h1>
        <Link href="/matches/new">
          <Button size="sm">+ התאמה חדשה</Button>
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              status === f.value
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-8">טוען...</p>
      ) : matches.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">אין התאמות עדיין</p>
      ) : (
        <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-200">
          {matches.map((m) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">
                {m.candidate1.firstName} {m.candidate1.lastName}
                <span className="text-gray-400 mx-2">↔</span>
                {m.candidate2.firstName} {m.candidate2.lastName}
              </p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${MATCH_STATUS_COLORS[m.status]}`}>
                {MATCH_STATUS_LABELS[m.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
