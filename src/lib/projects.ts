export type MediaItem =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "youtube"; id: string; caption?: string };

export type CodeSnippet = {
  language: "cpp" | "python";
  title?: string;
  code: string;
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  tags: string[];
  cover: string;
  overview: string;
  responsibilities: string[];
  media: MediaItem[];
  snippets: CodeSnippet[];
};

export const projects: Project[] = [
  {
    slug: "directional-parry-system",
    title: "Directional Parry System",
    role: "Combat Designer",
    year: "2025",
    summary:
      "A frame-perfect directional parry with stagger, posture, and riposte windows tuned for melee duels.",
    tags: ["UE5", "C++", "Combat", "Animation"],
    cover:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    overview:
      "I designed and prototyped a directional parry mechanic inspired by classic souls-likes. Players match the incoming attack angle within a 180ms window to trigger a posture break and a contextual riposte. Tuning focused on readable telegraphs, recovery cancels, and counter-pressure pacing.",
    responsibilities: [
      "Authored combat state machine in C++ with Blueprint-exposed tuning knobs.",
      "Worked with animators to define parry, stagger, and riposte clips.",
      "Tuned timing windows across 12 enemy archetypes via playtest data.",
    ],
    media: [
      {
        type: "youtube",
        id: "dQw4w9WgXcQ",
        caption: "Gameplay capture — duel vs. greatsword enemy.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=80",
        alt: "Parry timing diagram",
        caption: "Parry timing window diagram.",
      },
    ],
    snippets: [
      {
        language: "cpp",
        title: "ParryComponent.cpp",
        code: `bool UParryComponent::TryParry(const FAttackInfo& Attack)
{
    const float Delta = GetWorld()->GetTimeSeconds() - ParryStartTime;
    if (Delta > ParryWindow) return false;

    const float AngleDiff = FMath::Abs(
        FMath::FindDeltaAngleDegrees(GuardDirection, Attack.IncomingAngle));

    if (AngleDiff <= DirectionalTolerance)
    {
        OnParrySuccess.Broadcast(Attack);
        ApplyPostureDamage(Attack.Source, PostureBreakAmount);
        return true;
    }
    return false;
}`,
      },
    ],
  },
  {
    slug: "adaptive-enemy-ai",
    title: "Adaptive Enemy AI",
    role: "Technical / Combat Designer",
    year: "2025",
    summary:
      "Utility-AI driven enemies that adapt aggression based on the player's recent combat behavior.",
    tags: ["Python", "Utility AI", "Behavior Trees"],
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Enemies sample the player's last 20 actions and re-weight utility scores for aggressive, defensive, and flanking branches. Designed in Python tooling, exported to engine as data tables.",
    responsibilities: [
      "Authored utility curves and tuning tool in Python.",
      "Designed encounter pacing rules across three biomes.",
      "Ran A/B playtests to validate adaptation feels fair, not unfair.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
        alt: "AI utility curve editor",
      },
    ],
    snippets: [
      {
        language: "python",
        title: "utility_ai.py",
        code: `def score_action(action, context):
    """Score an action 0..1 based on weighted context curves."""
    score = 1.0
    for axis, curve in action.curves.items():
        value = context.get(axis, 0.0)
        score *= curve.evaluate(value)
    return score * action.base_weight


def pick_best(actions, context):
    return max(actions, key=lambda a: score_action(a, context))`,
      },
    ],
  },
  {
    slug: "modular-weapon-framework",
    title: "Modular Weapon Framework",
    role: "Technical Designer",
    year: "2024",
    summary:
      "Data-driven weapon system with hot-swappable movesets, hit reactions, and VFX hooks.",
    tags: ["UE5", "C++", "Data Assets"],
    cover:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Designed a weapon framework where movesets, hit reactions, sounds, and VFX are defined in data assets. Designers can author a new weapon class in under 15 minutes without engineering support.",
    responsibilities: [
      "Authored data asset schema and editor tooling.",
      "Built combo chain resolver with cancel windows.",
      "Documented workflow for the rest of the design team.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1600&q=80",
        alt: "Weapon data asset",
      },
    ],
    snippets: [
      {
        language: "cpp",
        title: "WeaponData.h",
        code: `USTRUCT(BlueprintType)
struct FComboLink
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere) UAnimMontage* Montage = nullptr;
    UPROPERTY(EditAnywhere) float CancelWindowStart = 0.4f;
    UPROPERTY(EditAnywhere) float CancelWindowEnd   = 0.8f;
    UPROPERTY(EditAnywhere) TArray<FName> NextOnInput;
};`,
      },
    ],
  },
  {
    slug: "encounter-balancing-tool",
    title: "Encounter Balancing Tool",
    role: "Tools / Combat Designer",
    year: "2024",
    summary:
      "A Python tool that simulates thousands of encounters to surface difficulty outliers before playtesting.",
    tags: ["Python", "Tooling", "Analytics"],
    cover:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Monte-Carlo simulator that runs 10k synthetic encounters against player loadouts and outputs heatmaps of TTK, deaths, and resource burn. Cut tuning iteration time roughly in half.",
    responsibilities: [
      "Wrote the simulator and CLI in Python.",
      "Integrated with the design team's encounter spreadsheets.",
      "Trained designers on reading the resulting reports.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        alt: "TTK heatmap output",
      },
    ],
    snippets: [
      {
        language: "python",
        title: "simulate.py",
        code: `def simulate_encounter(player, enemies, rng):
    t = 0.0
    while player.hp > 0 and any(e.hp > 0 for e in enemies):
        target = pick_target(enemies, rng)
        dmg = roll_damage(player.weapon, target, rng)
        target.hp -= dmg
        t += player.weapon.swing_time
        for e in enemies:
            if e.hp > 0:
                player.hp -= e.attack(rng)
    return {"ttk": t, "survived": player.hp > 0}`,
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
