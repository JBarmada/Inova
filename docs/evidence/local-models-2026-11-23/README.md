# Local planner trial — November 23, 2026

Three fictional inputs were tested on Windows with the standalone Ollama v0.40.14 runtime (official archive SHA-256 `65d68cade6cf6375f398b518224f8c8a15e062387f38cf477abfc848de7e7e29`). The NVIDIA RTX 3060 Laptop GPU reported 6,144 MiB total; other GPU workloads were present. Models were Q4_K_M Gemma 3 tags, context 4096, temperature 0.2, maximum 256 generated tokens. See the three JSON files for exact fictional outputs and timings; the first request of each model includes loading. `tools/benchmark_local_models.py` reproduces the cases against a running local Ollama service.

| Run | Shape-valid | Cold / warm response time | Observed memory |
| --- | --- | --- | --- |
| 4B initial prompt | 3/3 | 23.20 s / 0.61–0.66 s | GPU total around 5,483 MiB including other workloads |
| 4B revised prompt | 3/3 | warm 0.56–1.03 s | Ollama reported ~2.88 GB loaded, all ~2.88 GB GPU |
| 12B revised prompt | 3/3 | 24.38 s / 6.78–7.39 s | Ollama reported ~8.93 GB loaded, ~3.43 GB GPU |

Manual review: the 4B initial unknown-exam response invented a specific chapter; its injection case discussed sensitive-information extraction rather than the intended review. With the revised prompt, these three examples no longer had those specific problems. The 12B revised responses were structurally valid and did not invent that chapter or follow the injected instruction in these trials, but the first response was generic and did not explicitly reflect the short-session preference. Three cases are insufficient to establish overall quality, injection resistance, or reliable grounding. The application retains 12B as a provisional default, pending broader evaluation and user experience review.

An isolated Windows app build (`com.inova.buildout.verify`) with fictional data generated and saved a local 12B quest through the actual UI and Rust command. Native sample flow also verified adoption, editing/accepting/completing a quest, reward text, restart restoration, floating mode, board opening and outside-click dismissal. This did not verify Mac, audible output, exact geometry/dragging, reduced motion or frame-by-frame animation. Temporary server and models live in ignored `.tools/ollama`; no model files belong in Git.

## Later constrained native recheck

After response bounding and the quest-length setting were added, the native Windows app sent the fictional commitment “Practice a fictional project outline” to Gemma 3 4B with a five-minute maximum. It saved a structurally valid five-minute proposal, “Outline Review.” The reason suggested reviewing the outline’s structure and identifying initial sections; no actual outline was supplied. That phrasing arguably assumes an existing artifact, so treat this as another potential grounding failure, not a reliability pass. One trial; the temporary service was stopped.
