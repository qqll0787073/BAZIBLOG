import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { computeBaziChart, calculateMonthlyFlow, STEM_ELEMENT } from './src/utils/bazi.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent crashes if key is omitted
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not configured. Falling back to structured mock-generator.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. Calculate BaZi endpoints
app.post('/api/bazi/calculate', (req, res) => {
  try {
    const { year, month, day, hour, minute, isLunar, isLeapLunar } = req.body;
    
    if (!year || !month || !day) {
      return res.status(400).json({ error: '请提供出生年、月、日' });
    }

    const chart = computeBaziChart(
      Number(year),
      Number(month),
      Number(day),
      hour !== undefined ? Number(hour) : 12,
      minute !== undefined ? Number(minute) : 0,
      !!isLunar,
      !!isLeapLunar
    );

    return res.json({ success: true, chart });
  } catch (err: any) {
    console.error('Calculation error:', err);
    return res.status(500).json({ error: err.message || '八字排盘计算失败' });
  }
});

// 2. High-Fidelity Monthly AI Fortune with precise contextual Bazi calculations
app.post('/api/bazi/fortune', async (req, res) => {
  try {
    const { year, month, day, hour, minute, isLunar, isLeapLunar, targetYear, targetMonth } = req.body;

    if (!year || !month || !day || !targetYear || !targetMonth) {
      return res.status(400).json({ error: '请完整提供出身信息以及测算的流年流月' });
    }

    // Step a. Calculate natal chart
    const chart = computeBaziChart(
      Number(year),
      Number(month),
      Number(day),
      hour !== undefined ? Number(hour) : 12,
      minute !== undefined ? Number(minute) : 0,
      !!isLunar,
      !!isLeapLunar
    );

    // Step b. Calculate monthly flows
    const flow = calculateMonthlyFlow(chart, Number(targetYear), Number(targetMonth));

    const client = getGeminiClient();

    // Check if client is missing -> render realistic simulated analysis immediately to preserve offline preview usability
    if (!client) {
      const mockResult = generateRealisticMockFortune(chart, flow, Number(targetYear), Number(targetMonth));
      return res.json({
        success: true,
        chart,
        flow,
        fortune: mockResult,
        warning: "检测到未配置 GEMINI_API_KEY。此分析为传统命理引擎自动生成的推算样本。若要获得AI深度定制解析，请在 Settings > Secrets 栏添加 GEMINI_API_KEY 密钥。"
      });
    }

    // Step c. Prepare the system instruction & detailed prompt injecting natal data
    const systemIns = `你是一位精通传统子平八字与现代心理学的资深命理导师。你善于将客观的生克、天干五合、地支刑冲破害等深奥逻辑，转化为温和、建议性强、符合现代社会生活的心理赋能建议。避开宿命论、迷信与极端用词（如血光、必死），采取客观启发的方式。`;

    const instructionsPrompt = `
请结合以下计算好的求测人八字原局、日主喜忌、以及测算流月的数据，为求测人撰写【${targetYear}年${targetMonth}月】的深度个人定制月度运势解析。

求测人八字信息：
- 乾造/坤造 日主天干：${chart.dayOwner}（五行属 ${chart.dayOwnerElement}，${chart.dayOwnerYinYang}性）
- 八字能量格局：${chart.strengthState}
- 喜用五行：${chart.favorableElements.join('、')}
- 忌五行：${chart.unfavorableElements.join('、')}
- 年柱：${chart.yearPillar.gan}${chart.yearPillar.zhi} (纳音: ${chart.yearPillar.naYin})
- 月柱：${chart.monthPillar.gan}${chart.monthPillar.zhi} (纳音: ${chart.monthPillar.naYin})
- 日柱：${chart.dayPillar.gan}${chart.dayPillar.zhi} (纳音: ${chart.dayPillar.naYin})
- 时柱：${chart.hourPillar.gan}${chart.hourPillar.zhi} (纳音: ${chart.hourPillar.naYin})

目标测算流月信息：
- 当前流年：${flow.flowYearName}（流年天干十神：${flow.flowYearGanTenShen}）
- 当前流月：${flow.flowMonthName}（流月天干十神：${flow.flowMonthGanTenShen}）
- 节气区间：${flow.solarTermRange}
- 流月与命盘生克冲刑害事件：
${flow.interactions.length === 0 ? "无显著刑冲合害事件" : flow.interactions.map(i => `  * 【${i.source}】${i.title} 影响您的【${i.natalPillar}】: ${i.description}`).join('\n')}

请按以下格式返回精确、具有文采的 JSON 结果。
包含流月综合指数、总体概述、事业建议、财运建议、感情婚姻规划、身心健康指南，以及特别预测的本月最适宜和最需沉稳的特定日期警示。`;

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: instructionsPrompt,
      config: {
        systemInstruction: systemIns,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['score', 'summary', 'overview', 'career', 'wealth', 'relationship', 'health', 'luckyDays', 'unluckyDays', 'yearlyOverview'],
          properties: {
            score: {
              type: Type.INTEGER,
              description: "本月运势综合指数评分，范围在 40 到 98 之间，通常身强逢喜用得分高，刑冲多或逢忌神得分低。"
            },
            summary: {
              type: Type.STRING,
              description: "一两句话概括本流月的运势基调，富有诗意与哲理，类似黄历箴言。"
            },
            overview: {
              type: Type.STRING,
              description: "本月运势深度总论。从流月干支喜忌、天干十神气场、节气更替对日主情绪、周遭环境的影响做分析。"
            },
            career: {
              type: Type.STRING,
              description: "事业与工作方面的契机、合作发展、压力源以及具体的应对策略或转型建议。"
            },
            wealth: {
              type: Type.STRING,
              description: "财运情况。包括正财、偏财、消费防范、投资或合伙建议、契约签字注意事项。"
            },
            relationship: {
              type: Type.STRING,
              description: "感情、社交与人际运势。包括单身者桃花气场、有伴侣者日常沟通要点、家庭贵人等。"
            },
            health: {
              type: Type.STRING,
              description: "健康与心态。五行失调或偏旺带来的器官保养提示，以及减压排解郁结的心理方案。"
            },
            luckyDays: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "精选本月2-3个吉祥或适合突破的农历/公历特殊日子，并附带简短行为指南，例如：'6月18日：适合商务谈判签约、结拜或合伙。'"
            },
            unluckyDays: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "精选本月2-3个需沉稳静气、减速低调的守成日期。如：'6月24日：流日地支犯冲，忌口舌争执，宜踏实复盘工作。'"
            },
            yearlyOverview: {
              type: Type.STRING,
              description: "本月在全年的战略承接作用，是一两句指明方向的话。"
            }
          }
        }
      }
    });

    const parsedFortune = JSON.parse(response.text.trim());
    return res.json({
      success: true,
      chart,
      flow,
      fortune: parsedFortune
    });

  } catch (err: any) {
    console.error('Fortune generation error:', err);
    return res.status(500).json({ error: err.message || '流月AI祥批解析生成失败' });
  }
});

