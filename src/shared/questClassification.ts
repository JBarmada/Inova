import type { Commitment, Quest } from "./schema";

const topics = {
  romance: { label: "Romance", match: /\b(date night|first date|(?:go on|plan) a date|romantic|valentine|anniversary dinner|ask .{1,40} (?:out|on a date)|love letter|dating profile)\b/i },
  nature: { label: "Nature", match: /\b(touch grass|plant (?:a |the |some )?(?:native )?(?:trees?|seeds?|flowers?)|tree planting|garden(?:ing)?|nature walk|hike|(?:trail|community|street|beach|park) clean[ -]?up|clean up .{0,18}(?:beach|park|trail)|pick(?:ed)? up litter|pick up trash|water .{0,18}plants?)\b/i },
  study: { label: "Academic study", match: /\b(stud(?:y|ying|ied)|homework|coursework|lecture notes|textbooks?|quiz|quizzes|exams?|midterms?|flashcards?|class notes|review .{0,20}(?:class|chapter)|read .{0,18}(?:book|chapter|article)|practice problems)\b/i },
  career: { label: "Career", match: /\b(job applications?|apply for .{0,22}(?:jobs?|internships?)|job interviews?|resume|cv|networking event|career fair|professional headshots?|business attire|linkedin|cover letters?)\b/i },
  posture: { label: "Posture and mobility", match: /\b(posture|ergonomic|desk setup|mobility break|stretch (?:my |your )?(?:back|shoulders|neck)|standing desk)\b/i },
  swamp: { label: "Swamp chores", match: /\b(swamp|mud bath|bake .{0,18}onion|onion rings?|declutter .{0,20}(?:room|desk)|clean my room|organize my room)\b/i },
  music: { label: "Music", match: /\b(music|sing(?:ing)?|choir|rehearse .{0,16}song|learn .{0,18}song|guitar|piano|karaoke|playlists?|dance rehearsal|concert)\b/i },
  gaming: { label: "Video games", match: /\b(video games?|gaming|nintendo|pokemon|minecraft|steam game|play .{0,20}(?:mario|zelda)|playstation|xbox|game campaign|speedruns?)\b/i },
  fortnite: { label: "Fortnite", match: /\b(fortnite|victory royale)\b/i },
  precision: { label: "Precision practice", match: /\b(aim training|one[ -]?taps?|precision practice|accuracy drills?|typing accuracy|accuracy in valorant|valorant (?:aim|accuracy|precision))\b/i },
  gifts: { label: "Gift giving", match: /\b((?:give|wrap|buy|pick|make|deliver|send|choose) .{0,28}(?:gifts?|presents?)|gift exchange|secret santa|gift shopping)\b/i },
  canada: { label: "Canadian pastime", match: /\b(poutine|maple syrup|maple taffy|tim hortons|ice hockey|toque|canada day|canadian hockey)\b/i },
  gratitude: { label: "Gratitude", match: /\b(thanksgiving|gratitude|thankful|thank[ -]?you|thank (?:a|my|the|your)|appreciation (?:note|letter))\b/i },
  ufc: { label: "UFC attendance", match: /^(?:(?:attend|go to|went to|heading to)\b.{0,30}\b(?:ufc|mma|mixed martial arts)\b|(?:watch|see|go watch)\b.{0,24}\b(?:ufc|mma|mixed martial arts)\b.{0,35}\bin person\b)/i },
  barbie: { label: "Barbie", match: /\b(barbie|fairytopia|dreamhouse|kenough|barbenheimer)\b/i },
  nuggets: { label: "Nugget run", match: /\b(mcdonald(?:'?s)?|mc[ -]?nuggets?|chicken nuggets?)\b/i },
  dinner: { label: "Korean food or cooking", match: /\b(korean (?:bbq|barbecue|food|cooking|dinner)|k[ -]?bbq|kimchi|tteokbokki|bibimbap|kimbap)\b/i },
  civic: { label: "Civic engagement", match: /\b(city council|town hall|public meeting|register to vote|voter registration|write .{0,18}(?:representative|senator)|civic volunteering|visit .{0,18}(?:capitol|white house))\b/i },
  impressions: { label: "Voices and puppets", match: /\b(elmo|sesame street|voice acting|voice impressions?|puppet(?:s|ry| show)?)\b/i },
  animals: { label: "Animal care", match: /\b(animal shelter|animal rescue|pet adoption|walk .{0,16}dog|foster .{0,16}(?:cat|dog|kitten|puppy))\b/i },
  courage: { label: "Courage challenge", match: /\b(public speaking|give .{0,18}speech|first presentation|stage fright|face .{0,16}fear|step outside .{0,12}comfort zone)\b/i },
  flowers: { label: "Flowers and plants", match: /\b(bouquets?|floral arrangement|flower shop|flower garden|flowers?|water .{0,16}plants?|repot .{0,16}plant)\b/i },
  strategy: { label: "Strategy and puzzles", match: /\b(chess|escape room|puzzles?|strategy games?|valorant (?:strategy|smokes?|lineups?)|practice .{0,18}(?:lineups?|smokes?) in valorant)\b/i },
  maker: { label: "Making and repair", match: /\b(arduino|robot(?:s|ics)?|solder(?:ing)?|electronics|prototype|3d print|hackathon|fix .{0,16}(?:gadget|keyboard|controller)|debug .{0,16}(?:code|program))\b/i },
  league: { label: "League of Legends", match: /\b(league of legends|ahri|summoner'?s rift|win .{0,18}league match)\b/i },
  exploring: { label: "Exploration", match: /\b(scout(?:ing)?|explor(?:e|ing) .{0,22}(?:trail|neighbou?rhood|museum|park)|try .{0,15}new route|find .{0,15}mushroom|orienteering)\b/i },
  goth: { label: "Goth and spooky projects", match: /\b(goth(?:ic)?|haunted house|halloween costume|spooky playlist|horror (?:film|movie)|ghost tour)\b/i },
  discord: { label: "Online community", match: /\b(discord|community server|host .{0,16}game night|organize .{0,16}online meetup)\b/i },
} as const;

type Topic = keyof typeof topics;
export type QuestCategory = Topic | "general";
export const questCategoryLabel = (category: QuestCategory) => category === "general" ? "General" : topics[category].label;

function titleForMatching(title: string) {
  return title.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

export function classifyQuest(quest: Pick<Quest, "title" | "commitmentId">, commitments: readonly Commitment[]): QuestCategory[] {
  const title = titleForMatching(quest.title);
  const source = titleForMatching(commitments.find(({ id }) => id === quest.commitmentId)?.title ?? "");
  const categories = (Object.keys(topics) as Topic[]).filter((topic) =>
    topic !== "ufc" && (topics[topic].match.test(title) || topics[topic].match.test(source)));
  if (isUfcAttendance(title, source)) {
    categories.push("ufc");
  }
  const specificGaming = categories.includes("fortnite") || categories.includes("league");
  const matched = specificGaming ? categories.filter((category) => category !== "gaming") : categories;
  return matched.length > 0 ? matched : ["general"];
}

function isUfcAttendance(title: string, source: string) {
  if (/\b(?:watch|viewing) party\b/i.test(title)) return false;
  return topics.ufc.match.test(title) || (
    /\b(?:ufc|mma|mixed martial arts)\b/i.test(source)
    && /^(?:attend|go to|went to|heading to)\b.{0,24}\b(?:event|main card|fight card|prelims)\b/i.test(title)
  );
}
