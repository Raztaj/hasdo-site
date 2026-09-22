import type { Metadata } from 'next';
import { ORG } from '@/lib/site';

export const metadata: Metadata = { title: 'سياسة الخصوصية' };

export default function PrivacyPage() {
  return (
    <div className="legal page">
      <div className="container section">
        <h1>سياسة الخصوصية</h1>
        <p>
          تُحدَّث هذه الصفحة فور اعتماد سياسة الخصوصية الرسمية لمنظمة العمل الإنساني
          والتنمية المستدامة ({ORG.acronym}).
        </p>
      </div>
    </div>
  );
}