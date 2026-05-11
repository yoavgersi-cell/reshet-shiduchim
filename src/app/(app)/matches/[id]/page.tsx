"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MATCH_STATUS_LABELS,
  MATCH_STATUS_COLORS,
  MATCH_STATUS_ORDER,
  SECTOR_LABELS,
} from "@/lib/constants";

type Note = { id: string; content: string; createdAt: string };
type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  sector: string;
};
type Match = {
  id: string;
  status: string;
  candidate1: Candidate;
  candidate2: Candidate;
  notes: Note[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long" });
}

export default function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    const res = await fetch(`/api/matches/${id}`);
    if (!res.ok) return router.push("/matches");
    setMatch(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  async function changeStatus(status: string) {
    await fetch(`/api/matches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType: "MATCH", matchId: id, content: newNote }),
    });
    setNewNote("");
    setSavingNote(false);
    load();
  }

  async function deleteMatch() {
    if (!confirm("למחוק את ההתאמה?")) return;
    await fetch(`/api/matches/${id}`, { method: "DELETE" });
    router.push("/matches");
  }

  if (!match) return <p className="text-gray-400 text-sm text-center py-16">טוען...</p>;

  const currentIdx = MATCH_STATUS_ORDER.indexOf(match.status as never);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/matches")} className="text-gray-400 hover:text-gray-600">←</button>
          <h1 className="text-xl font-bold">
            {match.candidate1.firstName} ↔ {match.candidate2.firstName}
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={deleteMatch} className="text-red-500 hover:text-red-700">
          מחק
        </Button>
      </div>

      {/* שלב */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-medium text-gray-400 mb-3">שלב בשידוך</p>
        <div className="flex gap-2 flex-wrap">
          {MATCH_STATUS_ORDER.map((s, i) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                match.status === s
                  ? MATCH_STATUS_COLORS[s] + " border-transparent font-medium"
                  : i < currentIdx
                  ? "bg-gray-50 text-gray-400 border-gray-100"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {MATCH_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* מועמדים */}
      <div className="grid grid-cols-2 gap-4">
        {([match.candidate1, match.candidate2] as Candidate[]).map((c) => (
          <Link
            key={c.id}
            href={`/candidates/${c.id}`}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium">{c.firstName} {c.lastName}</p>
            <p className="text-sm text-gray-500 mt-1">
              {c.age} · {SECTOR_LABELS[c.sector]}
            </p>
          </Link>
        ))}
      </div>

      {/* הערות */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">הערות</h2>
        <div className="space-y-3 mb-4">
          {match.notes.length === 0 && (
            <p className="text-sm text-gray-400">אין הערות עדיין</p>
          )}
          {match.notes.map((n) => (
            <div key={n.id} className="text-sm border-r-2 border-gray-200 pr-3">
              <p>{n.content}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="הוסף הערה..."
            rows={2}
          />
          <Button size="sm" onClick={addNote} disabled={savingNote || !newNote.trim()}>
            {savingNote ? "שומר..." : "הוסף הערה"}
          </Button>
        </div>
      </div>
    </div>
  );
}
