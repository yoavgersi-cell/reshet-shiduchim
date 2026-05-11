"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  SECTOR_LABELS,
  GENDER_LABELS,
  MATCH_STATUS_LABELS,
  MATCH_STATUS_COLORS,
} from "@/lib/constants";

type Note = { id: string; content: string; createdAt: string };
type Match = {
  id: string;
  status: string;
  candidate1?: { id: string; firstName: string; lastName: string };
  candidate2?: { id: string; firstName: string; lastName: string };
};
type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  sector: string;
  phone: string | null;
  background: string | null;
  lookingFor: string | null;
  privateNotes: string | null;
  notes: Note[];
  matches1: Match[];
  matches2: Match[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
  });
}

export default function CandidatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [newNote, setNewNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    const res = await fetch(`/api/candidates/${id}`);
    if (!res.ok) return router.push("/candidates");
    setCandidate(await res.json());
  }

  useEffect(() => { load(); }, [id]);

  async function addNote() {
    if (!newNote.trim()) return;
    setSavingNote(true);
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entityType: "CANDIDATE",
        candidateId: id,
        content: newNote,
      }),
    });
    setNewNote("");
    setSavingNote(false);
    load();
  }

  async function deleteCandidate() {
    if (!confirm("למחוק את המועמד? פעולה זו בלתי הפיכה.")) return;
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    router.push("/candidates");
  }

  if (!candidate) {
    return <p className="text-gray-400 text-sm text-center py-16">טוען...</p>;
  }

  const allMatches = [
    ...candidate.matches1.map((m) => ({ ...m, other: m.candidate2 })),
    ...candidate.matches2.map((m) => ({ ...m, other: m.candidate1 })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/candidates")} className="text-gray-400 hover:text-gray-600">
            ←
          </button>
          <h1 className="text-xl font-bold">
            {candidate.firstName} {candidate.lastName}
          </h1>
          <Badge variant="secondary">{GENDER_LABELS[candidate.gender]}</Badge>
        </div>
        <div className="flex gap-2">
          <Link href={`/candidates/${id}/edit`}>
            <Button variant="outline" size="sm">ערוך</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={deleteCandidate} className="text-red-500 hover:text-red-700">
            מחק
          </Button>
        </div>
      </div>

      {/* פרטים */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex gap-4 text-sm text-gray-600">
          <span>גיל: <strong>{candidate.age}</strong></span>
          <span>מגזר: <strong>{SECTOR_LABELS[candidate.sector]}</strong></span>
          {candidate.phone && <span>טלפון: <strong>{candidate.phone}</strong></span>}
        </div>
        {candidate.background && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">רקע</p>
            <p className="text-sm">{candidate.background}</p>
          </div>
        )}
        {candidate.lookingFor && (
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">מחפש/ת</p>
            <p className="text-sm">{candidate.lookingFor}</p>
          </div>
        )}
        {candidate.privateNotes && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs font-medium text-yellow-700 mb-1">הערות פרטיות</p>
            <p className="text-sm">{candidate.privateNotes}</p>
          </div>
        )}
      </div>

      {/* התאמות */}
      {allMatches.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">התאמות</h2>
          <div className="space-y-2">
            {allMatches.map((m) => (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
              >
                <span className="text-sm">
                  {m.other?.firstName} {m.other?.lastName}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${MATCH_STATUS_COLORS[m.status]}`}>
                  {MATCH_STATUS_LABELS[m.status]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* הערות */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">הערות</h2>
        <div className="space-y-3 mb-4">
          {candidate.notes.length === 0 && (
            <p className="text-sm text-gray-400">אין הערות עדיין</p>
          )}
          {candidate.notes.map((n) => (
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
