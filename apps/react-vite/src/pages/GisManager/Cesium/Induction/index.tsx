import { Cartesian3, Color } from 'cesium'
import { Viewer, Entity } from '@/components/Cesium'
// import { Viewer, Entity } from 'resium'

const Induction = () => {
  return (
    <div>
      <Viewer full
        
      >
        <Entity
          position={Cartesian3.fromDegrees(118.32, 31.2, 1000)}
          point={{ pixelSize: 15, color: Color.YELLOW }}
        ></Entity>
      </Viewer>
    </div>
  )
}

export default Induction