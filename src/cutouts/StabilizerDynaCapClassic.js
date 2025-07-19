import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

/**
 * EC stabalizer cutouts for DynaCap Classic stabilizer housings
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

        const stabWidth = new Decimal("13.6")
        const stabHeight = new Decimal("13.9")
        const stabFillet = new Decimal("1.07544")
        const stabCutout = new makerjs.models.RoundRectangle(stabWidth.toNumber(), stabHeight.toNumber(), stabFillet.toNumber())
        stabCutout.origin = [stabWidth.dividedBy(new Decimal("-2")).toNumber(), stabHeight.dividedBy(new Decimal("-2")).toNumber()]

        let singleCutout = {
            models: {
                stabCutout: stabCutout
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