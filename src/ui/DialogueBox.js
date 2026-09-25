import { advanceDialogue, createDialogue } from "../core/dialogueFlow.js";
import { normalizeSergioPortraits } from '../entities/normalizeSergioPortraits.js';
const FACES = {
  Anto: { confused: 0, bewildered: 1, happy: 2, angry: 3, joyful: 4, neutral: 5 },
  Conejo: { happy: 0, content: 1, annoyed: 2, cool: 3 },
  Tami: { happy: 0, playful: 1, mischievous: 2, disappointed: 3 },
  Coco: { happy: 0, angry: 1, laugh: 2, playful: 3, content: 0 },
  Canelo: { hungry: 0, sad: 1, flirty: 2, proud: 3, sleepy: 4, happy: 5 },
  Micky: { neutral: 1, mischievous: 3, happy: 2, surprised: 4, annoyed: 5 },
  Max: { happy: 0, firm: 1, grateful: 2, cheeky: 3 },
  Sergio: { happy: 0, shy: 1, tender: 2, joyful: 3 }
};
const PORTRAITS = { Anto: 'girl-portraits', Conejo: 'rabbit-portraits', Tami: 'tami-portraits', Coco: 'coco-portraits-alpha', Canelo: 'canelo-portraits', Micky: 'micky-portraits', Max: 'max-portraits', Sergio: 'sergio-portraits-clean' };
export class DialogueBox {
  constructor(scene, onClosed = () => {}) {
    normalizeSergioPortraits(scene);
    this.scene = scene;
    this.onClosed = onClosed;
    this.flow = createDialogue([]);
    this.timer = null;
    this.root = scene.add.container(0, 0).setScrollFactor(0).setDepth(1400).setVisible(false);
    const frame = scene.add.graphics();
    frame.fillStyle(0x4c332a,.22).fillRoundedRect(30,334,904,188,14);
    frame.fillStyle(0xfff7e6,1).fillRoundedRect(28,328,904,188,14);
    frame.lineStyle(4,0xb98530).strokeRoundedRect(28,328,904,188,14);
    frame.lineStyle(1,0xe9cc89).strokeRoundedRect(36,336,888,172,9);
    frame.fillStyle(0xf6e6c4).fillRoundedRect(752,341,166,160,9);
    frame.lineStyle(2,0xe0b969).lineBetween(738,350,738,491);
    for(let i=0;i<5;i++) frame.fillStyle(0xf1c844).fillCircle(58+Math.cos(i*Math.PI*2/5)*7,355+Math.sin(i*Math.PI*2/5)*7,5);
    frame.fillStyle(0x976136).fillCircle(58,355,4);
    this.hit=scene.add.rectangle(480,422,904,188,0xffffff,0).setInteractive({useHandCursor:true});
    this.name=scene.add.text(80,342,'',{fontFamily:'Georgia, serif',fontSize:'25px',fontStyle:'bold',color:'#704529'});
    this.text=scene.add.text(56,384,'',{fontFamily:'Arial, sans-serif',fontSize:'23px',color:'#3f3028',wordWrap:{width:650,useAdvancedWrap:true},lineSpacing:5});
    this.hint=scene.add.text(717,491,'',{fontFamily:'Arial, sans-serif',fontSize:'14px',color:'#85643e'}).setOrigin(1,.5);
    this.portrait=scene.add.image(835,421,'girl-portraits',0).setDisplaySize(154,154);
    this.root.add([frame,this.hit,this.name,this.text,this.hint,this.portrait]);
    this.hit.on('pointerup',()=>this.advance());
    scene.events.once('shutdown',()=>{this.cancelTimer();this.root.destroy();});
  }
  cancelTimer(){if(this.timer){this.timer.remove(false);this.timer=null;}}
  open(lines){
    this.cancelTimer();
    const pages=[];
    for(const value of lines){
      const line=typeof value==='string'?{speaker:'Conejo',emotion:'content',text:value}:value;
      const wrapped=this.text.getWrappedText(line.text);
      for(let i=0;i<wrapped.length;i+=3){
        const last=i+3>=wrapped.length;
        pages.push({...line,text:wrapped.slice(i,i+3).join('\n'),autoAdvanceMs:last?line.autoAdvanceMs:undefined});
      }
    }
    this.flow=createDialogue(pages);
    if(this.flow.finished)return;
    this.root.setVisible(true);
    this.showLine();
  }
  showLine(){
    this.cancelTimer();
    const line=this.flow.lines[this.flow.index];
    this.name.setText(line.speaker);
    this.portrait.setTexture(PORTRAITS[line.speaker] ?? 'rabbit-portraits',FACES[line.speaker]?.[line.emotion]??0).setDisplaySize(154,154);
    this.fullText=line.text;
    this.revealed=0;
    this.text.setText('');
    this.hint.setText('Enter · Mostrar texto');
    const tick=()=>{
      this.revealed++;
      this.text.setText(this.fullText.slice(0,this.revealed));
      if(this.revealed>=this.fullText.length){this.finishReveal();return;}
      this.timer=this.scene.time.delayedCall(line.slowDots&&this.fullText[this.revealed]==='.'?750:26,tick);
    };
    this.timer=this.scene.time.delayedCall(26,tick);
  }
  finishReveal(){
    this.cancelTimer();
    this.revealed=this.fullText.length;
    this.text.setText(this.fullText);
    const line=this.flow.lines[this.flow.index];
    this.hint.setText(line.autoAdvanceMs?'…':'Enter · Continuar  ▸');
    if(line.autoAdvanceMs)this.timer=this.scene.time.delayedCall(line.autoAdvanceMs,()=>this.next());
  }
  advance(){
    if(!this.isOpen)return;
    if(this.revealed<this.fullText.length){this.finishReveal();return;}
    this.next();
  }
  next(){
    this.cancelTimer();
    this.flow=advanceDialogue(this.flow);
    if(this.flow.finished)this.close();else this.showLine();
  }
  close(){
    this.cancelTimer();
    if(!this.isOpen)return;
    this.root.setVisible(false);
    this.onClosed();
  }
  get isOpen(){return this.root.visible;}
}
