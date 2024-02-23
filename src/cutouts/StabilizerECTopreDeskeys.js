import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

/**
 * EC stabalizer cutouts for Deskeys housings
 * Dimensions [width * height] of spacebar stabilizer housing cutouts are as follows:
 * Spacebar stab housing: 13.4mm * 13.53mm
 */

export class StabilizerECTopreDeskeys extends CutoutGenerator {

    generate(key, generatorOptions) {
        let keySize = key.width

        if (!key.skipOrientationFix && key.height > key.width) {
            keySize = key.height
        }

        let stab_spacing_left = null
        let stab_spacing_right = null

        if (keySize.gte(8)) {
            stab_spacing_left = stab_spacing_right = new Decimal("66.675")
        }
        else if (keySize.gte(7)) {
            stab_spacing_left = stab_spacing_right = new Decimal("57.15")
        }
        else if (keySize.gte(6.25)) {
            stab_spacing_left = stab_spacing_right = new Decimal("50")
        }
        else if (keySize.gte(6)) {
            stab_spacing_left = stab_spacing_right = new Decimal("47.625")
        }
        else {
            return null
        }

        const width = new Decimal("13.4")
        const height = new Decimal("13.53")
        const plusHalfWidth = width.dividedBy(new Decimal("2"))
        const minsHalfWidth = width.dividedBy(new Decimal("-2"))
        const plusHalfHeight = height.dividedBy(new Decimal("2"));
        const minsHalfHeight = height.dividedBy(new Decimal("-2"));

        const topLeft = [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), plusHalfHeight.minus(generatorOptions.kerf).toNumber()]
        const topRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), plusHalfHeight.minus(generatorOptions.kerf).toNumber()]
        const bottomRight = [plusHalfWidth.minus(generatorOptions.kerf).toNumber(), minsHalfHeight.plus(generatorOptions.kerf).toNumber()]
        const bottomLeft = [minsHalfWidth.plus(generatorOptions.kerf).toNumber(), minsHalfHeight.plus(generatorOptions.kerf).toNumber()]

        let singleCutout = {
            paths: {
                lineTop: new makerjs.paths.Line(topLeft, topRight),
                lineBottom: new makerjs.paths.Line(bottomLeft, bottomRight),
                lineLeft: new makerjs.paths.Line(topLeft, bottomLeft),
                lineRight: new makerjs.paths.Line(topRight, bottomRight)
            }
        }

        if (generatorOptions.stabilizerFilletRadius.gt(0)) {

            const filletNum = generatorOptions.stabilizerFilletRadius.toNumber()

            const filletTopLeft = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineLeft, filletNum)
            const filletTopRight = makerjs.path.fillet(singleCutout.paths.lineTop, singleCutout.paths.lineRight, filletNum)
            const filletBottomLeft = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineLeft, filletNum)
            const filletBottomRight = makerjs.path.fillet(singleCutout.paths.lineBottom, singleCutout.paths.lineRight, filletNum)
            
            singleCutout.paths.filletTopLeft = filletTopLeft;
            singleCutout.paths.filletTopRight = filletTopRight;
            singleCutout.paths.filletBottomLeft = filletBottomLeft;
            singleCutout.paths.filletBottomRight = filletBottomRight;

        }

        let cutoutLeft = singleCutout;
        let cutoutRight = makerjs.model.clone(singleCutout);

        cutoutLeft = makerjs.model.move(cutoutLeft, [stab_spacing_left.times(-1).toNumber(), 0])
        cutoutRight = makerjs.model.move(cutoutRight, [stab_spacing_right.toNumber(), 0])

        let cutouts = {
            models: {
                "left": cutoutLeft,
                "right": cutoutRight
            }
        }

        if (!key.skipOrientationFix && key.height > key.width) {
            cutouts = makerjs.model.rotate(cutouts, -90)
        }

        return cutouts;
    }
}