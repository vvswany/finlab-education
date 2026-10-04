document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-ready");
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, {threshold:.08});
    reveals.forEach(el => io.observe(el));
    // Safety net: the page is never allowed to remain hidden.
    setTimeout(() => reveals.forEach(el => el.classList.add("visible")), 1400);
  } else {
    reveals.forEach(el => el.classList.add("visible"));
  }

  const amount = document.querySelector("#amount");
  const rate = document.querySelector("#rate");
  const years = document.querySelector("#years");
  const result = document.querySelector("#calcResult");
  const amountOut = document.querySelector("#amountOut");
  const rateOut = document.querySelector("#rateOut");
  const yearsOut = document.querySelector("#yearsOut");
  const growthOut = document.querySelector("#growthOut");

  function rub(n){ return Math.round(n).toLocaleString("ru-RU"); }
  function updateCalc(){
    const a = Number(amount.value), r = Number(rate.value), y = Number(years.value);
    const total = a * Math.pow(1 + r/100, y);
    result.textContent = rub(total);
    amountOut.textContent = rub(a) + " ₽";
    rateOut.textContent = r + "%";
    yearsOut.textContent = y + (y === 1 ? " год" : y < 5 ? " года" : " лет");
    growthOut.textContent = "+" + ((total/a - 1) * 100).toFixed(1).replace(".", ",") + "%";
  }
  [amount, rate, years].forEach(el => el?.addEventListener("input", updateCalc));
  if (amount && rate && years && result && amountOut && rateOut && yearsOut && growthOut) updateCalc();

  const heroValue = document.querySelector("#heroValue");
  let current = 0, target = 10000, start = performance.now();
  function count(t){
    const p = Math.min((t-start)/1200,1);
    const e = 1-Math.pow(1-p,3);
    if(heroValue) heroValue.textContent = Math.round(current+(target-current)*e).toLocaleString("ru-RU");
    if(p<1) requestAnimationFrame(count);
  }
  requestAnimationFrame(count);

  const toast = document.querySelector("#toast");
  const demoBtn = document.querySelector("#demoBtn");
  demoBtn?.addEventListener("click", () => {
    toast.textContent = "Демо-режим: 10 000 × 1,08² = 11 664 ₽";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  });

  document.querySelector(".menu-btn")?.addEventListener("click", () => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;
    nav.classList.toggle("mobile-open");
    if (nav.classList.contains("mobile-open")) {
      nav.style.display = "grid";
      nav.style.position = "absolute";
      nav.style.top = "64px";
      nav.style.left = "16px";
      nav.style.right = "16px";
      nav.style.padding = "18px";
      nav.style.background = "rgba(251,247,237,.98)";
      nav.style.border = "1px solid #d4c6ad";
      nav.style.borderRadius = "16px";
      nav.style.boxShadow = "0 14px 35px rgba(74,57,38,.14)";
    } else {
      nav.removeAttribute("style");
    }
  });

  // Safety cushion: one meaningful scenario.
  const vaultCard = document.querySelector("#vaultCard");
  const vault = document.querySelector(".vault");
  const vaultButton = document.querySelector(".vault-btn");
  const vaultGoal = document.querySelector("#vaultGoal");
  const vaultTerm = document.querySelector("#vaultTerm");
  const vaultGoalOut = document.querySelector("#vaultGoalOut");
  const vaultTermOut = document.querySelector("#vaultTermOut");
  const vaultMonthlyOut = document.querySelector("#vaultMonthlyOut");
  const vaultValue = document.querySelector("#vaultValue");

  function fmtMoney(n){
    return Math.round(n).toLocaleString("ru-RU") + " ₽";
  }
  function updateVaultPlan(){
    if(!vaultGoal || !vaultTerm) return;
    const goal=Number(vaultGoal.value);
    const months=Number(vaultTerm.value);
    if(vaultGoalOut) vaultGoalOut.textContent=fmtMoney(goal);
    if(vaultTermOut) vaultTermOut.textContent=months+" мес.";
    if(vaultMonthlyOut) vaultMonthlyOut.textContent=fmtMoney(goal/months);
    if(vaultValue) vaultValue.textContent=fmtMoney(goal);
  }
  vaultGoal?.addEventListener("input", updateVaultPlan);
  vaultTerm?.addEventListener("input", updateVaultPlan);
  vaultButton?.addEventListener("click", ()=>{
    vaultCard?.classList.add("planner-open");
    vault?.classList.add("open");
    updateVaultPlan();
  });
  updateVaultPlan();

  // Animated route ball: a real loop from step 1 -> 2 -> ... -> 6 -> 1.
  const pathPaper = document.querySelector("#pathPaper");
  const pathBall = document.querySelector("#pathBall");
  const steps = [...document.querySelectorAll(".step[data-step]")];
  const pathProgress = document.querySelector("#pathProgress");
  let routeIndex = 0;

  function moveBall(index, animate = true){
    if (!pathBall || !pathPaper || !steps.length) return;
    routeIndex = index;
    steps.forEach(s => s.classList.remove("active"));

    const step = steps[index];
    step.classList.add("active");

    const paperRect = pathPaper.getBoundingClientRect();
    const rect = step.getBoundingClientRect();
    const x = rect.left - paperRect.left + rect.width / 2;
    // On mobile the route becomes a 2-column grid. Use each step's real
    // position so the ball travels between points instead of jumping in place.
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const y = rect.top - paperRect.top + (mobile ? 35 : 43);

    pathBall.classList.remove("jump");
    // Force a new animation cycle even when the same step is clicked twice.
    void pathBall.offsetWidth;
    pathBall.style.left = x + "px";
    pathBall.style.top = y + "px";
    if (animate) pathBall.classList.add("jump");

    if (pathProgress) {
      pathProgress.textContent = String(index + 1).padStart(2,"0") + " / 06";
    }
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", () => moveBall(index, true));
  });

  if (steps.length) {
    setTimeout(() => moveBall(0, false), 100);
    setInterval(() => {
      if (!document.hidden) {
        moveBall((routeIndex + 1) % steps.length, true);
      }
    }, 1500);
  }

  window.addEventListener("resize", () => {
    moveBall(routeIndex, false);
  });

  // Final decision desk.
  const decisionResult = document.querySelector("#decisionResult");
  const decisionMap = {
    practice: "ОТКРЫВАЕМ ПРАКТИКУ →",
    simulate: "ЗАПУСКАЕМ СИМУЛЯТОР →",
    calculate: "ОТКРЫВАЕМ КАЛЬКУЛЯТОР →"
  };
  document.querySelectorAll(".decision-option").forEach(option => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".decision-option").forEach(o => o.classList.remove("active"));
      option.classList.add("active");
      if (decisionResult) decisionResult.textContent = decisionMap[option.dataset.decision] || "ГОТОВ К ПЕРВОЙ ЗАДАЧЕ";
    });
  });


  // Module cards now have a real interaction instead of dead anchor jumps.
  const moduleData = {
    practice: {
      label: "01 / PRACTICE",
      title: "Практика.",
      text: "Задачи из реальных финансовых ситуаций. Здесь можно считать, сравнивать варианты и сразу проверять ход решения.",
      action: "Перейти к практике"
    },
    simulator: {
      label: "02 / SIMULATOR",
      title: "Симуляторы.",
      text: "Меняй исходные данные и смотри, как меняется результат. Симулятор превращает абстрактную формулу в эксперимент.",
      action: "Запустить симулятор"
    },
    tools: {
      label: "03 / TOOLS",
      title: "Инструменты.",
      text: "Калькуляторы и визуальные модели для процентов, накоплений, бюджета и других финансовых расчётов.",
      action: "Открыть инструменты"
    },
    path: {
      label: "04 / PATH",
      title: "Путь.",
      text: "Шесть последовательных шагов: от базовых понятий о деньгах до самостоятельного финансового решения.",
      action: "Посмотреть путь"
    }
  };

  const modal = document.createElement("div");
  modal.className = "module-modal";
  modal.innerHTML = `
    <div class="module-modal-card" role="dialog" aria-modal="true" aria-label="Модуль">
      <div class="module-modal-top">
        <span id="moduleModalLabel"></span>
        <button class="module-modal-close" type="button" aria-label="Закрыть">×</button>
      </div>
      <h3 id="moduleModalTitle"></h3>
      <p id="moduleModalText"></p>
      <button class="module-modal-action" type="button" id="moduleModalAction"></button>
    </div>`;
  document.body.appendChild(modal);

  const modalLabel = modal.querySelector("#moduleModalLabel");
  const modalTitle = modal.querySelector("#moduleModalTitle");
  const modalText = modal.querySelector("#moduleModalText");
  const modalAction = modal.querySelector("#moduleModalAction");
  const closeModal = () => modal.classList.remove("open");

  document.querySelectorAll(".feature-card[data-module]").forEach(card => {
    card.addEventListener("click", event => {
      event.preventDefault();
      const data = moduleData[card.dataset.module];
      if (!data) return;
      modalLabel.textContent = data.label;
      modalTitle.textContent = data.title;
      modalText.textContent = data.text;
      modalAction.textContent = data.action + " →";
      modal.classList.add("open");
    });
  });

  modal.querySelector(".module-modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
  modalAction.addEventListener("click", closeModal);

  // Hero graph: one draggable point constrained to the real SVG curve.
  const heroChartWrap = document.querySelector(".chart-wrap");
  const heroSvg = document.querySelector("#heroChart");
  const heroCurve = heroSvg?.querySelector(".curve");
  const heroPoint = document.querySelector("#heroDragPoint");
  const heroChartValue = document.querySelector("#heroChartValue");
  const heroMainValue = document.querySelector("#heroValue");
  const heroGrowth = document.querySelector("#heroGrowth");

  let heroDragging = false;
  let heroCurveLength = 0;

  function updateHeroPoint(t){
    if(!heroPoint || !heroCurve || !heroSvg || !heroChartWrap) return;
    heroCurveLength ||= heroCurve.getTotalLength();
    t=Math.max(0.02,Math.min(0.98,t));

    // This is the actual SVG path, not a second approximation.
    const p=heroCurve.getPointAtLength(t*heroCurveLength);
    heroPoint.setAttribute("cx",p.x);
    heroPoint.setAttribute("cy",p.y);

    // The financial value follows the graph's actual Y coordinate.
    // At the initial point we define 10 000 ₽ as the reference; when the
    // curve falls, the value falls too, and when it rises, the value rises.
    const reference = heroCurve.getPointAtLength(0.78*heroCurveLength);
    const value = Math.max(6000, Math.min(16000, 10000 + (reference.y - p.y) * 32));
    const growth = (value / 10000 - 1) * 100;

    if(heroMainValue) heroMainValue.textContent=Math.round(value).toLocaleString("ru-RU");
    if(heroGrowth) heroGrowth.textContent="+"+growth.toFixed(1).replace(".",",")+"%";
    if(heroChartValue) heroChartValue.textContent=fmtMoney(value);

    const sr=heroSvg.getBoundingClientRect();
    const wr=heroChartWrap.getBoundingClientRect();
    const px=(p.x/620)*sr.width;
    const py=(p.y/250)*sr.height;
    heroChartValue.style.left=(sr.left-wr.left+px)+"px";
    heroChartValue.style.top=Math.max(0,sr.top-wr.top+py-42)+"px";
  }

  function heroTFromPointer(clientX){
    const r=heroSvg.getBoundingClientRect();
    return (clientX-r.left)/r.width;
  }

  heroPoint?.addEventListener("pointerdown",e=>{
    if(!heroChartWrap?.classList.contains("chart-ready")) return;
    heroDragging=true;
    heroPoint.setPointerCapture?.(e.pointerId);
    updateHeroPoint(heroTFromPointer(e.clientX));
  });
  heroPoint?.addEventListener("pointermove",e=>{
    if(heroDragging) updateHeroPoint(heroTFromPointer(e.clientX));
  });
  heroPoint?.addEventListener("pointerup",()=>heroDragging=false);
  heroPoint?.addEventListener("pointercancel",()=>heroDragging=false);
  heroPoint?.addEventListener("lostpointercapture",()=>heroDragging=false);

  setTimeout(()=>{
    if(heroCurve) heroCurveLength=heroCurve.getTotalLength();
    heroChartWrap?.classList.add("chart-ready");
    updateHeroPoint(.78);
  },1900);

  // Subtle pointer interaction for the hero lab.
  const lab = document.querySelector(".lab-card");
  window.addEventListener("pointermove", e => {
    if(!lab || window.innerWidth < 900) return;
    const x = (e.clientX / window.innerWidth - .5) * 2;
    const y = (e.clientY / window.innerHeight - .5) * 2;
    lab.style.transform = `perspective(900px) rotateY(${x*2}deg) rotateX(${-y*1.5}deg)`;
  });
});
