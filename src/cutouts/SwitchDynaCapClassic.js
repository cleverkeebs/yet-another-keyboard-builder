import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

/**
 * EC switch cutout for Deskeys housings
 * Dimensions [width * height] of the 1u and 2u housings are as follows:
 * 1u: 14.6mm * 14mm
 * 2u stab: 32mm * 13.9mm
 *
 * Deskeys recommends for the plate cutouts to be a bit larger. The follow dimensions are what will be used for our configuration:
 * 1u: 14.7mm * 14.1mm
 * 2u stab: 32.1mm * 14.1mm
 */

export class SwitchDynaCapClassic extends CutoutGenerator {

    generate(key, generatorOptions) {
        // EC switch cutouts are chamfered instead of filleted. Numerals 1 & 2 are used for signifying chamfers in clockwise order.
        let topLeft, topRight, bottomRight, bottomLeft
        let plusHalfWidth, minsHalfWidth, plusHalfHeight, minsHalfHeight, topLeft1, topLeft2, topRight1, topRight2, bottomRight1, bottomRight2, bottomLeft1, bottomLeft2, mountingPointLeft, mountingPointRight
        var model

        // 1u housing
        const width1u = new Decimal("14.7")
        const height1u = new Decimal("14.1")
        const fillet1u = new Decimal("2.075")


        // 2u housing
        const width2u = new Decimal("32.1")
        const height2u = new Decimal("14.1")
        const chamfer2uTop = new Decimal("1")
        const chamfer2uBottomX = new Decimal("3")
        const chamfer2uBottomY = new Decimal("2")

        const shouldUse1uHousing = !((key.width >= 2 && key.width <= 3) || (key.height >=2 && key.height <= 3))

        // 1u housing
        if (shouldUse1uHousing) {
            plusHalfWidth = width1u.dividedBy(new Decimal("2"))
            minsHalfWidth = width1u.dividedBy(new Decimal("-2"))
            plusHalfHeight = height1u.dividedBy(new Decimal("2"))
            minsHalfHeight = height1u.dividedBy(new Decimal("-2"))

            topLeft = [minsHalfWidth.toNumber(), plusHalfHeight.toNumber()]
            topRight = [plusHalfWidth.toNumber(), plusHalfHeight.toNumber()]
            bottomRight = [plusHalfWidth.toNumber(), minsHalfHeight.toNumber()]
            bottomLeft = [minsHalfWidth.toNumber(), minsHalfHeight.toNumber()]

            model = {
                paths: {
                    lineTop: new makerjs.paths.Line(topLeft, topRight),
                    lineRight: new makerjs.paths.Line(topRight, bottomRight),
                    lineBottom: new makerjs.paths.Line(bottomRight, bottomLeft),
                    lineLeft: new makerjs.paths.Line(bottomLeft, topLeft)
                }
            }

            // Apply the fillet radius (replace chamfer1u with fillet)
            makerjs.path.combineFillet(model.models.outline, fillet1u.toNumber());
        }

        // 2u housing
        else {
            plusHalfWidth = width2u.dividedBy(new Decimal("2"))
            minsHalfWidth = width2u.dividedBy(new Decimal("-2"))
            plusHalfHeight = height2u.dividedBy(new Decimal("2"))
            minsHalfHeight = height2u.dividedBy(new Decimal("-2"))

            topLeft1 = [minsHalfWidth.toNumber(), plusHalfHeight.minus(chamfer2uTop).toNumber()]
            topLeft2 = [minsHalfWidth.plus(chamfer2uTop).toNumber(), plusHalfHeight.toNumber()]
            topRight1 = [plusHalfWidth.minus(chamfer2uTop).toNumber(), plusHalfHeight.toNumber()]
            topRight2 = [plusHalfWidth.toNumber(), plusHalfHeight.minus(chamfer2uTop).toNumber()]
            bottomRight1 = [plusHalfWidth.toNumber(), minsHalfHeight.plus(chamfer2uBottomY).toNumber()]
            bottomRight2 = [plusHalfWidth.minus(chamfer2uBottomX).toNumber(), minsHalfHeight.toNumber()]
            bottomLeft1 = [minsHalfWidth.plus(chamfer2uBottomX).toNumber(), minsHalfHeight.toNumber()]
            bottomLeft2 = [minsHalfWidth.toNumber(), minsHalfHeight.plus(chamfer2uBottomY).toNumber()]

            mountingPointLeft = [plusHalfWidth.plus(0.1512).toNumber(), minsHalfHeight.minus(0.1469).toNumber()]
            mountingPointRight = [minsHalfWidth.minus(0.1512).toNumber(), minsHalfHeight.minus(0.1469).toNumber()]
        }


        model = {
            paths: {
                lineTopLeft: new makerjs.paths.Line(topLeft1, topLeft2),
                lineTop: new makerjs.paths.Line(topLeft2, topRight1),
                lineTopRight: new makerjs.paths.Line(topRight1, topRight2),
                lineRight: new makerjs.paths.Line(topRight2, bottomRight1),
                lineBottomRight: new makerjs.paths.Line(bottomRight1, bottomRight2),
                lineBottom: new makerjs.paths.Line(bottomRight2, bottomLeft1),
                lineBottomLeft: new makerjs.paths.Line(bottomLeft1, bottomLeft2),
                lineLeft: new makerjs.paths.Line(bottomLeft2, topLeft1),
                mountingHoleLeft: mountingPointLeft !== undefined ? new makerjs.paths.Circle(mountingPointLeft, .8) : null,
                mountingHoleRight: mountingPointRight !== undefined ? new makerjs.paths.Circle(mountingPointRight, .8) : null
            }
        }


        if (!key.skipOrientationFix && key.height > key.width) {
            model = makerjs.model.rotate(model, 90)
        }

        return model;
    }
}
