import { Solar, Lunar } from 'lunar-javascript';

export interface PillarData {
  gan: string;       // 天干
  zhi: string;       // 地支
  elementGan: string;// 天干五行
  elementZhi: string;// 地支五行
  yinYangGan: string;// 天干阴阳
  yinYangZhi: string;// 地支阴阳
  tenShenGanId: string; // 天干十神
  naYin: string;     // 纳音
  hideGan: string[]; // 支藏干
  shiErChangSheng: string; // 十二长生
  tenShenZhi: string[];    // 支藏干十神
}

export interface ElementStats {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaziChart {
  yearPillar: PillarData;
  monthPillar: PillarData;
  dayPillar: PillarData;
  hourPillar: PillarData;
  dayOwner: string;      // 日生干(日主)
  dayOwnerElement: string; // 日主五行
  dayOwnerYinYang: string; // 日主阴阳
  elementStats: ElementStats;
  strengthState: string;  // 身强/身弱/中和
  favorableElements: string[]; // 喜用神
  unfavorableElements: string[]; // 忌神
}

export interface MonthlyFlowInteraction {
  type: 'clash' | 'punishment' | 'harm' | 'union' | 'other';
  title: string;
  source: string; // "流年" | "流月"
  natalPillar: string; // "年柱" | "月柱" | "日柱" | "时柱"
  description: string;
}

export interface MonthFortuneInput {
  targetYear: number;
  targetMonth: number;
}

export interface MonthlyFlowData {
  flowYearName: string; // e.g. "丙午"
  flowMonthName: string;// e.g. "壬辰"
  flowYearGanTenShen: string;
  flowMonthGanTenShen: string;
  solarTermRange: string; // 当月节气区间
  interactions: MonthlyFlowInteraction[];
}

// Stems & Branches properties maps
export const STEM_ELEMENT: { [key: string]: string } = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

export const STEM_YIN_YANG: { [key: string]: string } = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴'
};

export const BRANCH_ELEMENT: { [key: string]: string } = {
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '亥': '水', '子': '水',
  '辰': '土', '戌': '土', '丑': '土', '未': '土'
};

export const BRANCH_YIN_YANG: { [key: string]: string } = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// Five Elements Relationship Utilities
export function getElementRelation(source: string, target: string): 'producer' | 'receiver' | 'controller' | 'controlled' | 'same' {
  // Return what target element does to source element (Day Owner is source)
  const relations: { [key: string]: { producers: string[], controllers: string[] } } = {
    '木': { producers: ['水'], controllers: ['金'] },
    '火': { producers: ['木'], controllers: ['水'] },
    '土': { producers: ['火'], controllers: ['木'] },
    '金': { producers: ['土'], controllers: ['火'] },
    '水': { producers: ['金'], controllers: ['土'] }
  };

  if (source === target) return 'same';
  if (relations[source].producers.includes(target)) return 'receiver'; // Target produces source (Resource / 印)
  if (relations[target]?.producers.includes(source)) return 'producer'; // Source produces target (Expression / 食伤)
  if (relations[source].controllers.includes(target)) return 'controller'; // Target controls source (Status / 官)
  return 'controlled'; // Source controls target (Wealth / 财)
}

// Calculate Ten Gods manually for robust fallback and consistent representation
export function calculateTenShen(dayGan: string, compareGan: string): string {
  if (!dayGan || !compareGan) return '';
  const dayElem = STEM_ELEMENT[dayGan];
  const compElem = STEM_ELEMENT[compareGan];
  const dayYY = STEM_YIN_YANG[dayGan];
  const compYY = STEM_YIN_YANG[compareGan];
  
  const isSamePol = dayYY === compYY;
  const rel = getElementRelation(dayElem, compElem);

  switch (rel) {
    case 'same':
      return isSamePol ? '比肩' : '劫财';
    case 'receiver': // 生我者为印星
      return isSamePol ? '偏印' : '正印';
    case 'producer': // 我生者为食伤
      return isSamePol ? '食神' : '伤官';
    case 'controller': // 克我者为官杀
      return isSamePol ? '七杀' : '正官';
    case 'controlled': // 我克者为财星
      return isSamePol ? '偏财' : '正财';
    default:
      return '';
  }
}

