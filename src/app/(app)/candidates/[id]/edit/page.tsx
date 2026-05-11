"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CandidateForm from "@/components/CandidateForm";

export default function EditCandidatePage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    fetch(`/api/candidates/${id}`)
      .then((r) => r.json())
      .then((data) => setInitial({ ...data, age: String(data.age) }));
  }, [id]);

  if (!initial) return <p className="text-gray-400 text-sm text-center py-16">טוען...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">עריכת מועמד</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <CandidateForm initial={initial} candidateId={id} />
      </div>
    </div>
  );
}
