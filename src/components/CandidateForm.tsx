"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

type FormData = {
  firstName: string; lastName: string; gender: string; age: string; height: string;
  city: string; sector: string; ethnicity: string; maritalStatus: string; fatherName: string;
  phone: string; yeshivaOrSeminar: string; learningStatus: string; kashrut: string;
  headCovering: string; smoking: string; parentalSupport: string;
  background: string; lookingFor: string; privateNotes: string; photoUrl: string;
};

const empty: FormData = {
  firstName: "", lastName: "", gender: "", age: "", height: "", city: "", sector: "",
  ethnicity: "", maritalStatus: "SINGLE", fatherName: "", phone: "",
  yeshivaOrSeminar: "", learningStatus: "", kashrut: "", headCovering: "",
  smoking: "", parentalSupport: "", background: "", lookingFor: "", privateNotes: "", photoUrl: "",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-1">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}</Label>
      {children}
    </div>
  );
}

function Select({ value, onChange, children, placeholder }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode; placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">{placeholder || "בחר..."}</option>
      {children}
    </select>
  );
}

export default function CandidateForm({
  initial, candidateId,
}: {
  initial?: Partial<FormData>; candidateId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...empty, ...initial });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setVal = (key: keyof FormData, val: string) => setForm((f) => ({ ...f, [key]: val }));

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) setVal("photoUrl", data.url);
    setUploadingPhoto(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      age: Number(form.age) || 0,
      height: form.height ? Number(form.height) : null,
      smoking: form.smoking === "true" ? true : form.smoking === "false" ? false : null,
      ethnicity: form.ethnicity || null,
      learningStatus: form.learningStatus || null,
      kashrut: form.kashrut || null,
      headCovering: form.headCovering || null,
      fatherName: form.fatherName || null,
      yeshivaOrSeminar: form.yeshivaOrSeminar || null,
      parentalSupport: form.parentalSupport || null,
      city: form.city || null,
    };

    const res = await fetch(
      candidateId ? `/api/candidates/${candidateId}` : "/api/candidates",
      { method: candidateId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );

    if (!res.ok) { setError("שגיאה בשמירה"); setLoading(false); return; }

    if (candidateId) {
      router.push(`/candidates/${candidateId}`);
    } else {
      const data = await res.json();
      router.push(`/candidates/${data.id}`);
    }
    router.refresh();
  }

  const isFemale = form.gender === "FEMALE";
  const isMale = form.gender === "MALE";
  const isReligious = ["HAREDI", "DATI"].includes(form.sector);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 1. פרטים אישיים */}
      <Section title="פרטים אישיים">
        <Row>
          <Field label="שם פרטי">
            <Input value={form.firstName} onChange={set("firstName")} required />
          </Field>
          <Field label="שם משפחה">
            <Input value={form.lastName} onChange={set("lastName")} required />
          </Field>
          <Field label="טלפון">
            <Input value={form.phone} onChange={set("phone")} type="tel" />
          </Field>
        </Row>
        <Row>
          <Field label="מגדר">
            <Select value={form.gender} onChange={(v) => setVal("gender", v)}>
              <option value="MALE">גבר</option>
              <option value="FEMALE">אישה</option>
            </Select>
          </Field>
          <Field label="גיל">
            <Input value={form.age} onChange={set("age")} type="number" min={18} max={99} required />
          </Field>
          <Field label="גובה (ס״מ)">
            <Input value={form.height} onChange={set("height")} type="number" min={140} max={220} placeholder="170" />
          </Field>
        </Row>
        <Row>
          <Field label="עיר מגורים">
            <Input value={form.city} onChange={set("city")} placeholder="ירושלים" />
          </Field>
          <Field label="עדה">
            <Select value={form.ethnicity} onChange={(v) => setVal("ethnicity", v)}>
              <option value="ASHKENAZI">אשכנזי</option>
              <option value="SEPHARDI">ספרדי</option>
              <option value="YEMENITE">תימני</option>
              <option value="MIZRAHI">מזרחי</option>
              <option value="OTHER">אחר</option>
            </Select>
          </Field>
          <Field label="מצב משפחתי">
            <Select value={form.maritalStatus} onChange={(v) => setVal("maritalStatus", v)}>
              <option value="SINGLE">רווק/ה</option>
              <option value="DIVORCED">גרוש/ה</option>
              <option value="WIDOWED">אלמן/ה</option>
            </Select>
          </Field>
        </Row>
        {isMale && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="שם האב">
              <Input value={form.fatherName} onChange={set("fatherName")} placeholder="אברהם" />
            </Field>
          </div>
        )}
      </Section>

      {/* 2. רקע דתי */}
      <Section title="רקע דתי">
        <Row>
          <Field label="מגזר">
            <Select value={form.sector} onChange={(v) => setVal("sector", v)}>
              <option value="HAREDI">חרדי</option>
              <option value="DATI">דתי-לאומי</option>
              <option value="MASORTI">מסורתי</option>
              <option value="HILONI">חילוני</option>
              <option value="OTHER">אחר</option>
            </Select>
          </Field>
          <Field label={isMale ? "ישיבה" : "סמינר / מכללה"}>
            <Input value={form.yeshivaOrSeminar} onChange={set("yeshivaOrSeminar")} placeholder={isMale ? "פוניבז', הסדר..." : "מחון, אמי..."} />
          </Field>
          {isReligious && (
            <Field label="כשרות">
              <Select value={form.kashrut} onChange={(v) => setVal("kashrut", v)}>
                <option value="MEHADRIN">מהדרין</option>
                <option value="HALAK">חלק</option>
                <option value="REGULAR">רגיל</option>
              </Select>
            </Field>
          )}
        </Row>
        {isReligious && (
          <Row>
            {isMale && (
              <Field label="לומד / עובד">
                <Select value={form.learningStatus} onChange={(v) => setVal("learningStatus", v)}>
                  <option value="LEARNING">לומד בכולל</option>
                  <option value="WORKING">עובד</option>
                  <option value="BOTH">לומד ועובד</option>
                </Select>
              </Field>
            )}
            {isFemale && (
              <Field label="כיסוי ראש (לאחר נישואין)">
                <Select value={form.headCovering} onChange={(v) => setVal("headCovering", v)}>
                  <option value="MITPACHAT">מטפחת</option>
                  <option value="PEYAH">פאה</option>
                  <option value="KOVA">כובע</option>
                  <option value="NONE">לא</option>
                </Select>
              </Field>
            )}
            <Field label="עישון">
              <Select value={form.smoking} onChange={(v) => setVal("smoking", v)}>
                <option value="false">לא מעשן/ת</option>
                <option value="true">מעשן/ת</option>
              </Select>
            </Field>
            {isMale && (
              <Field label="תמיכת הורים">
                <Input value={form.parentalSupport} onChange={set("parentalSupport")} placeholder="כמה שנים, מהצד מי..." />
              </Field>
            )}
          </Row>
        )}
      </Section>

      {/* 3. על עצמי ומה מחפש */}
      <Section title="על עצמי ומה אני מחפש/ת">
        <Field label="רקע — משפחה, לימודים, עבודה, אופי">
          <Textarea value={form.background} onChange={set("background")} rows={3} placeholder="גדל/ה ב..., משפחה של..., עובד/ת כ..." />
        </Field>
        <Field label="מה מחפש/ת בבן/בת הזוג">
          <Textarea value={form.lookingFor} onChange={set("lookingFor")} rows={2} placeholder="מחפש/ת מישהו ש..." />
        </Field>
      </Section>

      {/* 4. הערות פרטיות */}
      <Section title="הערות פרטיות (לשדכנית בלבד)">
        <Field label="הערות">
          <Textarea value={form.privateNotes} onChange={set("privateNotes")} rows={2} placeholder="מה שחשוב לדעת שלא כותבים בפרופיל..." />
        </Field>
      </Section>

      {/* 5. תמונה */}
      <Section title="תמונה פרטית (לשדכנית בלבד)">
        <div className="flex items-center gap-4">
          {form.photoUrl && (
            <Image src={form.photoUrl} alt="תמונה" width={64} height={64} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
          )}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploadingPhoto}>
              {uploadingPhoto ? "מעלה..." : form.photoUrl ? "החלף תמונה" : "העלה תמונה"}
            </Button>
            {form.photoUrl && (
              <button type="button" onClick={() => setVal("photoUrl", "")} className="mr-2 text-xs text-red-500 hover:text-red-700">
                הסר
              </button>
            )}
          </div>
        </div>
      </Section>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "שומר..." : candidateId ? "שמור שינויים" : "הוסף מועמד"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>ביטול</Button>
      </div>
    </form>
  );
}
