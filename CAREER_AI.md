# 직업·사업운 생성기

## 버전과 동작

- 규칙 기반 장문: `paid-career-rule-0.4.0` — API 키 없이도 10개 섹션, 각 3문단.
- AI 서사: `paid-career-ai-1.0.0` — 같은 구조에 검증된 AI 본문을 적용.
- 종합 사주: `paid-full-0.2.0+<직업운 버전>`. 기존 재물/연애 섹션 뒤에 새 직업운 10개를 포함.
- 재물/연애 단독 버전과 생성 내용은 기존 그대로 유지.
- DB migration 불필요. 기존 interpretation_data JSON 형식을 유지하며 optional generation 메타데이터만 추가.

## 서버 설정

기본은 API 키가 없으면 rules, 키가 있으면 openai입니다. 운영에서는 제공자를 명시하세요.

```dotenv
CAREER_AI_PROVIDER=rules
```

AI를 사용하려면 서버의 `.env.local` 또는 배포 환경에 다음을 설정합니다. 키는 NEXT_PUBLIC_ 접두사를 사용하지 않습니다.

```dotenv
CAREER_AI_PROVIDER=openai
OPENAI_API_KEY=<서버 전용 키>
CAREER_AI_MODEL=<Responses API와 Structured Outputs를 지원하는 계정 내 모델 ID>
```

모델은 하드코딩하지 않았습니다. 계정에서 사용 가능한 모델을 지정한 뒤 실제 한국어 결과의 표현과 지연 시간을 검수하세요. 이 작업 환경에는 API 키가 없어 실제 모델 호출은 검증하지 않았습니다.

공식 API 형식: https://developers.openai.com/api/docs/guides/structured-outputs

## 신뢰 경계

CareerSignals를 유일한 개인별 근거 입력으로 사용합니다. 이름·생일·계정·결제 정보는 AI 요청에 포함하지 않습니다. OpenAI Responses 요청은 `store:false`, 서버 전용 fetch, 90초 timeout입니다. 두 생성 route는 maxDuration 120초이며 배포 플랫폼에서도 해당 실행 시간을 지원해야 합니다.

AI는 섹션 id/summary/content/basisIds만 반환합니다. 제목·계산 근거·실행 카드·대운 본문·버전은 서버가 관리합니다. 스키마, 길이, 섹션 순서, 근거 id, 동일 문단 반복 및 일부 확정 예언/미제공 명리 근거를 검사합니다. 문자열 검사는 모든 의미상의 환각을 탐지하지 못하므로 운영 전 실제 샘플 검수가 필요합니다.

대운 테마는 입력 preview의 천간을 편집 사전에 연결한 상징 해석입니다. 새 명리 계산, 길흉·용신 판정, 현재 대운 추정은 하지 않습니다. sequence-only/정밀도 미확인/잘못된 시작 나이는 표시 나이를 제거합니다. 대운 자체가 없으면 시기를 만들어내지 않습니다.

openai 모드에서 timeout·거부·잘린 JSON·품질 실패가 발생하면 일반 오류를 반환하고 기존 pipeline이 FAILED로 저장해 재시도하게 합니다. 조용히 rules로 바꾸어 AI 결과로 표시하지 않습니다. 공급자 오류 원문이나 키는 저장하지 않습니다.

## 확인

```powershell
node scripts/verify-career.cjs .
npm run build
```

검증 스크립트는 외부 API/DB를 호출하지 않습니다. 500개 오행·십성 조합, 누락/동률/정밀도 경계, 종합 결과 구조, mock AI 성공·실패를 검사합니다. 실제 AI의 문장 품질을 평가하는 테스트는 아닙니다.

배포 전 갑목·비견·편재, 다른 오행/십성, 출생시간 미상, 대운 누락 사례로 새 결과를 생성해 추천 이유·문단 중복·현재 직업을 안다고 단정하는지·대운 나이를 확인하세요. 기존 COMPLETED 결과는 자동으로 덮어쓰지 않습니다. 테스트 결과를 재생성할 때도 기존 결제 상태를 유지하세요.
