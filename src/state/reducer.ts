import type { Action } from "../shared/actions";
import { stateSchema, type AppState } from "../shared/schema";
import { changeQuestStatus, completeQuest } from "./quests";
import { changeEquipment } from "./equipment";
import { planQuest, clearQuestPlan } from "./scheduling";
import { changeChat } from "./chat";
import { previousQuestContext } from "../services/previousQuest";
import { validRecentChat } from "../services/recentChat";
import { followUpIds, withFollowUps } from "./followUps";

function apply(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "chat-goal": case "chat-share": case "chat-context-exclusion": case "chat-plan-message": case "dismiss-quest-suggestion": case "chat-context": case "chat-skip": case "chat-reset": case "chat-clear": case "chat-follow-up": return changeChat(state, action);
    case "save-chat-memory": return saveChatMemory(state, action);
    case "correct-chat-memory": return correctChatMemory(state, action);
    case "dismiss-memory-suggestion": return dismissMemorySuggestion(state, action.replyIndex, action.sourceIndex, action.quote);
    case "chat-reply": return saveChatReply(state, action);
    case "skip-chat-reflection": return clearReflectionPrompt(state, action.questId);
    case "adopt":
      return { ...state, pet: { ...state.pet, name: action.name.trim(), adopted: true, ...(action.personality ? { personality: action.personality } : {}) } };
    case "mood": return { ...state, pet: { ...state.pet, mood: action.mood } };
    case "mute": return { ...state, settings: { ...state.settings, muted: action.muted } };
    case "dev-mode": return { ...state, settings: { ...state.settings, devMode: action.enabled } };
    case "status-bar": return { ...state, settings: { ...state.settings, showStatus: action.enabled } };
    case "reduce-motion": return { ...state, settings: { ...state.settings, reduceMotion: action.enabled } };
    case "local-model": return { ...state, settings: { ...state.settings, localModel: action.model } };
    case "quest-minute-limit": return { ...state, settings: { ...state.settings, questMinuteLimit: action.minutes } };
    case "add-commitment":
      if (state.commitments.some((entry) => entry.id === action.commitment.id)) return state;
      return { ...state, commitments: [...state.commitments, action.commitment] };
    case "add-exploration": case "add-planned-quest":
      if (action.quest.commitmentId !== action.commitment.id || state.commitments.some((entry) => entry.id === action.commitment.id) || state.quests.some((entry) => entry.id === action.quest.id)) throw Error("This quest already exists or is invalid.");
      return apply(apply(state, { type: "add-commitment", commitment: action.commitment }), { type: "propose-quest", quest: action.quest, memorySnapshot: action.type === "add-planned-quest" ? action.memorySnapshot : undefined });
    case "accept-planned-quest": return acceptPlannedQuest(state, action);
    case "propose-quest":
      if (state.quests.some((entry) => entry.id === action.quest.id)) return state;
      if ((action.quest.planner === "local" && !action.memorySnapshot) ||
        action.quest.sourceIds.filter((id) => id !== action.quest.commitmentId).some((id) =>
          !action.memorySnapshot?.some((snapshot) => snapshot.id === id))) {
        throw Error("Quest evidence is incomplete.");
      }
      if (action.memorySnapshot?.some((snapshot) => !state.memories.some((memory) =>
        memory.id === snapshot.id && memory.aiAllowed && memory.text === snapshot.text))) {
        throw Error("A reflection changed while planning. Please try again.");
      }
      if (!state.commitments.some((entry) => entry.id === action.quest.commitmentId)) throw Error("Unknown commitment.");
      if (state.commitments.some((entry) => entry.id === action.quest.commitmentId && entry.effortMinutes && action.quest.minutes > entry.effortMinutes))
        throw Error("Quest duration exceeds the estimated total effort.");
      if (action.quest.completedAt || action.quest.plan) throw Error("A proposed quest cannot have a completion date or plan.");
      if (action.quest.status !== "proposed") throw Error("New quests must be proposals.");
      if (action.quest.priorQuestId && !state.quests.some((entry) => entry.id === action.quest.priorQuestId && entry.status === "completed")) throw Error("Prior quest must be completed.");
      if (state.settings.questMinuteLimit && action.quest.minutes > state.settings.questMinuteLimit) throw Error("This quest exceeds your current length limit. Please plan again.");
      if (!action.quest.sourceIds.includes(action.quest.commitmentId)) throw Error("Quest must cite its commitment.");
      if (action.quest.sourceIds.some((id) => id !== action.quest.commitmentId && !state.memories.some((memory) => memory.id === id && memory.aiAllowed))) throw Error("Quest refers to unavailable evidence.");
      return { ...state, quests: [...state.quests, action.quest] };
    case "edit-quest": {
      const title = action.title.trim();
      if (!title || title.length > 4000) throw Error("Quest title must contain 1–4000 characters.");
      if (action.minutes !== undefined && (!Number.isInteger(action.minutes) || action.minutes < 1 || action.minutes > 120)) throw Error("Duration must be 1–120 whole minutes.");
      const quest = state.quests.find((entry) => entry.id === action.id);
      if (!quest || quest.status === "completed" || quest.status === "dismissed") throw Error("This quest cannot be edited.");
      return { ...state, quests: state.quests.map((entry) => entry.id === action.id ? { ...entry, title, minutes: action.minutes ?? entry.minutes, ...(action.minutes !== undefined && action.minutes !== entry.minutes ? { plan: undefined } : {}) } : entry) };
    }
    case "quest-status": return changeQuestStatus(state, action);
    case "complete-quest": return completeQuest(state, action.id, action.completedAt);
    case "plan-quest": return planQuest(state, action.id, action.request);
    case "clear-quest-plan": return clearQuestPlan(state, action.id);
    case "equip": case "unequip": case "equip-outfit": case "wardrobe-scenario": return changeEquipment(state, action);
    case "add-memory":
      if (state.memories.some((entry) => entry.id === action.memory.id)) return state;
      if (action.memory.questId && !state.quests.some((quest) => quest.id === action.memory.questId && quest.status === "completed")) {
        throw Error("A related adventure must be completed first.");
      }
      return clearReflectionPrompt({ ...state, memories: [...state.memories, action.memory] }, action.memory.questId);
    case "edit-memory": return editMemory(state, action);
    case "memory-category":
      if (!state.memories.some((entry) => entry.id === action.id)) throw Error("Memory no longer exists.");
      return { ...state, memories: state.memories.map((entry) => entry.id === action.id ? { ...entry, category: action.category } : entry) };
    case "memory-permission":
      return { ...forgetReference(state, action.allowed ? "" : action.id), memories: state.memories.map((entry) => entry.id === action.id ? { ...entry, aiAllowed: action.allowed } : entry) };
    case "delete-memory": return { ...forgetReference(state, action.id), memories: state.memories.filter((entry) => entry.id !== action.id) };
  }
}

