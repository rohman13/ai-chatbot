import { AgentsSelect } from "@/components/custom/agents-select";

export default async function AgentsPage() {
  return (
    <div className="flex flex-col justify-between items-center gap-4">
      <AgentsSelect />
    </div>
  );
}