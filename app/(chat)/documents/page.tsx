import { DocumentSelect } from "@/components/custom/document-select";

export default async function DocumentsPage() {
  return (
    <div className="flex flex-col justify-between items-center gap-4">
      <DocumentSelect />
    </div>
  );
}