function saveChatMemory(state: AppState, action: Extract<Action, { type: "save-chat-memory" }>): AppState {
  const message = state.chat.messages[action.messageIndex];
  if (!message || message.role !== "user" || message.text !== action.originalText) throw Error("This conversation changed. Please choose the message again.");
  if (action.memory.source !== "chat" || action.memory.questId) throw Error("Invalid conversation memory.");
  if (action.suggestion && state.memories.some((memory) => memory.id === action.memory.id)) throw Error("Memory already exists.");
  const cleared = action.suggestion ? dismissMemorySuggestion(state, action.suggestion.replyIndex, action.messageIndex, action.suggestion.quote) : state;
  return apply(cleared, { type: "add-memory", memory: action.memory });
}

function correctChatMemory(state: AppState, action: Extract<Action, { type: "correct-chat-memory" }>): AppState {
  const message = state.chat.messages[action.messageIndex];
  if (!message || message.role !== "user" || message.text !== action.originalText) throw Error("This conversation changed. Please choose the message again.");
  const existing = state.memories.find((memory) => memory.id === action.target.id);
  if (!existing || existing.text !== action.target.text || existing.createdAt !== action.target.createdAt ||
    existing.aiAllowed !== action.target.aiAllowed || existing.category !== action.target.category ||
    existing.source !== action.target.source || existing.questId !== action.target.questId) throw Error("This memory changed. Please choose it again.");
  const cleared = action.suggestion ? dismissMemorySuggestion(state, action.suggestion.replyIndex, action.messageIndex, action.suggestion.quote) : state;
  return editMemory(cleared, { type: "edit-memory", id: existing.id, text: action.text });
}

