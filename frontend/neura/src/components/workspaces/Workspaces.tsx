import Link from "next/link";
import CreateButton from "./CreateButton";
import WorkspaceCard from "./WorkspaceCard";

const notebooks = [
  {
    id: "1",
    title: "Notebook 1",
    dateCreated: "2023-01-01",
    sources: ["Source A", "Source B"],
  },
  {
    id: "2",
    title: "Notebook 2",
    dateCreated: "2023-02-01",
    sources: ["Source C", "Source D"],
  },
];

export default function Workspaces() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Notebooks</h1>
        <CreateButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((notebook) => (
          <Link href={`/w/${notebook.id}`} key={notebook.id}>
            <WorkspaceCard {...notebook} />
          </Link>
        ))}
      </div>
    </div>
  );
}
