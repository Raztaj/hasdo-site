import type { Metadata } from 'next';
import { ORG } from '@/lib/site';

export const metadata: Metadata = { title: 'شروط الاستخدام' };

export default function TermsPage() {
  return (
    <div className="legal page">
      <div className="container section">
        <h1>شروط الاستخدام</h1>
        <p>
          تُحدَّث هذه الصفحة فور اعتماد شروط الاستخدام الرسمية لمنظمة العمل الإنساني
          والتنمية المستدامة ({ORG.acronym}).
        </p>
      </div>
    </div>
  );
}