import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PolylineUtilService {

  private defaultOptions = function (options) {
    if (typeof options === 'number') {
      // Legacy
      options = {
        precision: options
      };
    } else {
      options = options || {};
    }

    options.precision = options.precision || 5;
    options.factor = options.factor || Math.pow(10, options.precision);
    options.dimension = options.dimension || 2;
    return options;
  };

  encode(points, options) {
    options = this.defaultOptions(options);

    var flatPoints = [];
    for (var i = 0, len = points.length; i < len; ++i) {
      var point = points[i];

      if (options.dimension === 2) {
        flatPoints.push(point.lat || point[0]);
        flatPoints.push(point.lng || point[1]);
      } else {
        for (var dim = 0; dim < options.dimension; ++dim) {
          flatPoints.push(point[dim]);
        }
      }
    }

    return this.encodeDeltas(flatPoints, options);
  }

  decode(encoded, options) {
    options = this.defaultOptions(options);

    var flatPoints = this.decodeDeltas(encoded, options);

    var points = [];
    for (var i = 0, len = flatPoints.length; i + (options.dimension - 1) < len;) {
      var point = [];

      for (var dim = 0; dim < options.dimension; ++dim) {
        point.push(flatPoints[i++]);
      }

      points.push(point);
    }

    return points;
  }

  encodeDeltas(numbers, options) {
    options = this.defaultOptions(options);

    var lastNumbers = [];

    for (var i = 0, len = numbers.length; i < len;) {
      for (var d = 0; d < options.dimension; ++d, ++i) {
        var num = numbers[i];
        var delta = num - (lastNumbers[d] || 0);
        lastNumbers[d] = num;

        numbers[i] = delta;
      }
    }

    return this.encodeFloats(numbers, options);
  }

  decodeDeltas(encoded, options) {
    options = this.defaultOptions(options);

    var lastNumbers = [];

    var numbers = this.decodeFloats(encoded, options);
    for (var i = 0, len = numbers.length; i < len;) {
      for (var d = 0; d < options.dimension; ++d, ++i) {
        numbers[i] = Math.round((lastNumbers[d] = numbers[i] + (lastNumbers[d] || 0)) * options.factor) / options.factor;
      }
    }

    return numbers;
  }

  encodeFloats(numbers, options) {
    options = this.defaultOptions(options);

    for (var i = 0, len = numbers.length; i < len; ++i) {
      numbers[i] = Math.round(numbers[i] * options.factor);
    }

    return this.encodeSignedIntegers(numbers);
  }

  decodeFloats(encoded, options) {
    options = this.defaultOptions(options);

    var numbers = this.decodeSignedIntegers(encoded);
    for (var i = 0, len = numbers.length; i < len; ++i) {
      numbers[i] /= options.factor;
    }

    return numbers;
  }

  encodeSignedIntegers(numbers) {
    for (var i = 0, len = numbers.length; i < len; ++i) {
      var num = numbers[i];
      numbers[i] = (num < 0) ? ~(num << 1) : (num << 1);
    }

    return this.encodeUnsignedIntegers(numbers);
  }

  decodeSignedIntegers(encoded) {
    var numbers = this.decodeUnsignedIntegers(encoded);

    for (var i = 0, len = numbers.length; i < len; ++i) {
      var num = numbers[i];
      numbers[i] = (num & 1) ? ~(num >> 1) : (num >> 1);
    }

    return numbers;
  }

  encodeUnsignedIntegers(numbers) {
    var encoded = '';
    for (var i = 0, len = numbers.length; i < len; ++i) {
      encoded += this.encodeUnsignedInteger(numbers[i]);
    }
    return encoded;
  }

  decodeUnsignedIntegers(encoded) {
    var numbers = [];

    var current = 0;
    var shift = 0;

    for (var i = 0, len = encoded.length; i < len; ++i) {
      var b = encoded.charCodeAt(i) - 63;

      current |= (b & 0x1f) << shift;

      if (b < 0x20) {
        numbers.push(current);
        current = 0;
        shift = 0;
      } else {
        shift += 5;
      }
    }

    return numbers;
  }

  encodeSignedInteger(num) {
    num = (num < 0) ? ~(num << 1) : (num << 1);
    return this.encodeUnsignedInteger(num);
  }

  // This function is very similar to Google's, but I added
  // some stuff to deal with the double slash issue.
  encodeUnsignedInteger(num) {
    var value, encoded = '';
    while (num >= 0x20) {
      value = (0x20 | (num & 0x1f)) + 63;
      encoded += (String.fromCharCode(value));
      num >>= 5;
    }
    value = num + 63;
    encoded += (String.fromCharCode(value));

    return encoded;
  }
}
