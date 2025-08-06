
export interface SoundEffect {
  id: string;
  name: string;
  url: string;
  volume: number;
  loop: boolean;
}

class SoundService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.3;
  private isEnabled: boolean = true;

  // Simulação de sons usando frequências (Web Audio API)
  private readonly soundEffects: SoundEffect[] = [
    { id: 'win', name: 'Vitória', url: '', volume: 0.7, loop: false },
    { id: 'lose', name: 'Derrota', url: '', volume: 0.5, loop: false },
    { id: 'click', name: 'Clique', url: '', volume: 0.3, loop: false },
    { id: 'spin', name: 'Girar', url: '', volume: 0.4, loop: false },
    { id: 'card', name: 'Carta', url: '', volume: 0.3, loop: false },
    { id: 'coin', name: 'Moeda', url: '', volume: 0.6, loop: false },
    { id: 'ambient', name: 'Ambiente Casino', url: '', volume: 0.2, loop: true },
    { id: 'jackpot', name: 'Jackpot', url: '', volume: 0.8, loop: false }
  ];

  constructor() {
    this.initializeAudioContext();
    this.loadSounds();
  }

  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private loadSounds(): void {
    // Como não temos acesso a arquivos de som reais, vamos simular com síntese de áudio
    this.soundEffects.forEach(sound => {
      const audio = new Audio();
      // Para demonstração, vamos criar data URLs com tons simples
      audio.src = this.generateTone(sound.id);
      audio.volume = sound.volume * this.masterVolume;
      audio.loop = sound.loop;
      this.sounds.set(sound.id, audio);
    });
  }

  private generateTone(type: string): string {
    if (!this.audioContext) return '';

    // Frequências diferentes para cada tipo de som
    const frequencies: Record<string, number[]> = {
      'win': [523.25, 659.25, 783.99], // C5, E5, G5 (acorde maior)
      'lose': [311.13, 369.99], // Eb4, F#4 (tom menor/triste)
      'click': [800], // Tom agudo e rápido
      'spin': [440], // A4 (tom neutro)
      'card': [293.66], // D4 (tom médio)
      'coin': [698.46, 880], // F5, A5 (metálico)
      'ambient': [110, 220], // A2, A3 (baixo constante)
      'jackpot': [523.25, 659.25, 783.99, 1046.5] // Acorde maior oitavado
    };

    const freq = frequencies[type] || [440];
    
    try {
      // Criar um buffer muito pequeno apenas para ter um data URL válido
      // Na prática, usaríamos arquivos de áudio reais
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const channelData = buffer.getChannelData(0);
      channelData[0] = 0;

      // Retornar um data URL vazio (silencioso) para evitar erros
      return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAA==';
    } catch (error) {
      console.warn('Error generating tone:', error);
      return '';
    }
  }

  async play(soundId: string): Promise<void> {
    if (!this.isEnabled) return;

    const audio = this.sounds.get(soundId);
    if (!audio) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      // Ignorar erros de reprodução (comum em navegadores que bloqueiam autoplay)
      console.debug(`Could not play sound ${soundId}:`, error);
    }
  }

  stop(soundId: string): void {
    const audio = this.sounds.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  stopAll(): void {
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((audio, id) => {
      const effect = this.soundEffects.find(e => e.id === id);
      if (effect) {
        audio.volume = effect.volume * this.masterVolume;
      }
    });
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  isEffectsEnabled(): boolean {
    return this.isEnabled;
  }

  getSoundEffects(): SoundEffect[] {
    return [...this.soundEffects];
  }

  // Métodos de conveniência para sons comuns do casino
  async playWinSound(): Promise<void> {
    await this.play('win');
  }

  async playLoseSound(): Promise<void> {
    await this.play('lose');
  }

  async playClickSound(): Promise<void> {
    await this.play('click');
  }

  async playSpinSound(): Promise<void> {
    await this.play('spin');
  }

  async playCardSound(): Promise<void> {
    await this.play('card');
  }

  async playCoinSound(): Promise<void> {
    await this.play('coin');
  }

  async playJackpotSound(): Promise<void> {
    await this.play('jackpot');
  }

  startAmbientSound(): void {
    this.play('ambient');
  }

  stopAmbientSound(): void {
    this.stop('ambient');
  }

  // Método para tocar múltiplos sons em sequência
  async playSequence(soundIds: string[], delay: number = 200): Promise<void> {
    for (const soundId of soundIds) {
      await this.play(soundId);
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

export const soundService = new SoundService();
