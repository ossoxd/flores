import { TAMI } from '../config/tami.js';
import { isTamiQuizCorrect } from '../core/tamiQuest.js';
import tamiPaper from '../../public/assets/custom/tami/tami-question-paper.js';

export class TamiQuiz {
  constructor(scene, onComplete, onCancel = () => {}) {
    this.scene = scene;
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    this.root = null;
    scene.events.once('shutdown', () => this.close());
  }

  get isOpen() { return this.root !== null; }

  open() {
    if (this.isOpen) return;
    this.answers = [];
    this.index = 0;
    this.selected = null;
    this.reviewing = false;
    this.previousFocus = document.activeElement;
    this.root = document.createElement('div');
    this.root.className = 'tami-quiz-overlay';
    this.root.innerHTML = `<section class="tami-paper" role="dialog" aria-modal="true" aria-labelledby="tami-question" tabindex="-1">
      <button class="tami-close" type="button" aria-label="Cerrar cuestionario">×</button>
      <h2 id="tami-question" aria-live="polite"></h2>
      <div class="tami-options" role="group" aria-labelledby="tami-question"></div>
      <button class="tami-next" type="button" aria-label="Siguiente pregunta" disabled></button>
    </section>`;
    document.body.append(this.root);
    document.body.classList.add('tami-quiz-open');
    this.paper = this.root.querySelector('.tami-paper');
    this.paper.style.setProperty('--tami-paper-image', `url("${tamiPaper}")`);
    this.options = this.root.querySelector('.tami-options');
    this.nextButton = this.root.querySelector('.tami-next');
    this.root.querySelector('.tami-close').addEventListener('click', () => this.cancel());
    this.root.addEventListener('click', event => { if (event.target === this.root) this.cancel(); });
    this.nextButton.addEventListener('click', () => this.next());
    this.root.addEventListener('keydown', event => {
      event.stopPropagation();
      const key = event.key.toLowerCase();
      if (key === 'tab') {
        const buttons = [...this.root.querySelectorAll('button:not(:disabled)')]
          .filter(button => button.getClientRects().length > 0);
        const index = buttons.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) { event.preventDefault(); buttons.at(-1)?.focus(); }
        else if (!event.shiftKey && (index < 0 || index === buttons.length - 1)) { event.preventDefault(); buttons[0]?.focus(); }
        return;
      }
      if (['a', 'b', 'c', 'd', 'enter', 'escape', 'arrowup', 'arrowdown', ' '].includes(key)) event.preventDefault();
      if (event.repeat || this.reviewing) return;
      if (/^[a-d]$/.test(key)) this.select(key.charCodeAt(0) - 97);
      else if (key === 'enter') this.next();
      else if (key === 'escape') this.cancel();
      else if (key === 'arrowdown') this.select(this.selected === null ? 0 : (this.selected + 1) % 4);
      else if (key === 'arrowup') this.select(this.selected === null ? 3 : (this.selected + 3) % 4);
      else if (key === ' ') document.activeElement?.click?.();
    });
    // Do not leak a key release into Phaser after closing a question.
    this.root.addEventListener('keyup', event => event.stopPropagation());
    this.render();
  }

  render() {
    const question = TAMI.questions[this.index];
    this.selected = null;
    this.root.querySelector('#tami-question').textContent = question.question;
    this.options.replaceChildren();
    question.options.forEach((text, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tami-option${text.length > 100 ? ' is-long' : ''}`;
      button.setAttribute('aria-pressed', 'false');
      const label = document.createElement('span');
      label.textContent = `${String.fromCharCode(65 + index)}) ${text}`;
      button.append(label);
      button.addEventListener('click', () => this.select(index));
      this.options.append(button);
    });
    this.nextButton.setAttribute('aria-label', this.index === TAMI.questions.length - 1
      ? 'Entregar hoja a Tami' : 'Siguiente pregunta');
    this.nextButton.disabled = true;
    this.paper.focus();
  }

  select(index) {
    if (this.reviewing || !this.root) return;
    this.selected = index;
    [...this.options.children].forEach((button, i) => {
      button.classList.toggle('is-selected', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    this.nextButton.disabled = false;
  }

  next() {
    if (this.reviewing || this.selected === null || !this.root) return;
    this.answers.push(this.selected);
    if (++this.index < TAMI.questions.length) { this.render(); return; }
    this.reviewing = true;
    this.paper.classList.add('is-reviewing');
    this.root.querySelector('#tami-question').textContent = 'Tami está revisando tus respuestas…';
    this.options.replaceChildren();
    this.nextButton.hidden = true;
    this.root.querySelector('.tami-close').hidden = true;
    this.reviewTimer = this.scene.time.delayedCall(1400, () => {
      const passed = isTamiQuizCorrect(this.answers);
      this.close();
      this.onComplete(passed);
    });
  }

  cancel() {
    if (this.reviewing) return;
    this.close();
    this.onCancel();
  }

  close() {
    this.reviewTimer?.remove(false);
    this.reviewTimer = null;
    this.root?.remove();
    this.root = null;
    document.body.classList.remove('tami-quiz-open');
    if (this.previousFocus?.isConnected) this.previousFocus.focus();
  }
}
