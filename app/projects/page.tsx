import { getAllProjects } from "@/lib/hygraph";
import ProjectHero from "./ProjectHero";

export default async function Projects() {
  const projects = await getAllProjects();

  return <ProjectHero projects={projects} />;
}