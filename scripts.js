/* =========================================================
   SIPAT 2026 · Cyber Consciente — Lógica e interatividade
   Estrutura: Navbar → Reveal on scroll → Checklist → Quiz → Misc
   ========================================================= */

(function () {
    'use strict';

    /* =========================================================
       1. NAVBAR — sombra ao rolar + fechar menu mobile
       ========================================================= */
    const nav = document.querySelector('.nav');

    function onScroll() {
        if (!nav) return;
        if (window.scrollY > 12) nav.classList.add('nav--scrolled');
        else nav.classList.remove('nav--scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Toggle do menu mobile (botão hamburger) */
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.getElementById('navlinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    /* Fechar o menu mobile ao clicar em qualquer link */
    document.querySelectorAll('.nav__links a').forEach(a => {
        a.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('open');
        });
    });


    /* =========================================================
       2. REVEAL ON SCROLL — elementos entram suavemente na viewport
          Usa IntersectionObserver (performático, não trava o scroll)
       ========================================================= */
    function setupReveal() {
        const targets = document.querySelectorAll('.reveal, .reveal--stagger');
        if (!targets.length) return;

        // Fallback: se o navegador não suporta IntersectionObserver, mostra tudo
        if (!('IntersectionObserver' in window)) {
            targets.forEach(t => t.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target); // anima uma vez só
                }
            });
        }, {
            threshold: 0.12,            // dispara quando 12% do elemento aparece
            rootMargin: '0px 0px -40px 0px' // antecipa um pouco a entrada
        });

        targets.forEach(t => observer.observe(t));
    }


    /* =========================================================
       3. CHECKLIST — Antes / Durante / Depois + barra de progresso
       ========================================================= */
    function setupChecklist() {
        const tabs = document.querySelectorAll('.check-tab');
        const panels = document.querySelectorAll('.check-panel');
        const fill = document.getElementById('checkFill');
        const txt = document.getElementById('checkTxt');
        if (!tabs.length) return;

        tabs.forEach(t => {
            t.addEventListener('click', () => {
                tabs.forEach(x => x.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                t.classList.add('active');
                const target = document.querySelector('.check-panel[data-panel="' + t.dataset.tab + '"]');
                if (target) target.classList.add('active');
            });
        });

        function updateProgress() {
            const all = document.querySelectorAll('.chk');
            if (!all.length) return;
            const done = [...all].filter(c => c.checked).length;
            const pct = Math.round((done / all.length) * 100);
            fill.style.width = pct + '%';
            let msg = 'Nível de Segurança: ' + pct + '%';
            if (pct === 0) msg += ' — comece marcando os itens acima.';
            else if (pct < 50) msg += ' — atenção, ainda faltam etapas importantes.';
            else if (pct < 100) msg += ' — bom progresso, continue!';
            else msg = '✓ Nível de Segurança máximo! Posto seguro para o próximo usuário.';
            txt.textContent = msg;
            txt.style.color = pct === 100 ? 'var(--success)' : 'var(--ink-soft)';
        }

        document.querySelectorAll('.chk').forEach(c => {
            c.addEventListener('change', () => {
                c.closest('.check-item').classList.toggle('done', c.checked);
                updateProgress();
            });
        });
    }


    /* =========================================================
       4. QUIZ — 5 perguntas com feedback imediato
       ========================================================= */
    function setupQuiz() {
        const questions = [
            {
                q: 'Durante uma corrida de táxi, o motorista diz que “o débito não passou” e pede para inserir o cartão novamente, sem você ver a tela da maquininha. O que fazer?',
                opts: [
                    'Inserir o cartão novamente, confiando que vai dar certo.',
                    'Recusar, guardar o cartão, pagar por outra forma (Pix/aproximação) e registrar o fato.',
                    'Pedir para ele levar o cartão até o banco próximo.',
                    'Digitar a senha em voz alta para ele digitar.'
                ],
                correct: 1,
                explain: 'Recusar e pagar por outra forma evita a clonagem. Nunca perca o cartão de vista nem digite senha sem ver a tela.'
            },
            {
                q: 'Qual forma de pagamento físico é mais segura contra a clonagem da trilha magnética?',
                opts: [
                    'Passar a tarja magnética.',
                    'Inserir o chip e digitar a senha sem olhar a tela.',
                    'Pagamento por aproximação (NFC).',
                    'Empréstimo do cartão físico para o atendente.'
                ],
                correct: 2,
                explain: 'O NFC gera um código único por transação e não exige digitar a senha, o que reduz muito o risco de clonagem.'
            },
            {
                q: 'Você precisa ir ao banheiro rapidamente durante uma aula no laboratório do SENAI. O que fazer com o computador?',
                opts: [
                    'Deixar tudo aberto, é rápido.',
                    'Bloquear a tela com Windows + L antes de se levantar.',
                    'Desligar o computador da tomada.',
                    'Pedir para o colega continuar usando com seu login.'
                ],
                correct: 1,
                explain: 'Bloquear a tela (Windows + L) protege sua sessão sem fechar seus trabalhos. Mesmo ausências curtas exigem o bloqueio.'
            },
            {
                q: 'Em um PC compartilhado, o navegador oferece “salvar sua senha” ao logar no e-mail. Qual é a atitude correta?',
                opts: [
                    'Salvar, para facilitar o acesso amanhã.',
                    'Salvar só se ninguém estiver olhando.',
                    'Clicar em “Nunca” — nunca salvar senhas em máquinas compartilhadas.',
                    'Salvar e depois apagar o histórico.'
                ],
                correct: 2,
                explain: 'Em computadores compartilhados, jamais salve senhas no navegador. Use sua própria conta e faça logout ao terminar.'
            },
            {
                q: 'Segundo a NR-17 (ergonomia), como deve ficar o monitor no posto de trabalho?',
                opts: [
                    'O mais baixo possível para descansar os braços.',
                    'Na altura dos olhos, evitando inclinar excessivamente o pescoço.',
                    'Muito alto, obrigando a olhar para cima.',
                    'Virado para a janela, mesmo com reflexos.'
                ],
                correct: 1,
                explain: 'A NR-17 recomenda que o topo do monitor fique na linha dos olhos, com os pés apoiados e ombros relaxados, evitando reflexos.'
            }
        ];

        const box = document.getElementById('quizQuestions');
        if (!box) return;

        const bar = document.getElementById('quizProgress');
        const count = document.getElementById('quizCount');
        const scoreEl = document.getElementById('quizScore');
        const nextBtn = document.getElementById('quizNext');
        const resultBox = document.getElementById('quizResult');
        let current = 0;
        let score = 0;
        let answered = false;

        function render() {
            answered = false;
            const item = questions[current];
            const div = document.createElement('div');
            div.className = 'quiz__question';
            let optsHtml = '';
            for (let i = 0; i < item.opts.length; i++) {
                optsHtml += '<button class="quiz__opt" data-i="' + i + '"><span class="marker">' + String.fromCharCode(65 + i) + '</span><span>' + item.opts[i] + '</span></button>';
            }
            div.innerHTML = '<div class="quiz__q">' + item.q + '</div><div class="quiz__opts">' + optsHtml + '</div><div class="quiz__feedback"></div>';
            box.innerHTML = '';
            box.appendChild(div);

            div.querySelectorAll('.quiz__opt').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (answered) return;
                    answered = true;
                    const i = +btn.dataset.i;
                    const fb = div.querySelector('.quiz__feedback');
                    div.querySelectorAll('.quiz__opt').forEach((b, idx) => {
                        b.disabled = true;
                        if (idx === item.correct) b.classList.add('correct');
                        else if (idx === i) b.classList.add('wrong');
                    });
                    if (i === item.correct) {
                        score++;
                        scoreEl.textContent = score;
                        fb.textContent = '✓ Correto! ' + item.explain;
                        fb.className = 'quiz__feedback ok show';
                    } else {
                        fb.textContent = '✗ Quase! ' + item.explain;
                        fb.className = 'quiz__feedback no show';
                    }
                    nextBtn.classList.add('show');
                    if (current === questions.length - 1) nextBtn.textContent = 'Ver resultado →';
                    else nextBtn.textContent = 'Próxima pergunta →';
                });
            });

            bar.style.width = ((current + 1) / questions.length * 100) + '%';
            count.textContent = 'Pergunta ' + (current + 1) + ' de ' + questions.length;
            nextBtn.classList.remove('show');
        }

        nextBtn.addEventListener('click', () => {
            if (!answered) return;
            if (current < questions.length - 1) {
                current++;
                render();
            } else {
                showResult();
            }
        });

        function showResult() {
            box.innerHTML = '';
            document.querySelector('.quiz__actions').style.display = 'none';
            resultBox.classList.add('show');
            document.getElementById('quizResultBig').textContent = score + '/' + questions.length;
            bar.style.width = '100%';
            count.textContent = 'Quiz finalizado';
            let msg = '';
            if (score === 5) msg = 'Excelente! Você está realmente protegido contra o golpe da maquininha e sabe usar computadores compartilhados com segurança.';
            else if (score >= 3) msg = 'Muito bom! Você acertou a maioria, mas vale revisar as dicas que errar para reforçar sua proteção.';
            else msg = 'Atenção! Releia as seções de prevenção e de computadores compartilhados antes de apresentar o trabalho.';
            document.getElementById('quizResultMsg').textContent = msg;
        }

        window.restartQuiz = function () {
            current = 0;
            score = 0;
            scoreEl.textContent = '0';
            resultBox.classList.remove('show');
            document.querySelector('.quiz__actions').style.display = 'flex';
            render();
        };

        render();
    }


    /* =========================================================
       5. CONTADOR ANIMADO — números das estatísticas sobem ao entrar
          na viewport (R$ 4,8 bi, R$ 17 mil, 2 casos, 5 perguntas)
       ========================================================= */
    function animateCount(el) {
        const text = el.dataset.count || el.textContent;
        // Extrai número (pode conter R$, vírgula, espaços, "bi", "mil")
        const match = text.match(/[\d.,]+/);
        if (!match) return;

        const numStr = match[0].replace(/\./g, '').replace(',', '.');
        const target = parseFloat(numStr);
        if (isNaN(target)) return;

        // Decide o sufixo (bi / mil) preservando o texto original
        const prefix = text.substring(0, text.indexOf(match[0]));
        const suffix = text.substring(text.indexOf(match[0]) + match[0].length);

        const dur = 1400; // ms
        const start = performance.now();

        function tick(now) {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
            let val = target * eased;

            // Formata de volta conforme o original
            let display;
            if (target % 1 !== 0) {
                display = val.toFixed(1).replace('.', ',');
            } else {
                display = Math.round(val).toString();
            }
            el.textContent = prefix + display + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + match[0] + suffix; // restaura valor exato
        }
        requestAnimationFrame(tick);
    }

    function setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        if (!('IntersectionObserver' in window)) {
            counters.forEach(animateCount);
            return;
        }

        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    o.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => obs.observe(c));
    }


    /* =========================================================
       6. SCROLLSPY — destaca na navbar a seção atualmente visível
       ========================================================= */
    function setupScrollSpy() {
        const links = document.querySelectorAll('.nav__links a[href^="#"]');
        if (!links.length || !('IntersectionObserver' in window)) return;

        const sections = [];
        links.forEach(link => {
            const id = link.getAttribute('href').slice(1);
            const sec = document.getElementById(id);
            if (sec) sections.push({ sec, link });
        });
        if (!sections.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const match = sections.find(s => s.sec === entry.target);
                if (!match) return;
                if (entry.isIntersecting) {
                    links.forEach(l => l.classList.remove('is-active'));
                    match.link.classList.add('is-active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(s => obs.observe(s.sec));
    }


    /* =========================================================
       INIT — roda tudo quando o DOM estiver pronto
       ========================================================= */
    function init() {
        setupReveal();
        setupChecklist();
        setupQuiz();
        setupCounters();
        setupScrollSpy();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();