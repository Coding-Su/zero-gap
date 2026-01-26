import type { AIAnalysisResult } from '../types';

console.log("현재 로드된 키 값:", import.meta.env.VITE_API_KEY);
/**
 * [설정] 포텐스닷 API 접속 정보
 */
const API_CONFIG = {
  USE_REAL_API: true,
  // Vite 프록시 설정을 타기 위한 상대 주소입니다.
  API_URL: "/api/chat", 
  
  API_KEY: "XqlHd2EhYm24ffn4WCLfsOmpn9jBz3SY", 
  // 포텐스닷에서 안내한 Claude 4.5 Sonnet 모델명입니다.
  MODEL: "claude-4.5-sonnet" 
};

/**
 * Claude에게 전달할 지시 사항 (System Prompt)
 */
const SYSTEM_PROMPT = `
당신은 10년 차 시니어 IT 기획자입니다. 
사용자가 입력한 '회의록'을 분석하여, 개발팀과 디자인팀이 즉시 참고할 수 있는 [정책 변경사항]과 [에지 케이스]를 도출해야 합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 절대 포함하지 마세요.

{
  "extractedPolicies": [
    { "category": "카테고리명", "content": "변경 내용 요약" }
  ],
  "potentialEdgeCases": [
    "예상되는 문제점 1",
    "예상되는 문제점 2"
  ]
}
`;

/**
 * 회의록 분석 메인 함수
 */
export const analyzeMeetingNotes = async (meetingText: string): Promise<AIAnalysisResult> => {
  console.log(`🚀 [${API_CONFIG.MODEL}] 분석 요청을 시작합니다...`);

  // 포텐스닷 서버가 요구하는 'prompt' 형식으로 데이터를 합칩니다.
  const finalPrompt = `${SYSTEM_PROMPT}\n\n[사용자 회의록]\n${meetingText}`;

  try {
    const response = await fetch(API_CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        model: API_CONFIG.MODEL,
        prompt: finalPrompt, // 'messages' 대신 'prompt' 필드 사용
        temperature: 0.7
      })
    });

    // 서버 응답이 실패한 경우
    if (!response.ok) {
      const errorDetail = await response.json().catch(() => ({}));
      console.error("❌ API 서버 에러:", errorDetail);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 서버에서 받은 원본 데이터:", data); // image_03c096.png에서 확인한 그 데이터

    // [핵심] 포텐스닷은 응답 텍스트를 data.message에 담아 보냅니다.
    let content = data.message || ""; 

    if (!content) {
      throw new Error("서버 응답에서 'message' 필드를 찾을 수 없습니다.");
    }

    // 1. 마크다운 기호(```json 등) 제거 및 공백 정리
    const cleanedContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // 2. JSON 데이터만 정확히 추출하기 ({ 로 시작해서 } 로 끝나는 지점 찾기)
    const jsonStartIndex = cleanedContent.indexOf('{');
    const jsonEndIndex = cleanedContent.lastIndexOf('}') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      throw new Error("응답 내용에서 JSON 형식을 찾을 수 없습니다.");
    }

    const finalJson = cleanedContent.substring(jsonStartIndex, jsonEndIndex);

    // 3. 최종 결과 파싱
    const parsedResult = JSON.parse(finalJson) as AIAnalysisResult;
    console.log("✨ 화면에 뿌려질 분석 결과:", parsedResult);
    
    return parsedResult;

  } catch (error) {
    console.error("❌ 분석 중 오류 발생:", error);
    // 에러 발생 시 UI가 멈추지 않도록 빈 결과값을 반환합니다.
    return { extractedPolicies: [], potentialEdgeCases: [] };
  }
};