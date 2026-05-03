import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '개인정보처리방침 — JobSync',
};

export default function PrivacyPage() {
    return (
        <main className="max-w-2xl mx-auto px-6 py-12 text-sm text-gray-700 space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">개인정보처리방침</h1>
            <p className="text-gray-500">최종 수정일: 2025년 5월 3일</p>

            <section className="space-y-2">
                <h2 className="font-semibold text-gray-900">1. 수집하는 정보</h2>
                <p>
                    JobSync는 별도의 회원가입 없이 Google 계정으로 로그인합니다. 서비스 운영을 위해
                    어떠한 개인정보도 수집하거나 저장하지 않습니다.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-gray-900">2. Google API 사용</h2>
                <p>JobSync는 아래 목적으로만 Google Calendar API에 접근합니다.</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li>JobSync 전용 캘린더 생성</li>
                    <li>채용 공고 마감일 일정 등록 · 조회</li>
                </ul>
                <p>
                    Google 계정의 다른 캘린더, 이메일, 연락처 등에는 접근하지 않습니다. 취득한 OAuth
                    액세스 토큰은 사용자의 브라우저에만 보관되며 외부 서버로 전송되지 않습니다.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-gray-900">3. 제3자 제공</h2>
                <p>수집된 개인정보가 없으므로 제3자에게 제공하는 정보가 없습니다.</p>
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-gray-900">4. 문의</h2>
                <p>
                    개인정보처리방침에 관한 문의는{' '}
                    <a href="mailto:sonyk9919@gmail.com" className="text-blue-600 hover:underline">
                        sonyk9919@gmail.com
                    </a>
                    으로 연락해 주세요.
                </p>
            </section>
        </main>
    );
}
