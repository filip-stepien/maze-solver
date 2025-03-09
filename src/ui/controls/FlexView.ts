import { View } from './View';

/**
 * Container for other controls utilizing flexbox layout to arrange its child controls.
 */
export class FlexView extends View {
    /**
     * Initializes flexbox layout by setting the display property to `flex`.
     */
    constructor() {
        super();
        this.setStyle('display', 'flex');
    }

    /**
     * Sets the direction of the flex container.
     *
     * @param direction Direction to arrange the flex items.
     */
    public set direction(direction: 'column' | 'row') {
        this.setStyle('flexDirection', direction);
    }

    /**
     * Sets the alignment of the flex items along the cross-axis.
     *
     * @param alignment [Alignment property value.](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items#syntax)
     */
    public set alignItems(alignment: string) {
        this.setStyle('alignItems', alignment);
    }

    /**
     * Sets the alignment of the flex items along the main axis.
     *
     * @param justification [Justification property value.](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content#syntax)
     */
    public set justifyContent(justification: string) {
        this.setStyle('justifyContent', justification);
    }
}
