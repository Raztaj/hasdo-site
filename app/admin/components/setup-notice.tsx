export default function SetupNotice() {
  return (
    <div className="admin-setup">
      <p className="admin-setup-title">Supabase غير مرتبط بعد</p>
      <p className="admin-setup-text">
        الربط يفعّل الحماية والدخول وكتابة المحتوى (service_role في الإجراءات). حتى
        ذلك الحين تعرض اللوحة <strong>بيانات تجريبية</strong> فقط، والكتابة محجوبة.
      </p>
      <ol className="admin-setup-steps">
        <li>أنشئ مشروعاً على Supabase ثم ضع المتغيرات في <code dir="ltr">.env.local</code>:
          <code dir="ltr">NEXT_PUBLIC_SUPABASE_URL</code> و <code dir="ltr">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> و <code dir="ltr">SUPABASE_SERVICE_ROLE_KEY</code>.</li>
        <li>شغّل الترحيلات:
          <code dir="ltr">npx supabase db push</code></li>
        <li>أنشئ حساب المدير:
          <code dir="ltr">npm run seed</code></li>
        <li>أعد تشغيل التطبيق.</li>
      </ol>
    </div>
  );
}