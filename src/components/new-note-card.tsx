import { ChangeEvent, FormEvent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === '') setShouldShowOnboarding(true)
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') return

    onNoteCreated(content)

    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota criada com sucesso!!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      setIsRecording(false)
      toast.error(
        'Infelizmente seu navegador não suporta a API de reconhecimento de voz!',
      )
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) speechRecognition.stop()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="rounded-md text-left flex flex-col bg-slate-700 p-5 gap-3
        hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400
        transition-shadow duration-150 ease-linear outline-none"
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>

        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content
          className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          flex flex-col md:max-w-[40rem] w-full md:h-[60dvh] bg-slate-700 md:rounded-md
          overflow-hidden"
        >
          <Dialog.Close
            className="absolute top-0 right-0 bg-slate-800 p-1.5
          text-slate-400 hover:text-slate-100"
          >
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="text-lime-400 hover:text-lime-500 hover:underline
                    font-medium"
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    className="text-lime-400 hover:text-lime-500 hover:underline
                font-medium"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="bg-transparent resize-none outline-none text-sm leading-6
                text-slate-400 flex-1"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex items-center gap-2 justify-center w-full
                bg-slate-900 py-4 text-center text-sm text-slate-50
                outline-none font-semibold hover:text-slate-400 transition-colors
                duration-150 ease-linear"
              >
                <div className="relative">
                  <div className="absolute size-2.5 rounded-full bg-red-500 animate-ping" />
                  <div className="size-2.5 rounded-full bg-red-500" />
                </div>
                <span>Gravando! (clique p/ interromper)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm
              text-lime-950 outline-none font-semibold hover:bg-lime-500 transition-colors
                duration-150 ease-linear"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
