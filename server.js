import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Potens.AI API 프록시 엔드포인트
app.post('/api/potens-analysis', async (req, res) => {
  try {
    console.log('📥 요청 받음:', req.body);

    // Potens.AI API 실제 URL (환경 변수에서 가져오기)
    const POTENS_API_URL = process.env.POTENS_API_URL || 'https://potens.ai/v1/chat/completions';
    const POTENS_API_KEY = process.env.POTENS_API_KEY;

    if (!POTENS_API_KEY) {
      throw new Error('API 키가 설정되지 않았습니다.');
    }

    const response = await fetch(POTENS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${POTENS_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4", // 실제 모델명으로 변경
        messages: [
          {
            role: "system",
            content: "당신은 회의록을 분석하여 의사결정 내용, 변경사항, 엣지케이스, 체크리스트를 추출하는 전문가입니다."
          },
          {
            role: "user",
            content: `다음 회의록을 분석하여 JSON 형식으로 반환해주세요:
            
회의록:
${req.body.minutes}

다음 형식으로 응답해주세요:
{
  "changeLog": "변경 사유 요약",
  "diff": ["변경사항1", "변경사항2"],
  "edgeCases": ["엣지케이스1", "엣지케이스2"],
  "checklist": [{"task": "작업1", "status": "대기"}]
}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Potens.AI API 오류:', response.status, errorText);
      throw new Error(`Potens.AI API 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Potens.AI 응답:', data);

    // OpenAI 형식 응답 파싱
    const content = data.choices?.[0]?.message?.content || "";
    
    // JSON 파싱 시도
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch {
      // JSON 파싱 실패 시 기본값
      parsedContent = {
        changeLog: content,
        diff: [],
        edgeCases: [],
        checklist: []
      };
    }

    res.json(parsedContent);

  } catch (error) {
    console.error('❌ 서버 오류:', error);
    res.status(500).json({ 
      error: '분석 중 오류가 발생했습니다.',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