// Calculate BaZi from Solar date
export function computeBaziChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  isLunar: boolean = false,
  isLeapLunar: boolean = false
): BaziChart {
  let lunar: Lunar;
  if (isLunar) {
    lunar = Lunar.fromYmdHms(year, month, day, hour, minute, 0);
  } else {
    const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
    lunar = solar.getLunar();
  }

  const eightChar = lunar.getEightChar();
  const dayGan = eightChar.getDayGan();

  // Helper to construct PillarData
  const buildPillar = (pillarType: 'year' | 'month' | 'day' | 'hour'): PillarData => {
    let gan = '';
    let zhi = '';
    let hideGan: string[] = [];
    let naYin = '';
    let shiErChangSheng = '';
    let tenShenGan = '';
    let tenShenZhi: string[] = [];

    switch (pillarType) {
      case 'year':
        gan = eightChar.getYearGan();
        zhi = eightChar.getYearZhi();
        hideGan = eightChar.getYearHideGan();
        naYin = eightChar.getYearNaYin();
        shiErChangSheng = eightChar.getYearDiShi();
        tenShenGan = eightChar.getYearShiShenGan();
        tenShenZhi = eightChar.getYearShiShenZhi();
        break;
      case 'month':
        gan = eightChar.getMonthGan();
        zhi = eightChar.getMonthZhi();
        hideGan = eightChar.getMonthHideGan();
        naYin = eightChar.getMonthNaYin();
        shiErChangSheng = eightChar.getMonthDiShi();
        tenShenGan = eightChar.getMonthShiShenGan();
        tenShenZhi = eightChar.getMonthShiShenZhi();
        break;
      case 'day':
        gan = eightChar.getDayGan();
        zhi = eightChar.getDayZhi();
        hideGan = eightChar.getDayHideGan();
        naYin = eightChar.getDayNaYin();
        shiErChangSheng = eightChar.getDayDiShi();
        tenShenGan = '日主';
        tenShenZhi = eightChar.getDayShiShenZhi();
        break;
      case 'hour':
        gan = eightChar.getTimeGan();
        zhi = eightChar.getTimeZhi();
        hideGan = eightChar.getTimeHideGan();
        naYin = eightChar.getTimeNaYin();
        shiErChangSheng = eightChar.getTimeDiShi();
        tenShenGan = eightChar.getTimeShiShenGan();
        tenShenZhi = eightChar.getTimeShiShenZhi();
        break;
    }

    // Manual recalculation of Ten Gods if sdk list is empty or inconsistent
    const tenShenGanId = pillarType === 'day' ? '日主' : (tenShenGan || calculateTenShen(dayGan, gan));
    const finalTenShenZhi = tenShenZhi.length > 0 ? tenShenZhi : hideGan.map(g => calculateTenShen(dayGan, g));

    return {
      gan,
      zhi,
      elementGan: STEM_ELEMENT[gan],
      elementZhi: BRANCH_ELEMENT[zhi],
      yinYangGan: STEM_YIN_YANG[gan],
      yinYangZhi: BRANCH_YIN_YANG[zhi],
      tenShenGanId,
      naYin,
      hideGan,
      shiErChangSheng,
      tenShenZhi: finalTenShenZhi
    };
  };

  const yearPillar = buildPillar('year');
  const monthPillar = buildPillar('month');
  const dayPillar = buildPillar('day');
  const hourPillar = buildPillar('hour');

  // Element occurrence calculation
  const elementStats: ElementStats = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const addElementWeight = (elem: string, weight: number = 1) => {
    if (elem === '木') elementStats.wood += weight;
    if (elem === '火') elementStats.fire += weight;
    if (elem === '土') elementStats.earth += weight;
    if (elem === '金') elementStats.metal += weight;
    if (elem === '水') elementStats.water += weight;
  };

  // 4 pillars heaven stems check (gives weight 1.5)
  [yearPillar.elementGan, monthPillar.elementGan, dayPillar.elementGan, hourPillar.elementGan].forEach(e => addElementWeight(e, 1.5));
  // 4 pillars earthly branches check (gives weight 2.0 because monthly branch represents the Season Leader!)
  addElementWeight(yearPillar.elementZhi, 1.2);
  addElementWeight(monthPillar.elementZhi, 2.5); // Monthly branches (月令) has significant weight in Bazi
  addElementWeight(dayPillar.elementZhi, 1.5);
  addElementWeight(hourPillar.elementZhi, 1.2);

  // Hidden stems gives minor weight 0.3
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    p.hideGan.forEach(g => addElementWeight(STEM_ELEMENT[g], 0.3));
  });

  // Calculate self strength heuristic
  const dayOwnerElement = STEM_ELEMENT[dayGan];
  const dayOwnerYinYang = STEM_YIN_YANG[dayGan];
  
  // Is supported by monthly branch (得令)?
  const monthZhi = monthPillar.zhi;
  let deLing = false;
  if (dayOwnerElement === '木' && ['寅', '卯', '亥', '子'].includes(monthZhi)) deLing = true;
  if (dayOwnerElement === '火' && ['巳', '午', '寅', '卯'].includes(monthZhi)) deLing = true;
  if (dayOwnerElement === '土' && ['巳', '午', '辰', '戌', '丑', '未'].includes(monthZhi)) deLing = true;
  if (dayOwnerElement === '金' && ['申', '酉', '辰', '戌', '丑', '未'].includes(monthZhi)) deLing = true;
  if (dayOwnerElement === '水' && ['亥', '子', '申', '酉'].includes(monthZhi)) deLing = true;

  // Let's count support elements in our natal chart (producing elements + same elements)
  let supportScores = 0;
  let drainingScores = 0;
  
  const producersMap: { [key: string]: string } = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const producingElem = producersMap[dayOwnerElement];

  const sameWeight = elementStats[dayOwnerElement === '木' ? 'wood' : dayOwnerElement === '火' ? 'fire' : dayOwnerElement === '土' ? 'earth' : dayOwnerElement === '金' ? 'metal' : 'water'];
  const producingWeight = elementStats[producingElem === '木' ? 'wood' : producingElem === '火' ? 'fire' : producingElem === '土' ? 'earth' : producingElem === '金' ? 'metal' : 'water'];
  
  const supportingWeight = sameWeight + producingWeight;
  const totalWeights = elementStats.wood + elementStats.fire + elementStats.earth + elementStats.metal + elementStats.water;
  const supportRatio = supportingWeight / totalWeights;

  let strengthState = '中和';
  if (deLing) {
    strengthState = supportRatio > 0.45 ? '身强' : '中和';
  } else {
    strengthState = supportRatio > 0.52 ? '身强' : '身弱';
  }

  // Favorable Elements (喜用神) and Unfavorable Elements (忌神)
  let favorableElements: string[] = [];
  let unfavorableElements: string[] = [];

  const elementsList = ['木', '火', '土', '金', '水'];
  if (strengthState === '身强') {
    // Strong self needs drainage (produced by self) or control (controlling self) or wealth (controlled by self)
    // Wood strong needs Fire, Metal, Earth
    // Fire strong needs Earth, Water, Metal
    // Earth strong needs Metal, Wood, Water
    // Metal strong needs Water, Fire, Wood
    // Water strong needs Wood, Earth, Fire
    const controllersMap: { [key: string]: string } = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
    const drainingElem = Object.keys(producersMap).find(key => producersMap[key] === dayOwnerElement)!; // Wood -> Fire
    const controllingElem = controllersMap[dayOwnerElement];
    const controlledElem = Object.keys(controllersMap).find(key => controllersMap[key] === dayOwnerElement)!; // Wood -> Earth

    favorableElements = [drainingElem, controllingElem, controlledElem];
    unfavorableElements = [dayOwnerElement, producingElem];
  } else if (strengthState === '身弱') {
    // Weak self needs support (producing element) or comrades (same element)
    favorableElements = [producingElem, dayOwnerElement];
    unfavorableElements = elementsList.filter(e => !favorableElements.includes(e));
  } else {
    // Balanced needs tuning: find the weakest element to supplement
    const items = Object.entries(elementStats).map(([key, val]) => {
      const name = key === 'wood' ? '木' : key === 'fire' ? '火' : key === 'earth' ? '土' : key === 'metal' ? '金' : '水';
      return { name, val };
    });
    items.sort((a, b) => a.val - b.val);
    favorableElements = [items[0].name, items[1].name];
    unfavorableElements = [items[4].name];
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayOwner: dayGan,
    dayOwnerElement,
    dayOwnerYinYang,
    elementStats,
    strengthState,
    favorableElements,
    unfavorableElements
  };
}

