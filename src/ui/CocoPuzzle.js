import couplePhoto from '../../public/assets/custom/coco/couple-pixel.js';

export class CocoPuzzle {
  constructor(scene, onComplete, onCancel = () => {}) {
    this.scene = scene;
    this.onComplete = onComplete;
    this.onCancel = onCancel;
    this.root = null;
    this.solveTimer = null;
    scene.events.once('shutdown', () => this.close(false));
  }

  get isOpen() { return this.root !== null; }

  open() {
    if (this.isOpen) return;
    this.order = Array.from({ length: 9 }, (_, index) => index);
    for (let index = this.order.length - 1; index > 0; index -= 1) {
      const other = globalThis.Phaser.Math.Between(0, index);
      [this.order[index], this.order[other]] = [this.order[other], this.order[index]];
    }
    if (this.order.every((value, index) => value === index)) this.order.push(this.order.shift());
    this.selected = null;
    this.solving = false;
    this.revealReady = false;
    this.previousFocus = document.activeElement;
    this.root = document.createElement('div');
    this.root.className = 'coco-puzzle-overlay';
    this.root.tabIndex = -1;
    this.root.innerHTML = `<section class="coco-puzzle-card" role="dialog" aria-modal="true" aria-labelledby="coco-puzzle-title">
      <button class="coco-puzzle-close" type="button" aria-label="Cerrar rompecabezas">×</button>
      <h2 id="coco-puzzle-title">Nuestra primera foto :3</h2>
      <p class="coco-puzzle-instruction" aria-live="polite">Toca dos piezas para intercambiarlas</p>
      <div class="coco-puzzle-board" role="group" aria-label="Rompecabezas de nueve piezas"></div>
      <div class="coco-puzzle-footer"></div>
    </section>`;
    document.body.append(this.root);
    document.body.classList.add('coco-puzzle-open');
    this.card = this.root.querySelector('.coco-puzzle-card');
    this.board = this.root.querySelector('.coco-puzzle-board');
    this.instruction = this.root.querySelector('.coco-puzzle-instruction');
    this.renderPieces();
    this.root.querySelector('.coco-puzzle-close').addEventListener('click', () => this.cancel());
    this.root.addEventListener('click', event => { if (event.target === this.root) this.cancel(); });
    this.root.addEventListener('keydown', event => {
      event.stopPropagation();
      if (event.key === 'Enter' && this.solving) {
        event.preventDefault();
        if (!event.repeat) this.finishReveal();
      }
      if (event.key === 'Escape' && !this.solving) { event.preventDefault(); this.cancel(); }
    });
    this.root.addEventListener('keyup', event => event.stopPropagation());
    this.root.focus();
  }

  renderPieces() {
    this.board.replaceChildren();
    this.order.forEach((sourceIndex, slot) => {
      const piece = document.createElement('button');
      piece.type = 'button';
      piece.className = `coco-puzzle-piece${this.selected === slot ? ' is-selected' : ''}`;
      piece.style.backgroundImage = `url("${couplePhoto}")`;
      piece.style.backgroundPosition = `${(sourceIndex % 3) * 50}% ${Math.floor(sourceIndex / 3) * 50}%`;
      piece.setAttribute('aria-label', `Pieza ${sourceIndex + 1}, casilla ${slot + 1}${sourceIndex === slot ? ', correcta' : ''}`);
      piece.addEventListener('click', () => this.selectPiece(slot));
      this.board.append(piece);
    });
  }

  selectPiece(slot) {
    if (this.solving || !this.root) return;
    if (this.selected === null) {
      this.selected = slot;
      this.instruction.textContent = 'Ahora toca dónde quieres ponerla';
      this.renderPieces();
      return;
    }
    if (this.selected === slot) {
      this.selected = null;
      this.instruction.textContent = 'Toca dos piezas para intercambiarlas';
      this.renderPieces();
      return;
    }
    [this.order[this.selected], this.order[slot]] = [this.order[slot], this.order[this.selected]];
    this.selected = null;
    this.renderPieces();
    const correct = this.order.filter((value, index) => value === index).length;
    this.instruction.textContent = correct === 9 ? '¡Foto completa!' : `Piezas en su lugar: ${correct}/9`;
    if (correct === 9) this.revealPhoto();
  }

