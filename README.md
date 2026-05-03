# JobSync

공고의 채용 마감일을 수동으로 캘린더에 등록하다가 불편해서 자동화했습니다.

## 주요 기능

- **공고 파싱** — 잡코리아·잡플래닛·원티드 페이지를 `Cmd+S`로 저장한 HTML 파일을 드롭하면 자동으로 정보를 추출합니다.
- **Google Calendar 연동** — 파싱된 마감일을 캘린더 일정으로 등록하고, 알림을 설정합니다.
- **칸반 보드** — 마감일 기준 D-3 / D-7 / D-10 / 그 이후로 공고를 분류해서 한눈에 볼 수 있습니다.
- **캘린더 뷰** — 월별 캘린더에서 마감일 분포를 확인합니다.

## 사용 방법

1. 채용 공고 페이지에서 `Cmd+S` (Mac) / `Ctrl+S` (Windows)로 HTML 파일 저장
2. `/upload` 페이지에 파일 드롭
3. 파싱된 공고 확인 후 Google Calendar에 마감일 등록

**지원 플랫폼**: 잡코리아, 잡플래닛, 원티드

## 아키텍처

### 파서 구조

크롤링은 이용약관 위반 소지와 로그인 세션이 필요하다는 점에서 배제했습니다. Cmd+S로 저장한 HTML 파일을 직접 파싱하는 방식으로 두 제약을 피했습니다.

HTML 파싱 전략은 `JSON-LD(schema.org/JobPosting)`를 우선으로 합니다. 국내 주요 플랫폼이 해당 표준을 따르고 있어 구조화된 데이터를 일관되게 추출할 수 있습니다.

```
AbstractParser
├── parsedJsonLd<T>(document, schema) — JSON-LD 추출 + Zod 검증
└── normalizeDate(value)              — 플랫폼별 날짜 포맷 정규화

ParserFactory
└── parse(document)                   — isSupport()로 플랫폼 감지 후 위임

platforms/
├── JobKoreaParser
├── JobPlanetParser
└── WantedParser
```

새 플랫폼을 추가할 때는 `AbstractParser`를 상속한 클래스를 만들고 `ParserFactory`의 `parsers` 배열에 추가하면 됩니다. 팩토리 자체는 수정할 필요가 없습니다.

```typescript
abstract class AbstractParser {
    protected parsedJsonLd<T>(document: Document, schema: z.ZodType<T>): T {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent ?? '');
                const result = schema.safeParse(json);
                if (result.success) return result.data;
            } catch {
                continue;
            }
        }
        throw new Error('공고 정보를 읽어오는 중 오류가 발생했어요.');
    }

    public abstract isSupport(document: Document): boolean;
    public abstract parse(document: Document): ParsedJob;
}
```

```typescript
class ParserFactory {
    private parsers: AbstractParser[] = [
        new JobKoreaParser(),
        new JobPlanetParser(),
        new WantedParser(),
    ];

    public parse(document: Document): ParsedJob {
        const parser = this.parsers.find((p) => p.isSupport(document));
        if (!parser) throw new Error('지원하지 않는 플랫폼입니다.');
        return parser.parse(document);
    }
}

export default new ParserFactory();
```

### 데이터 타입

파싱 결과는 Zod 스키마로 런타임 검증 후 아래 타입으로 정규화됩니다.

```typescript
type ParsedJob = {
    title: string;
    company: string;
    dueDate: Date | null; // null = 상시채용
    employmentType: EmploymentType; // 정규직 | 계약직 | 인턴 | 알 수 없음
    careerRequirements: CareerType; // 신입 | 경력 | 신입·경력 | 경력무관 | 알 수 없음
    educationType: EducationType;
    address: string;
    url: string;
};
```

Google Calendar에 등록할 때는 `extendedProperties.private.origin`에 직렬화된 원본 데이터를 함께 저장합니다. 캘린더에서 일정을 불러올 때 이 필드를 역직렬화해서 동일한 타입으로 복원합니다.

## 기술 스택

| 분류            | 선택                            |
| --------------- | ------------------------------- |
| 프레임워크      | Next.js 16 (App Router)         |
| 언어            | TypeScript                      |
| 스타일          | Tailwind CSS v4                 |
| 서버 상태       | TanStack Query v5               |
| 클라이언트 상태 | Zustand v5                      |
| 폼              | React Hook Form + Zod           |
| 외부 API        | Google Calendar API (OAuth 2.0) |

## 로컬 실행

```bash
git clone https://github.com/sonyk9919/job-sync
cd job-sync
npm install
npm run dev
```

Google Calendar 연동을 사용하려면 `.env`을 만들고 Google Cloud Console에서 발급한 OAuth 2.0 클라이언트 ID를 입력합니다.

```bash
# .env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

## 라이선스

MIT
