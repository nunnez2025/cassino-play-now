
export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

class VoiceService {
  private synthesis: SpeechSynthesis;
  private recognition: any;
  private isListening: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoices();
    this.initializeSpeechRecognition();
  }

  private initializeVoices(): void {
    const loadVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    loadVoices();
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
  }

  private initializeSpeechRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'pt-BR';
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => 
      voice.lang.includes('pt') || voice.lang.includes('en')
    );
  }

  getJokerVoice(): SpeechSynthesisVoice | undefined {
    // Procurar por vozes masculinas dramáticas
    const dramaticVoices = this.voices.filter(voice => 
      (voice.name.toLowerCase().includes('male') || 
       voice.name.toLowerCase().includes('deep') ||
       voice.name.toLowerCase().includes('alex') ||
       voice.name.toLowerCase().includes('daniel')) &&
      (voice.lang.includes('pt') || voice.lang.includes('en'))
    );
    return dramaticVoices[0] || this.voices[0];
  }

  getHarlequinVoice(): SpeechSynthesisVoice | undefined {
    // Procurar por vozes femininas suaves
    const feminineVoices = this.voices.filter(voice => 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('samantha') ||
       voice.name.toLowerCase().includes('alice') ||
       voice.name.toLowerCase().includes('karen')) &&
      (voice.lang.includes('pt') || voice.lang.includes('en'))
    );
    return feminineVoices[0] || this.voices[1] || this.voices[0];
  }

  speak(text: string, settings: Partial<VoiceSettings> = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancelar qualquer fala anterior
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = settings.rate || 1.0;
      utterance.pitch = settings.pitch || 1.0;
      utterance.volume = settings.volume || 0.8;
      
      if (settings.voice) {
        utterance.voice = settings.voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synthesis.speak(utterance);
    });
  }

  speakAsJoker(text: string): Promise<void> {
    const jokerVoice = this.getJokerVoice();
    return this.speak(text, {
      voice: jokerVoice,
      rate: 0.9,
      pitch: 0.8,
      volume: 0.9
    });
  }

  speakAsHarlequin(text: string): Promise<void> {
    const harlequinVoice = this.getHarlequinVoice();
    return this.speak(text, {
      voice: harlequinVoice,
      rate: 1.1,
      pitch: 1.2,
      volume: 0.8
    });
  }

  listen(): Promise<SpeechRecognitionResult> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const result = event.results[0];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        resolve({ transcript, confidence });
        this.isListening = false;
      };

      this.recognition.onerror = (error: any) => {
        reject(error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }
}

export const voiceService = new VoiceService();
