"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CandidateFormData = {
  firstName: string;
  lastName: string;
  gender: string;
  age: string;
  sector: string;
  background: string;
  lookingFor: string;
  privateNotes: string;
  phone: string;
};

const defaultData: CandidateFormData = {
  firstName: "",
  lastName: "",
  gender: "",
  age: "",
  sector: "",
  background: "",
  lookingFor: "",
  privateNotes: "",
  phone: "",
};

export default function CandidateForm({
  initial,
  candidateId,
}: {
  initial?: Partial<CandidateFormData>;
  candidateId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<CandidateFormData>({
    ...defaultData,
    ...initial,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(key: keyof CandidateFormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const method = candidateId ? "PUT" : "POST";
    const url = candidateId ? `/api/candidates/${candidateId}` : "/api/candidates";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    });

    if (!res.ok) {
      setError("שגיאה בשמירה");
      setLoading(false);
      return;
    }

    if (candidateId) {
      router.push(`/candidates/${candidateId}`);
    } else {
      const data = await res.json();
      router.push(`/candidates/${data.id}`);
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>שם פרטי</Label>
          <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>שם משפחה</Label>
          <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label>גיל</Label>
          <Input type="number" min={18} max={99} value={form.age} onChange={(e) => set("age", e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>מגדר</Label>
          <select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            required
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">בחר...</option>
            <option value="MALE">גבר</option>
            <option value="FEMALE">אישה</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label>מגזר</Label>
          <select
            value={form.sector}
            onChange={(e) => set("sector", e.target.value)}
            required
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="">בחר...</option>
            <option value="HAREDI">חרדי</option>
            <option value="DATI">דתי</option>
            <option value="MASORTI">מסורתי</option>
            <option value="HILONI">חילוני</option>
            <option value="OTHER">אחר</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label>טלפון (אופציונלי)</Label>
        <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" />
      </div>

      <div className="space-y-1">
        <Label>רקע</Label>
        <Textarea
          value={form.background}
          onChange={(e) => set("background", e.target.value)}
          rows={3}
          placeholder="משפחה, עבודה, אופי..."
        />
      </div>

      <div className="space-y-1">
        <Label>מחפש/ת</Label>
        <Textarea
          value={form.lookingFor}
          onChange={(e) => set("lookingFor", e.target.value)}
          rows={2}
          placeholder="מה הם מחפשים בבן/בת הזוג..."
        />
      </div>

      <div className="space-y-1">
        <Label>הערות פרטיות</Label>
        <Textarea
          value={form.privateNotes}
          onChange={(e) => set("privateNotes", e.target.value)}
          rows={2}
          placeholder="הערות פנימיות שלך..."
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "שומר..." : candidateId ? "שמור שינויים" : "הוסף מועמד"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          ביטול
        </Button>
      </div>
    </form>
  );
}