// Helper: Traditional Mock generator in case of missing API Key, ensuring smooth local workspace preview
function generateRealisticMockFortune(chart: any, flow: any, targetYear: number, targetMonth: number) {
  const isSelfStrong = chart.strengthState === '身强';
  const isMonthFriendly = chart.favorableElements.includes(flow.flowMonthName[0] === '甲' || flow.flowMonthName[0] === '乙' ? '木' :
    flow.flowMonthName[0] === '丙' || flow.flowMonthName[0] === '丁' ? '火' :
    flow.flowMonthName[0] === '戊' || flow.flowMonthName[0] === '己' ? '土' :
    flow.flowMonthName[0] === '庚' || flow.flowMonthName[0] === '辛' ? '金' : '水');

  const baseScore = isMonthFriendly ? 85 : 68;
  const modifier = flow.interactions.length * -4;
  const finalScore = Math.max(50, Math.min(95, baseScore + modifier));

  return {
    score: finalScore,
    summary: `${chart.dayOwner}木/火气场碰撞，月逢【${flow.flowMonthName}】。凡事“守中待时，顺水推舟”可保吉祥。`,
    overview: `本月为${targetYear}年第${targetMonth}个月。由于流月干支为【${flow.flowMonthName}】，属于${STEM_ELEMENT[flow.flowMonthName[0]]}五行秉令。您的日元为【${chart.dayOwner}】，属于${chart.dayOwnerElement}。流月天干与您的日主呈现【${flow.flowMonthGanTenShen}】的关系，代表这段时间在心态和思维上，偏向于寻找安全感和自我反醒。结合能量强弱学说，本月能量起伏均衡。`,
    career: `在事业板块中，由于当月逢【${flow.flowMonthGanTenShen}】主導，您可能会面对诸多细节流程和制度规则的落实。${flow.interactions.length > 0 ? "受地支刑冲影响，工作中常伴有琐碎事务打乱时间表的情况。建议本月采取‘备忘、降速、沟通’的三步方略，不要盲目加码新项目。" : "运势沉稳祥和，是完善既有方案、修复合作关系的优秀周期。多展示敬业态度，会在管理层取得正面反响。"}`,
    wealth: `正财方面有平稳的保障，偏财进账相对较慢。考虑到忌神与喜用之争算，本月最忌投机冒进。合同签约、出借款项请务必在合规前提下亲力亲为。`,
    relationship: `五行磁场相对柔和，单身者可能在志同道合的学习或培训社群中遇到聊得来的对象，但多偏向精神交往，需多加行动拉近距离。有伴侣者宜多创造松弛、没有评价性的谈话空间。`,
    health: `金木克制较为明显，建议本月注意脾胃运化，不宜顿顿油腻。注意保证23点前的睡眠，顺应月令天体磁场，有助于肝胆系统的夜间滋养与压力释放。`,
    luckyDays: [
      `农历初六：当天临三合贵人，适宜签订合约、开展核心会谈。`,
      `农历十六：喜用神生旺之日，思维敏捷，适合创作策划或破冰沟通。`
    ],
    unluckyDays: [
      `农历十二：流日地支犯自刑，宜清心静养，别因急躁发生无谓争执。`,
      `农历廿二：月忌出行之日，重要公差或户外徒步宜携带雨伞、留足路途余裕。`
    ],
    yearlyOverview: `本月作为${targetYear}全局中不可多得的一段转折，是夯实内在根基、排查陈旧方案漏洞的重要整固期，也为下半年腾飞打下定星磐。`
  };
}

// 3. Vite development server / production routing setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets from dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BaZi Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