// Calculate Flow interaction for selected target month
export function calculateMonthlyFlow(
  chart: BaziChart,
  targetYear: number,
  targetMonth: number
): MonthlyFlowData {
  // Get mid of the selected month to represent target flow Month Pillar (avoid boundary HMR shifts)
  const targetSolar = Solar.fromYmdHms(targetYear, targetMonth, 15, 12, 0, 0);
  const targetLunar = targetSolar.getLunar();
  const targetEightChar = targetLunar.getEightChar();

  const flowYearGan = targetEightChar.getYearGan();
  const flowYearZhi = targetEightChar.getYearZhi();
  const flowMonthGan = targetEightChar.getMonthGan();
  const flowMonthZhi = targetEightChar.getMonthZhi();

  const flowYearName = `${flowYearGan}${flowYearZhi}`;
  const flowMonthName = `${flowMonthGan}${flowMonthZhi}`;

  const flowYearGanTenShen = calculateTenShen(chart.dayPillar.gan, flowYearGan);
  const flowMonthGanTenShen = calculateTenShen(chart.dayPillar.gan, flowMonthGan);

  // Set standard solar term labels
  // targetMonth 4 corresponds to lunar terms
  const monthTerms: { [key: number]: string } = {
    1: '立春 - 惊蛰',
    2: '惊蛰 - 清明',
    3: '清明 - 立夏',
    4: '立夏 - 芒种',
    5: '芒种 - 小暑',
    6: '小暑 - 立秋',
    7: '立秋 - 白露',
    8: '白露 - 寒露',
    9: '寒露 - 立冬',
    10: '立冬 - 大雪',
    11: '大雪 - 小寒',
    12: '小寒 - 立春'
  };
  const solarTermRange = monthTerms[targetMonth] || '整月区间';

  const interactions: MonthlyFlowInteraction[] = [];

  const natalPillars = [
    { name: '年柱', zhi: chart.yearPillar.zhi, gan: chart.yearPillar.gan },
    { name: '月柱', zhi: chart.monthPillar.zhi, gan: chart.monthPillar.gan },
    { name: '日柱', zhi: chart.dayPillar.zhi, gan: chart.dayPillar.gan },
    { name: '时柱', zhi: chart.hourPillar.zhi, gan: chart.hourPillar.gan }
  ];

  // Stem Combinations & Clashes
  const STEM_UNIONS: { [key: string]: { partner: string, result: string } } = {
    '甲': { partner: '己', result: '土' }, '己': { partner: '甲', result: '土' },
    '乙': { partner: '庚', result: '金' }, '庚': { partner: '乙', result: '金' },
    '丙': { partner: '辛', result: '水' }, '辛': { partner: '丙', result: '水' },
    '丁': { partner: '壬', result: '木' }, '壬': { partner: '丁', result: '木' },
    '戊': { partner: '癸', result: '火' }, '癸': { partner: '戊', result: '火' },
  };

  const STEM_CLASHES: { [key: string]: string[] } = {
    '甲': ['庚'], '乙': ['辛'], '丙': ['壬'], '丁': ['癸'],
    '庚': ['甲'], '辛': ['乙'], '壬': ['丙'], '癸': ['丁']
  };

  // Branch Clashes (六冲)
  const BRANCH_CLASHES: { [key: string]: string } = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
  };

  // Branch Unions (六合)
  const BRANCH_UNIONS: { [key: string]: { partner: string, result: string } } = {
    '子': { partner: '丑', result: '土' }, '丑': { partner: '子', result: '土' },
    '寅': { partner: '亥', result: '木' }, '亥': { partner: '寅', result: '木' },
    '卯': { partner: '戌', result: '火' }, '戌': { partner: '卯', result: '火' },
    '辰': { partner: '酉', result: '金' }, '酉': { partner: '辰', result: '金' },
    '巳': { partner: '申', result: '水' }, '申': { partner: '巳', result: '水' },
    '午': { partner: '未', result: '土' }, '未': { partner: '午', result: '土' }
  };

  // Branch Harms (六害)
  const BRANCH_HARMS: { [key: string]: string } = {
    '子': '未', '未': '子',
    '丑': '午', '午': '丑',
    '寅': '巳', '巳': '寅',
    '卯': '辰', '辰': '卯',
    '申': '亥', '亥': '申',
    '酉': '戌', '戌': '酉'
  };

  // Check flow year & flow month against natal chart
  const checkBranchInteractions = (flowZhi: string, source: '流年' | '流月') => {
    natalPillars.forEach(p => {
      // Hexa-Clash
      if (BRANCH_CLASHES[flowZhi] === p.zhi) {
        interactions.push({
          type: 'clash',
          title: `地支六冲【${flowZhi}${p.zhi}冲】`,
          source,
          natalPillar: p.name,
          description: `本期${source}地支与您的${p.name}地支发生激烈冲战。往往伴随环境变动、出行频率增加或内心张力。宜稳字当头，凡事缓一步决策。`
        });
      }

      // Hexa-Union
      if (BRANCH_UNIONS[flowZhi]?.partner === p.zhi) {
        const res = BRANCH_UNIONS[flowZhi].result;
        interactions.push({
          type: 'union',
          title: `地支六合【${flowZhi}${p.zhi}合化${res}】`,
          source,
          natalPillar: p.name,
          description: `本期${source}地支与您的${p.name}地支完美契合。代表有生机勃勃的人际纽带、贵人暗中相助或合作契机。情感与合作适宜推进。`
        });
      }

      // Hexa-Harm
      if (BRANCH_HARMS[flowZhi] === p.zhi) {
        interactions.push({
          type: 'harm',
          title: `地支六害【${flowZhi}${p.zhi}相害】`,
          source,
          natalPillar: p.name,
          description: `本期${source}地支与您的${p.name}地支产生妨害磁场。注意避开人际小误会，谨言慎行，防止好心帮倒忙或情绪压抑。`
        });
      }

      // Self-punishments / Self Clashes
      if (flowZhi === p.zhi && ['辰', '午', '酉', '亥'].includes(flowZhi)) {
        interactions.push({
          type: 'punishment',
          title: `地支自刑【${flowZhi}${p.zhi}自刑】`,
          source,
          natalPillar: p.name,
          description: `本期您的${p.name}地支与${source}发生了重叠自刑。容易有纠结、自我施压、钻牛角尖的心态，宜多安排休闲放空，别给自己过高要求。`
        });
      }
    });
  };

  const checkStemInteractions = (flowGan: string, source: '流年' | '流月') => {
    natalPillars.forEach(p => {
      // Heaven Stem Union
      if (STEM_UNIONS[flowGan]?.partner === p.gan) {
        const res = STEM_UNIONS[flowGan].result;
        interactions.push({
          type: 'union',
          title: `天干五合【${flowGan}${p.gan}合化${res}】`,
          source,
          natalPillar: p.name,
          description: `本期${source}天干与您的${p.name}天干交合。代表外部有不错的机缘，计划可顺利开展，心境和顺多喜悦。`
        });
      }

      // Heaven Stem Clash
      if (STEM_CLASHES[flowGan]?.includes(p.gan)) {
        interactions.push({
          type: 'clash',
          title: `天干战克【${flowGan}${p.gan}相冲】`,
          source,
          natalPillar: p.name,
          description: `本期${source}天干冲克了您的${p.name}天干。代表事业或外部环境有突发事务，宜克制性子，踏实应对，以静制动。`
        });
      }
    });
  };

  // Run checks for flow year
  checkBranchInteractions(flowYearZhi, '流年');
  checkStemInteractions(flowYearGan, '流年');

  // Run checks for flow month
  checkBranchInteractions(flowMonthZhi, '流月');
  checkStemInteractions(flowMonthGan, '流月');

  return {
    flowYearName,
    flowMonthName,
    flowYearGanTenShen,
    flowMonthGanTenShen,
    solarTermRange,
    interactions
  };
}
