
// Utilitários para Speech-to-Text e Text-to-Speech

export class SpeechRecognitionManager {
  private recognition: any = null
  private onResultCallback: ((transcript: string) => void) | null = null
  private onEndCallback: (() => void) | null = null
  private isListening = false

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.lang = 'pt-BR'
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.maxAlternatives = 1

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          if (this.onResultCallback) {
            this.onResultCallback(transcript)
          }
        }

        this.recognition.onend = () => {
          this.isListening = false
          if (this.onEndCallback) {
            this.onEndCallback()
          }
        }

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          this.isListening = false
          if (this.onEndCallback) {
            this.onEndCallback()
          }
        }
      }
    }
  }

  isAvailable(): boolean {
    return this.recognition !== null
  }

  start(onResult: (transcript: string) => void, onEnd: () => void) {
    if (!this.recognition || this.isListening) return

    this.onResultCallback = onResult
    this.onEndCallback = onEnd
    this.isListening = true
    
    try {
      this.recognition.start()
    } catch (error) {
      console.error('Error starting recognition:', error)
      this.isListening = false
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  getIsListening(): boolean {
    return this.isListening
  }
}

export class TextToSpeechManager {
  private synthesis: SpeechSynthesis | null = null
  private currentUtterance: SpeechSynthesisUtterance | null = null
  private isSpeaking = false
  private isPaused = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
    }
  }

  isAvailable(): boolean {
    return this.synthesis !== null
  }

  speak(text: string, onEnd?: () => void) {
    if (!this.synthesis) return

    // Parar qualquer fala anterior
    this.stop()

    this.currentUtterance = new SpeechSynthesisUtterance(text)
    this.currentUtterance.lang = 'pt-BR'
    this.currentUtterance.rate = 1.0 // Velocidade normal
    this.currentUtterance.pitch = 1.15 // Tom ligeiramente mais agudo para voz feminina e amigável
    this.currentUtterance.volume = 1

    // Tentar usar voz feminina em português (melhor ordem de prioridade)
    const voices = this.synthesis.getVoices()
    
    // Tentar encontrar vozes específicas do Google ou Microsoft em PT-BR
    const portugueseVoice = voices.find(voice => 
      voice.lang === 'pt-BR' && (
        voice.name.toLowerCase().includes('luciana') ||
        voice.name.toLowerCase().includes('francisca') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('feminino')
      )
    ) || voices.find(voice => 
      voice.lang === 'pt-BR'
    ) || voices.find(voice => 
      voice.lang.startsWith('pt-')
    ) || voices.find(voice => 
      voice.lang.startsWith('pt')
    )

    if (portugueseVoice) {
      this.currentUtterance.voice = portugueseVoice
      console.log('Usando voz:', portugueseVoice.name)
    }

    this.currentUtterance.onstart = () => {
      this.isSpeaking = true
      this.isPaused = false
    }

    this.currentUtterance.onend = () => {
      this.isSpeaking = false
      this.isPaused = false
      if (onEnd) onEnd()
    }

    this.currentUtterance.onerror = (error) => {
      console.error('Speech synthesis error:', error)
      this.isSpeaking = false
      this.isPaused = false
      if (onEnd) onEnd()
    }

    // Pequeno delay para garantir que o synthesis está pronto
    setTimeout(() => {
      if (this.synthesis && this.currentUtterance) {
        this.synthesis.speak(this.currentUtterance)
      }
    }, 100)
  }

  pause() {
    if (this.synthesis && this.isSpeaking && !this.isPaused) {
      this.synthesis.pause()
      this.isPaused = true
    }
  }

  resume() {
    if (this.synthesis && this.isPaused) {
      this.synthesis.resume()
      this.isPaused = false
    }
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel()
      this.isSpeaking = false
      this.isPaused = false
      this.currentUtterance = null
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking
  }

  getIsPaused(): boolean {
    return this.isPaused
  }
}
