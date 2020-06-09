const { stdin } = process

stdin.setRawMode(true)
stdin.resume()

interface IKeyboardCheck {
  keys: string[]
  bufs: Buffer[]
  name: Keys
  check(input: string | Buffer): boolean
}

function _(name: Keys, input: string): IKeyboardCheck {
  const bufs: Buffer[] = []
  const keys: string[] = []
  const regExp = /[0-9a-f\s]+/i
  const check = (input: string | Buffer) => {
    if (typeof input == 'string')
      return keys.indexOf(input) !== -1

    if (input instanceof Buffer)
      return !!bufs.find(e => e.equals(input))

    let other = Buffer.from(input)
    return !!bufs.find(e => e.equals(other))
  }

  while (regExp.test(input)) {
    const [find] = regExp.exec(input)
    const data = find.trim().split(/\s+/).map(e => parseInt(e, 16))
    const buff = Buffer.from(data)
    keys.push(buff.toString()); bufs.push(buff)
    input = input.replace(find, '')
  }

  return { bufs, keys, name, check }
}

export enum Keys {
  TAB, ESC, CLOSE, ENTER,
  SPACE, UP, LEFT, RIGHT,
  BOTTOM, BACK, DELETE, INSERT,
  PAGE_UP, PAGE_DOWN,
  HOME, END, F1, F2,
  F3, F4, F5, F6, F7,
  F8, F9, F10, F11, F12,
  PAUSE, SCRLK, PRTSC
}

const KeyboardKeys = [
  _(Keys.TAB, '09'),
  _(Keys.ESC, '1b'),
  _(Keys.CLOSE, '03'),
  _(Keys.ENTER, '0d'),
  _(Keys.SPACE, '20 : 00'),
  _(Keys.UP, '1b 5b 41'),
  _(Keys.LEFT, '1b 5b 44 ; 1b 5b 31 3b 32 44'),
  _(Keys.RIGHT, '1b 5b 43 ; 1b 5b 31 3b 32 43'),
  _(Keys.BOTTOM, '1b 5b 42'),
  _(Keys.BACK, '08 ; 7f'),
  _(Keys.DELETE, '1b 5b 33 7e'),
  _(Keys.INSERT, '1b 5b 32 7e'),
  _(Keys.PAGE_UP, '1b 5b 35 7e'),
  _(Keys.PAGE_DOWN, '1b 5b 36 7e'),
  _(Keys.HOME, '1b 5b 48 ; 1b 5b 31 7e'),
  _(Keys.END, '1b 5b 46 ; 1b 5b 34 7e'),
  // _(Keys.F1, '1b 4f 50'), 
  // _(Keys.F2, '1b 4f 51'), 
  // _(Keys.F3, '1b 4f 52'),
  // _(Keys.F4, '1b 4f 53'), 
  // _(Keys.F5, '1b 5b 31 35 7e'), 
  // _(Keys.F6, '1b 5b 31 37 7e'),
  // _(Keys.F7, '1b 5b 31 38 7e'), 
  // _(Keys.F8, '1b 5b 31 39 7e'), 
  // _(Keys.F9, '1b 5b 32 30 7e'),
  // _(Keys.F10, '1b 5b 32 31 7e'), 
  // _(Keys.F11, '1b 5b 32 33 7e'), 
  // _(Keys.F12, '1b 5b 32 34 7e'),
  // _(Keys.PAUSE, '1b 5b 32 38 7e'), 
  // _(Keys.SCRLK, '1b 5b 32 36 7e'), 
  // _(Keys.PRTSC, '1b 5b 32 35 7e')
]

export class KeyboardEvent {
  data: Buffer
  enum: Keys
  preventDefault() { }
}

interface IKeyboardListener {
  event: 'keypress' | Keys
  once?: boolean
  listener(event: KeyboardEvent): Promise<void>
}

export class KeyboardController {
  #listeners: IKeyboardListener[] = []

  on(event: 'keypress' | Keys, listener: (event: KeyboardEvent) => any) {
    if(event == 'keypress' || typeof Keys[event] == 'string')
      this.#listeners.push({event: <any>event, listener})
  }

  once(event: 'keypress' | Keys, listener: (event: KeyboardEvent) => any) {
    if(event == 'keypress' || typeof Keys[event] == 'string')
      this.#listeners.push({once: true, event: <any>event, listener})
  }
  
  off(event: 'keypress' | Keys, listener?: (event: KeyboardEvent) => any) {
    if(event == 'keypress' || typeof Keys[event] == 'string')
      this.#listeners = this.#listeners.filter(
        e => listener ? e.listener != listener : false)
  }

  constructor() {
    stdin.on('data', async (data) => {
      const event = new KeyboardEvent
      const { name = null } = KeyboardKeys.find(e => e.check(data)) || {}
      const listeners = this.#listeners.filter((e) => {
        return e.event == 'keypress' || e.event == name
      })
      const removed = listeners.filter(e => e.once)

      event.data = data
      event.enum = name

      if(name == Keys.CLOSE)
        listeners.push({event: Keys.CLOSE, listener() { process.exit(0) }})

      event.preventDefault = () => {
        listeners.splice(0)
      }

      this.#listeners = this.#listeners.filter(
        e => removed.indexOf(e) == -1)

      while (listeners.length) {
        const { listener } = listeners.shift()
        try {
          await listener(event)
        }catch(e) {console.error(e)}
      }
    })
  }
}
