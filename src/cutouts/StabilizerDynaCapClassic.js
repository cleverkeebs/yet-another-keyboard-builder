import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

/**
 * EC stabalizer cutouts for Deskeys housings
 * Dimensions [width * height] of spacebar stabilizer housing cutouts are as follows:
 * Spacebar stab housing: 13.4mm * 13.53mm
 */

export class StabilizerDynaCapClassic extends CutoutGenerator {

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

        const width = new Decimal("13.6")
        const height = new Decimal("13.9")
        const fillet = new Decimal("1.07544")
        const stabCutout = new makerjs.models.RoundRectangle(width.toNumber(), height.toNumber(), fillet.toNumber())
        stabCutout.origin = [width.dividedBy(new Decimal("-2")).toNumber(), height.dividedBy(new Decimal("-2")).toNumber()]

        let singleCutout = {
            models: {
                stabCutout: new makerjs.models.RoundRectangle(width, height, fillet)
            }
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