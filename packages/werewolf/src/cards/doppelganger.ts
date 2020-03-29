import { Card } from './card'
import { CopycatCard } from './copycat'

export class DoppelgangerCard extends Card {
  werewolf = false

  set isWerewolf(value: boolean) {
    this.werewolf = value
  }

  get isWerewolf() {
    return this.werewolf
  }

  static doNotGoFor = [
    CopycatCard.name,
  ]

  get name() {
    return 'Doppelganger'
  }

  get description() {
    return `<p>At night, the Doppelgänger looks at (but does not
switch) one other player’s card and does the following based on what she sees:</p>
<p>
Villager, Tanner, Hunter: She is now that role
and does nothing else at night.</p>
<p>
Werewolf or Mason: She wakes up with the
other Werewolves or Masons when they are
called. She is on the werewolf team if she views a
Werewolf, and is on the village team if she views
a Mason.<p>
<p>
Seer, Robber, Troublemaker, Drunk: She immmediately does that role’s action (she does not
wake up again with the original role when it is
called).</p>
<p>
Minion: At the end of the Doppelgänger phase,
the Announcer tells the Doppelgänger to close
her eyes unless she is now the Minion, and that
werewolves should put their thumbs up. She is on
the werewolf team.
</p>
<p>
Insomniac: After the Insomniac closes her eyes,
the Doppelgänger-Insomniac is woken up to
check her card to see if she is still the Doppelgänger
</p>`
  }

  get turnLength () {
    return 25
  }
}
