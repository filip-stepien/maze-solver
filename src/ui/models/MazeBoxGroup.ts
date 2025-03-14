import { BoxGeometry, BufferGeometry, MeshNormalMaterial, BufferAttribute, PlaneGeometry, DoubleSide, FrontSide, BackSide } from 'three';
import { ModelGroup } from '../core/ModelGroup';
import { Scene } from '../core/Scene';

/**
 * Box that forms part of the path in a maze.
 */
export class MazeBoxGroup extends ModelGroup {
    constructor(scene: Scene, count: number = 1) {
        super(scene, count);

        const size = MazeBoxGroup.boxSize;
        this.geometry = this.createHalfBoxGeometry(size);
        this.material = new MeshNormalMaterial();
    }

    private createHalfBoxGeometry(s: number) {
        const vertices = new Float32Array([
            // GÓRNA ŚCIANA
            -s,  s, -s,
             s,  s, -s,
             s,  s,  s,
            -s,  s,  s,
        
            // PRAWA ŚCIANA
             s,  s, -s, 
             s, -s, -s, 
             s, -s,  s, 
             s,  s,  s,
        
            // PRZEDNIA ŚCIANA
            -s,  s,  s, 
             s,  s,  s, 
             s, -s,  s, 
            -s, -s,  s
        ]);
        
        const indices = [
            // GÓRNA ŚCIANA (odwrotna kolejność)
            3, 2, 1,  3, 1, 0, 
        
            // PRAWA ŚCIANA (odwrotna kolejność)
            7, 6, 5,  7, 5, 4, 

            // PRZEDNIA ŚCIANA (odwrotna kolejność)
            11, 10, 9,  11, 9, 8
        ];
        
        const geometry = new BufferGeometry();
        geometry.setIndex( indices );
        geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
        geometry.computeVertexNormals();

        return geometry;
    }

    public static get boxSize() {
        return 0.5;
    }
}
