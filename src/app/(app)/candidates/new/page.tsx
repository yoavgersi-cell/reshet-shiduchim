import CandidateForm from "@/components/CandidateForm";

export default function NewCandidatePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">הוספת מועמד</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <CandidateForm />
      </div>
    </div>
  );
}