function dismissMemorySuggestion(state: AppState, replyIndex: number, sourceIndex: number, quote: string): AppState {
  const reply = state.chat.messages[replyIndex];
  if (reply?.role !== "dog" || reply.memorySuggestion?.sourceIndex !== sourceIndex || reply.memorySuggestion.quote !== quote) throw Error("This suggestion is no longer available.");
  return { ...state, chat: { ...state.chat, messages: state.chat.messages.map((entry, index) => index === replyIndex ? { ...entry, memorySuggestion: undefined } : entry) } };
}

function saveChatReply(state: AppState, action: Extract<Action, { type: "chat-reply" }>): AppState {
  const message = state.chat.messages[action.messageIndex];
  if (!message || message.role !== "user" || message.text !== action.originalText) throw Error("This conversation changed. Please try again.");
  if (action.contextSnapshot && !validRecentChat(state, action.messageIndex, action.contextSnapshot, action.memorySnapshot.map(({ id }) => id))) throw Error("This conversation changed. Please try again.");
  if (action.memorySnapshot.length > 3 || action.memorySnapshot.some((snapshot) => !state.memories.some((memory) => memory.id === snapshot.id && memory.aiAllowed && memory.text === snapshot.text))) throw Error("A memory changed while the dog was replying. Please try again.");
  if (action.memorySuggestion && (!action.memorySuggestion.quote.trim() || action.memorySuggestion.quote.includes("?") || !action.originalText.includes(action.memorySuggestion.quote))) throw Error("The suggested memory is not a statement in your message.");
  const reply = action.reply.trim();
  if (!reply || reply.length > 600 || state.chat.messages.length >= 200) throw Error("The reply could not be saved.");
  const duplicate = action.memorySuggestion && state.memories.some((memory) => memory.text.trim().toLocaleLowerCase() === action.memorySuggestion!.quote.trim().toLocaleLowerCase());
  return { ...state, chat: { ...state.chat, messages: [...state.chat.messages,
    { role: "dog", text: reply, sourceIds: action.memorySnapshot.map((memory) => memory.id),
      contextUserIndices: [...new Set([action.messageIndex, ...(action.contextSnapshot ?? []).flatMap((entry) => entry.role === "user" ? [entry.index] : entry.contextUserIndices ?? [])])],
      contextUnknown: (action.contextSnapshot ?? []).some((entry) => entry.role === "dog" && (!entry.contextUserIndices || entry.contextUnknown)),
      ...(action.memorySuggestion && !duplicate ? { memorySuggestion: { ...action.memorySuggestion, sourceIndex: action.messageIndex } } : {}),
      ...(action.offerQuest ? { questSuggestion: { sourceIndex: action.messageIndex } } : {}) }] } };
}

function editMemory(state: AppState, action: Extract<Action, { type: "edit-memory" }>): AppState {
  const text = action.text.trim();
  if (!text || text.length > 4000) throw Error("Memory must contain 1–4000 characters.");
  const memory = state.memories.find((entry) => entry.id === action.id);
  if (!memory) throw Error("Memory no longer exists.");
  if (memory.text === text) return state;
  const cleared = forgetReference(state, action.id);
  return { ...cleared, memories: cleared.memories.map((entry) => entry.id === action.id ? { ...entry, text } : entry) };
}

function clearReflectionPrompt(state: AppState, questId?: string): AppState {
  const wasPending = questId && state.chat.pendingReflections.includes(questId);
  const chat = { ...state.chat, pendingReflections: state.chat.pendingReflections.filter((id) => id !== questId) };
  return { ...state, chat: wasPending ? withFollowUps(chat, [...new Set([...followUpIds(chat), questId])]) : chat };
}

