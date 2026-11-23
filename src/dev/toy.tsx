import { createRoot } from "react-dom/client";
import { useState } from "react";
import { initialize, dispatch, useInova } from "../state/store";
import { BoneQuestToy } from "../features/companion/BoneQuestToy";
import { DogSprite } from "../features/companion/DogSprite";
import { CompanionControls } from "../features/companion/CompanionControls";
import "../styles.css";

async function seed() {
  await initialize();
  await dispatch({ type: "adopt", name: "Inu" });
  const titles = ["Outline the next chapter", "Take a little walk", "Practice a new skill"];
  for (const [index, title] of titles.entries()) {
    const commitmentId = `toy-demo-commitment-${index}`;
    await dispatch({ type: "add-commitment", commitment: { id: commitmentId, title, createdAt: "2026-11-23T01:00:00.000Z" } });
    await dispatch({ type: "propose-quest", quest: { id: `toy-demo-quest-${index}`, commitmentId, title,
      minutes: 10, reason: "Fictional preview quest", sourceIds: [commitmentId], status: "proposed", planner: "sample" } });
  }
}

function ToyPreview() {
  const state = useInova();
  const [expanded, setExpanded] = useState(false);
  return <main className={`app floating${expanded ? " toy-expanded" : ""}`}>
    <CompanionControls floating disabled={false} onHome={() => window.location.assign("/")} />
    <section className="pet-panel"><div className="dog-stage"><DogSprite state={state} /></div>
      <BoneQuestToy state={state} onExpandedChange={setExpanded} /></section>
  </main>;
}

if (import.meta.env.DEV) {
  document.body.style.background = "#182039";
  document.documentElement.style.setProperty("--float-work-height", "100vh");
  seed().then(() => createRoot(document.getElementById("root")!).render(<ToyPreview />)).catch(console.error);
}
