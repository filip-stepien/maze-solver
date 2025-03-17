import { BufferGeometry, BufferAttribute, MeshPhysicalMaterial, Material } from 'three';
import { ModelGroup } from '../core/ModelGroup';
import { Scene } from '../core/Scene';

/**
 * Box that forms part of the path in a maze.
 */
export class MazeBoxGroup extends ModelGroup {
    private createHalfBoxGeometry(s: number) {
        const vertices = new Float32Array([
            -s,  s, -s,
             s,  s, -s,
             s,  s,  s,
            -s,  s,  s,
        
             s,  s, -s, 
             s, -s, -s, 
             s, -s,  s, 
             s,  s,  s,
        
            -s,  s,  s, 
             s,  s,  s, 
             s, -s,  s, 
            -s, -s,  s
        ]);
        
        const indices = [
            3, 2, 1,    3, 1, 0, 
        
            7, 6, 5,    7, 5, 4, 

            11, 10, 9,  11, 9, 8
        ];
        
        const geometry = new BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        return geometry;
    }

    protected materialFactory(): Material {
        return new MeshPhysicalMaterial({
            color: 0x4c566a,
            metalness: 1.0,
            roughness: 0.8,
        });
    }
    
    protected geometryFactory(): BufferGeometry {
        return this.createHalfBoxGeometry(MazeBoxGroup.boxSize);
    }

    public static get boxSize() {
        return 0.5;
    }
}
