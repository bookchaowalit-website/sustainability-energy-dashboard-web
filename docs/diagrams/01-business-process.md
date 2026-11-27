# 01 — Business process (As-Is / To-Be)

energy-dashboard-web คือแดชบอร์ดอ่านอย่างเดียวของเส้นโค้งโหลดไฟฟ้ารายชั่วโมงของอาคารหนึ่งหลัง (ข้อมูลสังเคราะห์) พร้อม 3 ไซต์ตัวอย่าง สำหรับผู้เยี่ยมชมที่อยากดูรูปแบบการแสดงผลข้อมูลพลังงาน ไม่ได้เชื่อมมิเตอร์หรือ API ใดๆ หน้าแรกถูก prerender เป็น HTML (มุมมอง Today พร้อมค่าการ์ด) แล้วการเปลี่ยนช่วงเวลาคำนวณใหม่ในเบราว์เซอร์โดยไม่เรียก API มีเพียงรายงาน error ไป Sentry เมื่อเปิดใช้

Last reviewed: 2026-11-28 · commit `a766637`

## As-Is (จากโค้ดวันนี้)

```mermaid
flowchart TD
  V["ผู้เยี่ยมชมเปิดหน้าแรก"] --> PAGE["app/page.tsx client component, ไม่มี API route และไม่มี storage"]
  PAGE --> DATA["ข้อมูลสังเคราะห์ในโค้ด lib/energy.ts: HOURS 24 ค่า และ SITES 3 ไซต์"]
  PAGE --> PERIOD["สวิตช์ช่วงเวลา Today / Yesterday / Week avg (state เริ่มที่ Today)"]
  PERIOD --> READ["readingFor: Yesterday = ต่ำกว่าเล็กน้อยช่วง 00-07, Week avg = 84% ของ Today"]
  DATA --> READ
  READ --> STATS["peakOf, lowOf, totalOf คำนวณเป็นการ์ด Peak / Total (เป็น Daily average เมื่อเลือก Week avg) / Quietest hour"]
  SITESW["Top site: topSite() และ shareOf() จากน้ำหนักคงที่ของ SITES ไม่เปลี่ยนตามช่วงเวลา"]
  DATA --> SITESW
  READ --> CHART["กราฟรายชั่วโมง ChartPanel + ปุ่ม Show table เป็นตารางทุกค่า"]
  READ --> SPLIT["siteTotalsFor: แบ่งยอดรวมตามโหลดตัวอย่างของแต่ละไซต์ ปัดให้รวมเท่ายอดอาคาร"]
  SPLIT --> SITE["เลือกไซต์: callout แสดงหมายเหตุของไซต์"]
  PAGE -.-> SENTRY["error เท่านั้นส่ง Sentry เมื่อมี NEXT_PUBLIC_SENTRY_DSN, scrubEvent ลบ request/user/breadcrumbs/extra, ตัด query/fragment ในข้อความ error และ URL (ข้อมูลอื่นในข้อความ error ยังส่งได้)"]
  CI["push/PR เข้า main: CI กลาง + security scan (ตรวจอย่างเดียว ไม่มี job deploy)"]
  DEPLOY["push เข้า main: Vercel Git integration deploy (ไม่ทราบว่ารอ CI หรือไม่) [ต้องยืนยัน]"] --> PAGE
```

Sources: `app/page.tsx`, `lib/energy.ts`, `components/dashboard-chart.tsx`, `components/dashboard-shell.tsx`, `lib/sentry.ts`, `instrumentation.ts`, `.github/workflows/ci.yml`, `PRODUCT.md`, `README.md`

## To-Be (ไม่มี To-Be ที่เขียนไว้)

ไม่มี To-Be ที่เขียนไว้

## Gap

| ID | As-Is → To-Be | Status | Owner | Evidence |
|---|---|---|---|---|
| G1 | เดโมข้อมูลสังเคราะห์ที่ไม่มี roadmap → ต้องการเป้าหมายที่เขียนไว้ (คงเป็นเดโม หรือเชื่อมแหล่งข้อมูลจริง) | decide | owner | `PRODUCT.md` ระบุว่าไม่มีมิเตอร์/API และไม่มีเป้าหมายถัดไป |

## Open questions

- `PRODUCT.md` อ้างถึงข้อความ "NOW / LOCAL 14:00 Tuesday" แต่ค้นไม่พบใน `app/`, `components/`, `lib/`: เอกสารน่าจะล้าหลังโค้ด
- สถานะ deploy จริงของ Vercel ยืนยันจากโค้ดไม่ได้ [ต้องยืนยัน]
