/**
 * Highcharts plugin for creating individual rounded corners.
 *
 * Author: Torstein Honsi (customized by Jeremy Wong)
 * Last revision: 2014-11-12
 * License: MIT License
 *
 * Known issues:
 * - Animation isn't working. To overcome that, create a method on the Renderer which points
 *   to a symbol definition, like it is currently done with "arc" in PieSeries.
 * - Dom exception on showing/hiding the series
 */

(function (H) {
    H.wrap(H.seriesTypes.bar.prototype, 'translate', function(proceed) {
        var options = this.options,
            rTopRight = options.borderRadiusTopRight || 0,
            rBottomRight = options.borderRadiusBottomRight || 0,
            rBottomLeft = options.borderRadiusBottomLeft || 0,
            rTopLeft = options.borderRadiusTopLeft || 0;

        proceed.call(this);

        if (rTopRight || rBottomRight || rBottomLeft || rTopLeft) {
            H.each(this.points, function(point) {
                var shapeArgs = point.shapeArgs,
                    w = shapeArgs.width,
                    h = shapeArgs.height,
                    x = shapeArgs.x,
                    y = shapeArgs.y;

                // Preserve the box for data labels
                point.dlBox = point.shapeArgs;

                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        'M', x + rTopRight, y,
                        // top side
                        'L', x + w - rBottomRight, y,
                        // top right corner
                        'C', x + w - rBottomRight / 2, y, x + w, y + rBottomRight / 2, x + w, y + rBottomRight,
                        // right side
                        'L', x + w, y + h - rBottomLeft,
                        // bottom right corner
                        'C', x + w, y + h - rBottomLeft / 2, x + w - rBottomLeft / 2, y + h, x + w - rBottomLeft, y + h,
                        // bottom side
                        'L', x + rTopLeft, y + h,
                        // bottom left corner
                        'C', x + rTopLeft / 2, y + h, x, y + h - rTopLeft / 2, x, y + h - rTopLeft,
                        // left side
                        'L', x, y + rTopRight,
                        // top left corner
                        'C', x, y + rTopRight / 2, x + rTopRight / 2, y, x + rTopRight, y,
                        'Z'
                    ]
                };

            });
        }
    });
}(Highcharts));
