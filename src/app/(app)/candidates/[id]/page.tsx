"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  SECTOR_LABELS, GENDER_LABELS, ETHNICITY_LABELS, MARITAL_STATUS_LABELS,
  KASHRUT_LABELS, HEAD_COVERING_LABELS, LEARNING_STATUS_LABELS,
  MATCH_STATUS_LABELS, MATCH_STATUS_COLORS,
} from "@/lib/constants";

type Note = { id: string; content: string; createdAt: string };
type Match = {
  id: string; status: string;
  candidate1?: { id: string; firstName: string; lastName: string };
  candidate2?: { id: string; firstName: string; lastName: string };
};
type Candidate = {
  id: string; firstName: string; lastName: string; gender: string; age: number;
  height: number | null; city: string | null; sector: string; ethnicity: string | null;
  maritalStatus: string; fatherName: string | null; phone: string | null;
  yeshivaOrSeminar: string | null; learningStatus: string | null; kashrut: string | null;
  headCovering: string | null; smoking: boolean | null; parentalSupport: string | null;
  background: string | null; lookingFor: string | null; privateNotes: string | null;
  photoUrl: string | null; notes: Note[]; matches1: Match[]; matches2: Match[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", { day: "numeric", month: "long" });
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</p>
      {children}
    </div>
  );
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
      body: JSON.stringify({ entityType: "CANDIDATE", candidateId: id, content: newNote }),
    });
    setNewNote("");
    setSavingNote(false);
    load();
  }

  async function deleteCandidate() {
    if (!confirm("למחוק את המועמד?")) return;
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    router.push("/candidates");
  }

  if (!candidate) return <p className="text-gray-400 text-sm text-center py-16">טוען...</p>;

  const allMatches = [
    ...candidate.matches1.map((m) => ({ ...m, other: m.candidate2 })),
    ...candidate.matches2.map((m) => ({ ...m, other: m.candidate1 })),
  ];

  const isMale = candidate.gender === "MALE";
  const isReligious = ["HAREDI", "DATI"].includes(candidate.sector);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push("/candidates")} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
          <h1 className="text-xl font-bold">{candidate.firstName} {candidate.lastName}</h1>
          <Badge variant="outline">{GENDER_LABELS[candidate.gender]}</Badge>
          {candidate.maritalStatus !== "SINGLE" && (
            <Badge variant="secondary">{MARITAL_STATUS_LABELS[candidate.maritalStatus]}</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/candidates/${id}/edit`}>
            <Button variant="outline" size="sm">ערוך</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={deleteCandidate} className="text-red-500 hover:text-red-700">מחק</Button>
        </div>
      </div>

      {/* כרטיס ראשי */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">

        {/* תמונה + פרטים מהירים */}
        <div className="flex gap-4">
          {candidate.photoUrl ? (
            <Image src={candidate.photoUrl} alt="תמונה" width={80} height={80} className="w-20 h-20 rounded-full object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 text-2xl shrink-0">
              {isMale ? "👤" : "👤"}
            </div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 content-start">
            <InfoRow label="גיל" value={String(candidate.age)} />
            {candidate.height && <InfoRow label="גובה" value={`${candidate.height} ס״מ`} />}
            {candidate.city && <InfoRow label="עיר" value={candidate.city} />}
            {candidate.phone && <InfoRow label="טלפון" value={candidate.phone} />}
            <InfoRow label="מגזר" value={SECTOR_LABELS[candidate.sector]} />
            {candidate.ethnicity && <InfoRow label="עדה" value={ETHNICITY_LABELS[candidate.ethnicity]} />}
          </div>
        </div>

        {/* רקע דתי */}
        {isReligious && (
          <Section title="רקע דתי">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {candidate.yeshivaOrSeminar && <InfoRow label={isMale ? "ישיבה" : "סמינר"} value={candidate.yeshivaOrSeminar} />}
              {candidate.kashrut && <InfoRow label="כשרות" value={KASHRUT_LABELS[candidate.kashrut]} />}
              {isMale && candidate.learningStatus && <InfoRow label="עיסוק" value={LEARNING_STATUS_LABELS[candidate.learningStatus]} />}
              {!isMale && candidate.headCovering && <InfoRow label="כיסוי ראש" value={HEAD_COVERING_LABELS[candidate.headCovering]} />}
              {candidate.smoking !== null && <InfoRow label="עישון" value={candidate.smoking ? "מעשן/ת" : "לא מעשן/ת"} />}
              {candidate.fatherName && <InfoRow label="שם האב" value={candidate.fatherName} />}
              {candidate.parentalSupport && <InfoRow label="תמיכת הורים" value={candidate.parentalSupport} />}
            </div>
          </Section>
        )}

        {/* על עצמי */}
        {candidate.background && (
          <Section title="רקע">
            <p className="text-sm text-gray-700 leading-relaxed">{candidate.background}</p>
          </Section>
        )}

        {candidate.lookingFor && (
          <Section title="מחפש/ת">
            <p className="text-sm text-gray-700 leading-relaxed">{candidate.lookingFor}</p>
          </Section>
        )}

        {/* הערות פרטיות */}
        {candidate.privateNotes && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-700 mb-1">הערות פרטיות</p>
            <p className="text-sm text-yellow-900">{candidate.privateNotes}</p>
          </div>
        )}
      </div>

      {/* התאמות */}
      {allMatches.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">התאמות</h2>
          <div className="space-y-1">
            {allMatches.map((m) => (
              <Link key={m.id} href={`/matches/${m.id}`}
                className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors">
                <span className="text-sm">{m.other?.firstName} {m.other?.lastName}</span>
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
          {candidate.notes.length === 0 && <p className="text-sm text-gray-400">אין הערות עדיין</p>}
          {candidate.notes.map((n) => (
            <div key={n.id} className="text-sm border-r-2 border-gray-200 pr-3">
              <p>{n.content}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="הוסף הערה..." rows={2} />
          <Button size="sm" onClick={addNote} disabled={savingNote || !newNote.trim()}>
            {savingNote ? "שומר..." : "הוסף הערה"}
          </Button>
        </div>
      </div>
    </div>
  );
}
