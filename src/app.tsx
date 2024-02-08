import { ChangeEvent, useState } from 'react'

import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

import logo from './assets/logo_nlw_expert.svg'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('@v-notes')

    if (notesOnStorage) return JSON.parse(notesOnStorage)

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArr = [newNote, ...notes]

    setNotes(notesArr)

    localStorage.setItem('@v-notes', JSON.stringify(notesArr))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })

    setNotes(notesArray)

    localStorage.setItem('@v-notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search),
        )
      : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="logo da nlw experts" />

      <div className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight
          placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
        />
      </div>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[15.625rem]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          )
        })}
      </div>
    </div>
  )
}