  revealPhoto() {
    if (this.solving) return;
    this.solving = true;
    this.revealReady = false;
    this.card.classList.add('is-revealing');
    // Preserve the solved grid underneath the fading photo so seams dissolve.
    for (const piece of this.board.children) piece.disabled = true;
    const photo = document.createElement('img');
    photo.className = 'coco-puzzle-complete-photo';
    photo.src = couplePhoto;
    photo.alt = 'Anto y Sergio en su primera foto juntos';
    this.board.append(photo);
    const celebration = document.createElement('div');
    celebration.className = 'coco-puzzle-celebration';
    celebration.setAttribute('aria-hidden', 'true');
    const heartXs = [8, 24, 40, 58, 75, 88, 14, 31, 50, 68, 82, 45];
    const confettiColors = ['#ffd760', '#f35f86', '#78d9b4', '#fff5ce'];
    for (let i = 0; i < heartXs.length; i++) {
      const delay = Math.floor(i / 6) * 0.5 + (i % 6) * 0.2;
      const heart = document.createElement('span');
      heart.className = 'coco-puzzle-heart';
      heart.style.setProperty('--x', `${heartXs[i]}%`);
      heart.style.setProperty('--delay', `${delay}s`);
      celebration.append(heart);
      for (let piece = 0; piece < 3; piece++) {
        const confetti = document.createElement('span');
        confetti.className = 'coco-puzzle-confetti';
        confetti.style.setProperty('--x', `${heartXs[i] + (piece - 1) * 3}%`);
        confetti.style.setProperty('--delay', `${delay + 1.85 + piece * 0.1}s`);
        confetti.style.setProperty('--drift', `${(piece - 1) * 20 + (i % 3 - 1) * 6}px`);
        confetti.style.setProperty('--color', confettiColors[(i + piece) % confettiColors.length]);
        celebration.append(confetti);
      }
    }
    this.board.append(celebration);
    this.instruction.textContent = '¡Nuestro primer recuerdo, completo!';
    this.continueButton = document.createElement('button');
    this.continueButton.type = 'button';
    this.continueButton.className = 'coco-puzzle-continue';
    this.continueButton.textContent = 'Un momento...';
    this.continueButton.setAttribute('aria-label', 'Espera a que termine la celebración');
    this.continueButton.disabled = true;
    this.continueButton.addEventListener('click', () => this.finishReveal());
    this.root.querySelector('.coco-puzzle-footer').append(this.continueButton);
    this.root.querySelector('.coco-puzzle-close').hidden = true;
    this.root.focus();
    this.solveTimer = this.scene.time.delayedCall(5000, () => {
      this.solveTimer = null;
      if (!this.root) return;
      this.revealReady = true;
      this.continueButton.disabled = false;
      this.continueButton.textContent = 'Enter · Continuar';
      this.continueButton.setAttribute('aria-label', 'Continuar');
      this.instruction.textContent = 'Quédate mirando todo el tiempo que quieras :3';
    });
  }

  finishReveal() {
    if (!this.root || !this.solving || !this.revealReady) return;
    this.revealReady = false;
    this.close(false);
    this.onComplete();
  }

  cancel() {
    if (this.solving) return;
    this.close(false);
    this.onCancel();
  }

  close(restoreFocus = true) {
    this.solveTimer?.remove(false);
    this.solveTimer = null;
    this.revealReady = false;
    this.root?.remove();
    this.root = null;
    document.body.classList.remove('coco-puzzle-open');
    if (restoreFocus && this.previousFocus?.isConnected) this.previousFocus.focus();
  }
}
