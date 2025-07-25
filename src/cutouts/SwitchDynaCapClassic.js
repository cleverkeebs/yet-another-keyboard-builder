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
        let points
        let mountingPointLeft, mountingPointRight
        var model

        // 1u housing
        const width1u = new Decimal("14.7")
        const height1u = new Decimal("14.1")
        const fillet1u = new Decimal("2.075")

        const shouldUse1uHousing = !((key.width >= 2 && key.width <= 3) || (key.height >= 2 && key.height <= 3))

        // 1u housing
        if (shouldUse1uHousing) {
            // plusHalfWidth = width1u.dividedBy(new Decimal("2"))
            // minsHalfWidth = width1u.dividedBy(new Decimal("-2"))
            // plusHalfHeight = height1u.dividedBy(new Decimal("2"))
            // minsHalfHeight = height1u.dividedBy(new Decimal("-2"))

            // points = [
            //     [minsHalfWidth.toNumber(), plusHalfHeight.toNumber()],
            //     [plusHalfWidth.toNumber(), plusHalfHeight.toNumber()],
            //     [plusHalfWidth.toNumber(), minsHalfHeight.toNumber()],
            //     [minsHalfWidth.toNumber(), minsHalfHeight.toNumber()]
            // ]
            const cutout1u = new makerjs.models.RoundRectangle(width1u.toNumber(), height1u.toNumber(), fillet1u.toNumber())
            cutout1u.origin = [width1u.dividedBy(new Decimal("-2")).toNumber(), height1u.dividedBy(new Decimal("-2")).toNumber()]

            model = {
                models: {
                    cutout1u: cutout1u
                }
            }
        }

        // 2u housing
        else {
            points = [
                [-16.07544, 4.35044],
                [-14.65044, 5.77544],
                [-13.78483, 5.77544],
                [-12.92416, 6.35572],
                [-11.92762, 7.02760],
                [11.92762, 7.02760],
                [12.92416, 6.35572],
                [13.78483, 5.77544],
                [14.65044, 5.77544],
                [16.07544, 4.35044],
                [16.07544, -3.25044],
                [14.65044, -4.67544],
                [14.24640, -4.67544],
                [12.63119, -5.79500],
                [10.87550, -7.01191],
                [-10.87550, -7.01191],
                [-12.63118, -5.79499],
                [-14.24640, -4.67544],
                [-14.65044, -4.67544],
                [-16.07544, -3.25044]
            ]
            const filletMain = 1.425
            const filletTop1 = 0.92841
            const filletTop2 = 1.07499
            const filletBottom1 = 1.72493
            const filletBottom2 = 1.87495
            // points = [
            //     [-16.07544, 5.77544],
            //     [-12.92416, 5.77544],
            //     [-12.92416, 7.02760],
            //     [12.92416, 7.02760],
            //     [12.92416, 5.77544],
            //     [16.07544, 5.77544],
            //     [16.07544, -4.67544],
            //     [12.63119, -4.67544],
            //     [12.63119, -7.01191],
            //     [-12.63119, -7.01191],
            //     [-12.63119, -4.67544],
            //     [-16.07544, -4.67544]
            // ]

            mountingPointLeft = [-16.5, -7.25000]
            mountingPointRight = [16.5, -7.25000]


            model = {
                paths: {
                    path0: new makerjs.paths.Arc(points[0], points[1], filletMain, false, true),
                    path1: new makerjs.paths.Line(points[1], points[2]),
                    path2: new makerjs.paths.Arc(points[2], points[3], filletTop1, false, false),
                    path3: new makerjs.paths.Arc(points[3], points[4], filletTop2, false, true),
                    path4: new makerjs.paths.Line(points[4], points[5]),
                    path5: new makerjs.paths.Arc(points[5], points[6], filletTop2, false, true),
                    path6: new makerjs.paths.Arc(points[6], points[7], filletTop1, false, false),
                    path7: new makerjs.paths.Line(points[7], points[8]),
                    path8: new makerjs.paths.Arc(points[8], points[9], filletMain, false, true),
                    path9: new makerjs.paths.Line(points[9], points[10]),
                    path10: new makerjs.paths.Arc(points[10], points[11], filletMain, false, true),
                    path11: new makerjs.paths.Line(points[11], points[12]),
                    path12: new makerjs.paths.Arc(points[12], points[13], filletBottom1, false, false),
                    path13: new makerjs.paths.Arc(points[13], points[14], filletBottom2, false, true),
                    path14: new makerjs.paths.Line(points[14], points[15]),
                    path15: new makerjs.paths.Arc(points[15], points[16], filletBottom2, false, true),
                    path16: new makerjs.paths.Arc(points[16], points[17], filletBottom1, false, false),
                    path17: new makerjs.paths.Line(points[17], points[18]),
                    path18: new makerjs.paths.Arc(points[18], points[19], filletMain, false, true),
                    path19: new makerjs.paths.Line(points[19], points[0]),
                    mountingHoleLeft: mountingPointLeft !== undefined ? new makerjs.paths.Circle(mountingPointLeft, .8) : null,
                    mountingHoleRight: mountingPointRight !== undefined ? new makerjs.paths.Circle(mountingPointRight, .8) : null
                }
            }
        }


        if (!key.skipOrientationFix && key.height > key.width) {
            model = makerjs.model.rotate(model, 90)
        }

        return model;
    }
}
