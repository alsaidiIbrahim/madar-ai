// ===== الثيم (دارك / لايت) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
function setTheme(t){ root.setAttribute('data-theme', t); localStorage.setItem('madar-theme', t); themeLabel.textContent = t === 'dark' ? 'نهاري' : 'ليلي'; }
setTheme(localStorage.getItem('madar-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.onclick = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

// ===== التحكم بحجم الخط (تكبير / تصغير) =====
// الخط الأساسي 16px (يعادل تقريباً مقاس مريح للقراءة العربية - طلب "خط 8" تم تفسيره كخط واضح بحجم افتراضي متوسط)
let fs = parseInt(localStorage.getItem('madar-fs') || '16', 10);
function applyFs(){ document.documentElement.style.setProperty('--fs', fs + 'px'); localStorage.setItem('madar-fs', fs); }
applyFs();
document.getElementById('fontIncrease').onclick = () => { if (fs < 22) { fs += 1; applyFs(); } };
document.getElementById('fontDecrease').onclick = () => { if (fs > 13) { fs -= 1; applyFs(); } };
document.getElementById('fontReset').onclick = () => { fs = 16; applyFs(); };

// ===== الأخبار (تتحدث يومياً 8 صباحاً بتوقيت مسقط) =====
const NEWS = [
  { cat:'نماذج', icon:'🧠', title:'GPT-5.2 يتفوق في اختبارات البرمجة متعددة الخطوات', desc:'تسريبات OpenAI تكشف تفوق الجيل الجديد على Claude 4.5 في مهام الوكلاء بنسبة 12% مع دعم سياق 400K.', date:'اليوم' },
  { cat:'نماذج', icon:'🟣', title:'Claude 4.5 Sonnet: ملك البرمجة الجديد؟', desc:'أنثروبيك تطلق تحسينات في فهم المشاريع الكاملة وإعادة الهيكلة، مع التزام أعلى بالتعليمات العربية.', date:'اليوم' },
  { cat:'نماذج', icon:'✨', title:'Gemini 2.5 Pro بسياق مليون رمز مجاناً للطلاب', desc:'جوجل توسع السياق وتكامل يوتيوب وDrive، مع سرعة استجابة أعلى وسعر API منافس.', date:'اليوم' },
  { cat:'نماذج', icon:'🐋', title:'DeepSeek V3.2 مفتوح المصدر ينافس الكبار', desc:'النموذج الصيني يحقق نتائج قريبة من GPT في الرياضيات والبرمجة بتكلفة أقل 90%.', date:'أمس' },
  { cat:'فيديو', icon:'🎥', title:'Sora يتيح الفيديو العربي بتعليق صوتي', desc:'OpenAI تضيف أصواتاً عربية ودقة 1080p للمشتركين، ومنافسة مباشرة مع Runway وVeo.', date:'اليوم' },
  { cat:'فيديو', icon:'🎬', title:'Runway Gen-4: مونتاج بالنص للصناع العرب', desc:'ميزة تحرير المشاهد باللغة العربية وتتبع الحركة تصل للخطة الاحترافية.', date:'أمس' },
  { cat:'برمجة', icon:'⌨️', title:'Cursor 2.0: وكيل يبني تطبيقاً كاملاً بأمر واحد', desc:'التحديث الجديد يفهم قاعدة الكود كاملة ويعدل ملفات متعددة مع اختبارات تلقائية.', date:'اليوم' },
  { cat:'برمجة', icon:'🐙', title:'GitHub Copilot يضيف وضع الوكيل المجاني للطلاب', desc:'مايكروسوفت تتيح الاستخدام المجاني للطلاب مع دعم Claude وGPT داخل VS Code.', date:'أمس' },
  { cat:'أدوات', icon:'🛠️', title:'مقارنة: أي نموذج الأفضل للمحتوى العربي؟', desc:'اختبرنا الأربعة الكبار في الكتابة والتلخيص والترجمة — Gemini وGPT في المقدمة عربياً.', date:'اليوم' },
];

const grid = document.getElementById('newsGrid');
const searchInput = document.getElementById('searchInput');
const catFilter = document.getElementById('categoryFilter');
function renderNews(){
  const q = (searchInput.value || '').trim();
  const c = catFilter.value;
  grid.innerHTML = '';
  NEWS.filter(n => (c === 'all' || n.cat === c) && (!q || (n.title + n.desc).includes(q)))
    .forEach(n => {
      const el = document.createElement('article');
      el.className = 'news-card';
      el.innerHTML = `<div class="cover">${n.icon}</div><div class="body">
        <div class="meta"><span class="tag">${n.cat}</span><span>${n.date} • 8:00 ص مسقط</span></div>
        <h3>${n.title}</h3><p>${n.desc}</p><a href="#models">اقرأ المقارنة ←</a></div>`;
      grid.appendChild(el);
    });
  if (!grid.innerHTML) grid.innerHTML = '<p style="color:var(--muted)">لا توجد نتائج مطابقة. جرّب كلمة أخرى.</p>';
}
searchInput.oninput = renderNews; catFilter.onchange = renderNews; renderNews();

// ===== منطق التحديث اليومي 8 صباحاً بتوقيت مسقط =====
function muscatNow(){
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Muscat' }));
}
function next8am(){
  const now = muscatNow();
  const next = new Date(now);
  next.setHours(8, 0, 0, 0);
  if (now >= next) next.setDate(next.getDate() + 1);
  return next - now;
}
function tick(){
  const now = muscatNow();
  document.getElementById('todayDate').textContent = now.toLocaleDateString('ar-OM', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  let ms = next8am();
  const h = String(Math.floor(ms / 3.6e6)).padStart(2, '0');
  const m = String(Math.floor(ms % 3.6e6 / 6e4)).padStart(2, '0');
  const s = String(Math.floor(ms % 6e4 / 1e3)).padStart(2, '0');
  const str = `${h}:${m}:${s}`;
  document.getElementById('countdown').textContent = str;
  document.getElementById('nextUpdateText').textContent = 'التحديث القادم بعد: ' + str + ' (8 صباحاً مسقط)';
  // تحديث تلقائي عند بلوغ 8 صباحاً
  if (now.getHours() === 8 && now.getMinutes() === 0 && now.getSeconds() < 2) {
    document.getElementById('lastUpdateText').textContent = 'آخر تحديث: اليوم الساعة 8:00 صباحاً بتوقيت مسقط ✅';
    renderNews();
  }
}
setInterval(tick, 1000); tick();
