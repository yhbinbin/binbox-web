// 主题类型定义
export const themes = ['vaporwave', 'cnretro', 'y2k', 'win95', 'vintage'] as const;

export type Theme = (typeof themes)[number];

// 默认主题
export const defaultTheme: Theme = 'vaporwave';

// 主题元数据
export const themeMetadata: Record<Theme, {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
}> = {
  vaporwave: {
    name: '蒸汽波',
    nameEn: 'Vaporwave',
    description: '霓虹粉青，赛博美学',
    descriptionEn: 'Neon pink & cyan, cyber aesthetics',
    icon: '🌆',
  },
  cnretro: {
    name: '旧核',
    nameEn: 'CN Retro',
    description: '蓝玻璃红横幅，白瓷砖',
    descriptionEn: 'Blue glass, red banner, tiles',
    icon: '🏮',
  },
  y2k: {
    name: '千禧',
    nameEn: 'Y2K',
    description: '科技蓝绿，金属极光',
    descriptionEn: 'Tech blue-green, metallic aurora',
    icon: '💿',
  },
  win95: {
    name: '经典',
    nameEn: 'Win95',
    description: '灰色窗口，蓝天白云',
    descriptionEn: 'Classic gray, blue sky',
    icon: '🖥️',
  },
  vintage: {
    name: '复古',
    nameEn: 'Vintage',
    description: '马卡龙色，意式优雅',
    descriptionEn: 'Macaron tones, Italian elegance',
    icon: '🎞️',
  },
};

// 预留主题位置（未来扩展）
// export const futureThemes = ['cyberpunk', 'synthwave', 'pastel', 'monochrome'] as const;
