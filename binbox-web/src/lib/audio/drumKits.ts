export type DrumKitId = "classic-909" | "jungle-break" | "lofi-vhs";

type DrumKit = {
  id: DrumKitId;
  name: string;
  description: string;
  samples: {
    kick: string;
    snare: string;
    hat: string;
  };
};

export const drumKits: DrumKit[] = [
  {
    id: "classic-909",
    name: "Classic 909",
    description: "Punchy and bright with a crisp hat.",
    samples: {
      kick: "/audio/kits/classic-909/kick.wav",
      snare: "/audio/kits/classic-909/snare.wav",
      hat: "/audio/kits/classic-909/hat.wav",
    },
  },
  {
    id: "jungle-break",
    name: "Jungle Break",
    description: "Loose low-end with snappy ghost hits.",
    samples: {
      kick: "/audio/kits/jungle-break/kick.wav",
      snare: "/audio/kits/jungle-break/snare.wav",
      hat: "/audio/kits/jungle-break/hat.wav",
    },
  },
  {
    id: "lofi-vhs",
    name: "Lo-fi VHS",
    description: "Dusty, soft, and slightly warped.",
    samples: {
      kick: "/audio/kits/lofi-vhs/kick.wav",
      snare: "/audio/kits/lofi-vhs/snare.wav",
      hat: "/audio/kits/lofi-vhs/hat.wav",
    },
  },
];

export const getDrumKit = (id: DrumKitId) =>
  drumKits.find((kit) => kit.id === id) ?? drumKits[0];
