import {
  IconChevronDown as ChevronDown,
  IconChevronRight as ChevronRight,
  IconX as X,
} from '@tabler/icons-react'
import { useState } from 'react'
import '../styles/getting-started.css'

type Step = { title: string; body: string[] }

/** A plain walkthrough of the first steps, in the words the app's own controls use. */
const STEPS: Step[] = [
  {
    title: '1. Sign in to an AI',
    body: [
      'TasteCode drives the AI tools already on this computer: Claude Code, Codex and Grok.',
      'Open the ⋯ button next to the chat title, choose Settings, then Providers to see which ones are signed in.',
    ],
  },
  {
    title: '2. Open a project folder',
    body: [
      'A project is the folder the AI works in, such as a website folder.',
      'In the left sidebar, find the Projects heading and click the + beside it (New project), then pick the folder.',
      'You can also drag a folder onto the sidebar. No sidebar? Open ⋯ and choose Toggle sidebar.',
    ],
  },
  {
    title: '3. Set up Git (first time only)',
    body: [
      'Git keeps a save history, so you can undo work and run chats side by side.',
      'Under the message box, click Local, then Set up Git. If Isolated is already clickable, the folder is set up.',
    ],
  },
  {
    title: '4. Pick the AI and model',
    body: [
      'Use the model button under the message box to choose Claude, Codex or Grok and a model.',
    ],
  },
  {
    title: '5. Local or Isolated',
    body: [
      'Local works directly in your folder. Isolated gives the chat its own copy, so two chats cannot overwrite each other.',
      'When another chat is already working in the project, a new chat starts Isolated by itself.',
    ],
  },
  {
    title: '6. Design mode for websites',
    body: [
      'Click the Design button under the message box before writing a website request. TasteCode plans the look, builds it and checks it in a browser.',
    ],
  },
  {
    title: '7. Ask, then review',
    body: [
      'Type what you want and press Enter.',
      'To see what changed, open ⋯ and choose Toggle workspace tools, then the Review tab. Commit changes there saves them in Git.',
    ],
  },
  {
    title: '8. Undo',
    body: [
      'Every turn is saved. Hover a message and choose Restore to before this turn to go back.',
    ],
  },
]

export function GettingStarted(props: { onHide: () => void }) {
  const [open, setOpen] = useState<number | undefined>(0)
  return (
    <aside className="getting-started" aria-label="Getting started guide">
      <header className="getting-started__head">
        <span className="getting-started__title">Getting started</span>
        <button
          type="button"
          className="getting-started__hide"
          aria-label="Hide guide"
          title="Hide guide (reopen from ⋯ > Getting started guide)"
          onClick={props.onHide}
        >
          <X size={14} aria-hidden />
        </button>
      </header>
      <ol className="getting-started__steps">
        {STEPS.map((step, index) => {
          const expanded = open === index
          return (
            <li key={step.title} className="getting-started__step">
              <button
                type="button"
                className="getting-started__step-title"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? undefined : index)}
              >
                {expanded ? (
                  <ChevronDown size={13} aria-hidden />
                ) : (
                  <ChevronRight size={13} aria-hidden />
                )}
                <span>{step.title}</span>
              </button>
              {expanded ? (
                <div className="getting-started__body">
                  {step.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
