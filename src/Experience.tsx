import { Physics } from '@react-three/rapier'

import { Lights } from './Lights'
import { Level } from './Level'
import { Player } from './Player'
import { useGame } from './stores/useGame'

export const Experience = () => {
  const blocksCount = useGame(state => state.blocksCount)
  const blocksSeed = useGame(state => state.blocksSeed)

  return <>
    <color args={[ '#bdedfc' ]} attach='background' />

    <Physics>
      <Lights />
      <Level count={blocksCount} seed={blocksSeed} />
      <Player />
    </Physics>
  </>
}