function acceptPlannedQuest(state: AppState, action: Extract<Action, { type: "accept-planned-quest" }>): AppState {
  if (state.chat.phase !== "ready" || state.chat.goal !== action.commitment.title) throw Error("This conversation changed. Please plan again.");
  if (JSON.stringify(previousQuestContext(state)) !== JSON.stringify(action.previousQuest)) throw Error("The completed quest changed. Please plan again.");
  if (action.quest.planner === "local" && action.previousQuest?.title) {
    const prior = state.quests.find((quest) => quest.id === action.previousQuest!.id);
    if (prior?.sourceIds.some((id) => id !== prior.commitmentId && !action.memorySnapshot.some((memory) => memory.id === id))) throw Error("The completed quest evidence changed. Please plan again.");
  }
  const future = action.quest.futureSteps ?? [];
  if (action.commitment.effortMinutes && action.quest.minutes + future.reduce((total, step) => total + step.minutes, 0) > action.commitment.effortMinutes) throw Error("The plan exceeds your total effort. Change it or plan again.");
  if (state.settings.questMinuteLimit && future.some((step) => step.minutes > state.settings.questMinuteLimit)) throw Error("A future step exceeds your current length limit. Please plan again.");
  if (action.consumesSavedPlan) validateSavedPlan(state, action);
  const planned = apply(state, { ...action, type: "add-planned-quest", quest: { ...action.quest, priorQuestId: action.previousQuest?.id } });
  const accepted = apply(planned, { type: "quest-status", id: action.quest.id, status: "accepted" });
  const consumed = action.consumesSavedPlan ? { ...accepted, quests: accepted.quests.map((quest) => quest.id === action.previousQuest?.id ? { ...quest, futureSteps: undefined } : quest) } : accepted;
  const remaining = action.previousQuest ? followUpIds(consumed.chat).filter((id) => id !== action.previousQuest!.id) : followUpIds(consumed.chat);
  return changeChat({ ...consumed, chat: withFollowUps(consumed.chat, remaining) }, { type: "chat-reset" });
}

function validateSavedPlan(state: AppState, action: Extract<Action, { type: "accept-planned-quest" }>) {
  const previous = state.quests.find((quest) => quest.id === action.previousQuest?.id);
  const steps = previous?.futureSteps;
  const actual = [{ title: action.quest.title, reason: action.quest.reason, minutes: action.quest.minutes }, ...(action.quest.futureSteps ?? [])];
  if (!steps?.length) throw Error("The saved plan changed. Please review it again.");
  if (!action.savedPlanSnapshot) {
    if (JSON.stringify(steps) !== JSON.stringify(actual)) throw Error("The saved plan changed. Please review it again.");
    return;
  }
  const edited = action.quest.title !== steps[0].title;
  const expectedReason = edited ? "You edited this quest before accepting it." : steps[0].reason;
  const expectedFuture = edited ? [] : steps.slice(1);
  if (JSON.stringify(steps) !== JSON.stringify(action.savedPlanSnapshot) || action.quest.reason !== expectedReason ||
    JSON.stringify(action.quest.futureSteps ?? []) !== JSON.stringify(expectedFuture)) throw Error("The saved plan changed. Please review it again.");
}

function forgetReference(state: AppState, id: string): AppState {
  return { ...state, chat: { ...state.chat, messages: state.chat.messages.map((message) => message.sourceIds?.includes(id)
    ? { ...message, text: "This reply was removed because a supporting memory changed.", sourceIds: [], memorySuggestion: undefined, questSuggestion: undefined } : message) },
    quests: state.quests.map((quest) => quest.sourceIds.includes(id)
    ? { ...quest, title: quest.planner === "local" ? "Review this quest" : quest.title, sourceIds: quest.sourceIds.filter((source) => source !== id), reason: "A supporting memory was removed from personalization.", futureSteps: undefined }
    : quest) };
}

export function reduce(state: AppState, action: Action): AppState {
  const next = apply(state, action);
  if (next.pet.adopted && !next.pet.name.trim()) throw Error("Give your dog a name.");
  return stateSchema.parse(next);
}
