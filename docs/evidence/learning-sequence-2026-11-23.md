# Fictional companion learning evaluation

One service-only run on November 23, 2026 used `gemma3:4b` through Ollama and the app's actual chat selector and state reducer. The script explicitly saved each fictional memory with personalization allowed, serialized and reloaded state after a correction, and disabled recent conversation context. This is not a native UI, autonomous learning, reminder, or security test. The installed model name was recorded; its exact digest was not captured. Timings ranged from 0.6 to 6.0 seconds in this run and are not a benchmark.

| Step | Fictional input or change | Observed response |
| --- | --- | --- |
| Before learning | Ask for the user's name with no saved memories | Asked what to call the user. |
| Name | Save “My name is Alex”; ask again | Said the user's name was Alex. |
| Class | Save “I take astronomy”; ask which class | Said the user was taking astronomy. |
| Friend | Save “My friend Sam likes tea”; ask what Sam likes | Said Sam likes tea. |
| Date | Save “Sam's birthday is December 8”; ask when it is | Said December 8. |
| Effort | Save three hours of astronomy study; ask whether the user likes it | Said time alone was insufficient and asked how the user felt. |
| Correction | Explicitly replace Sam's preference with coffee; reload and ask | Said Sam likes coffee; the old tea memory was not in the sent memory list. |
| Permission | Revoke personalization for Sam's preference and ask | Said it did not know; the preference memory was not sent. |

Run `node scripts/evaluate-learning.mjs gemma3:4b` from the worktree with Ollama and that model available. The script prints each response and the exact fictional memories sent. It labels responses for human review rather than scoring them. Model outputs vary, personal facts can be invented, and matching cases in one run do not demonstrate reliable general behavior. Optional conversation context is separate from saved memories and can supply old text unless the user excludes it.
