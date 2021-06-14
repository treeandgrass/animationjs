var anime;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/animation.ts":
/*!**************************!*\
  !*** ./src/animation.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Animation = void 0;
var Animation = /** @class */ (function () {
    function Animation() {
    }
    return Animation;
}());
exports.Animation = Animation;


/***/ }),

/***/ "./src/effect.ts":
/*!***********************!*\
  !*** ./src/effect.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Effect = void 0;
var Effect = /** @class */ (function () {
    function Effect() {
    }
    return Effect;
}());
exports.Effect = Effect;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.play = void 0;
var bezierEasing_1 = __webpack_require__(/*! ./timings/bezierEasing */ "./src/timings/bezierEasing.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
__exportStar(__webpack_require__(/*! ./animation */ "./src/animation.ts"), exports);
__exportStar(__webpack_require__(/*! ./effect */ "./src/effect.ts"), exports);
var play = function (id) {
    var duration = 5000;
    var value = 300;
    var target = document.getElementById(id);
    var current = 0;
    var start = 0;
    var run = function (t) {
        if (!start)
            start = t;
        current = t;
        var timing = bezierEasing_1.easeInOut(utils_1.minMax(current - start, 0, duration) / duration);
        target.style.transform = "translateX(" + timing * value + "px)";
        if (current - start <= duration) {
            requestAnimationFrame(run);
        }
        else {
            start = 0;
        }
    };
    requestAnimationFrame(function (t) {
        run(t);
    });
};
exports.play = play;


/***/ }),

/***/ "./src/timings/bezierEasing.ts":
/*!*************************************!*\
  !*** ./src/timings/bezierEasing.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.easeInOut = exports.easeOut = exports.easeIn = exports.linear = exports.ease = exports.bezier = void 0;
/**
 * bezierEasing
 * copy from https://github.com/gre/bezier-easing
 */
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
var float32ArraySupported = typeof Float32Array === 'function';
var A = function (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; };
var B = function (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; };
var C = function (aA1) { return 3.0 * aA1; };
var calcBezier = function (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; };
var getSlope = function (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); };
var binarySubdivide = function (aX, aA, aB, mX1, mX2) {
    var currentX = 0;
    var currentT = 0;
    var i = 0;
    do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
            aB = currentT;
        }
        else {
            aA = currentT;
        }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
};
var newtonRaphsonIterate = function (aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
            return aGuessT;
        }
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
};
var LinearEasing = function (x) { return x; };
var bezier = function (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        throw new Error('bezier x values must be in [0, 1] range');
    }
    if (mX1 === mY1 && mX2 === mY2) {
        return LinearEasing;
    }
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
    var getTForX = function (aX) {
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;
        for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }
        --currentSample;
        var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        }
        if (initialSlope === 0.0) {
            return guessForT;
        }
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    };
    var BezierEasing = function (x) {
        if (x === 0 || x === 1) {
            return x;
        }
        return calcBezier(getTForX(x), mY1, mY2);
    };
    return BezierEasing;
};
exports.bezier = bezier;
/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function
 */
exports.ease = exports.bezier(0.25, 0.1, 0.25, 1.0);
exports.linear = exports.bezier(0.0, 0.0, 1.0, 1.0);
exports.easeIn = exports.bezier(0.42, 0, 1.0, 1.0);
exports.easeOut = exports.bezier(0, 0, 0.58, 1.0);
exports.easeInOut = exports.bezier(0.42, 0, 0.58, 1.0);


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.minMax = void 0;
var minMax = function (target, min, max) { return Math.min(Math.max(target, min), max); };
exports.minMax = minMax;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	anime = __webpack_exports__.play;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hbmltZS8uL3NyYy9hbmltYXRpb24udHMiLCJ3ZWJwYWNrOi8vYW5pbWUvLi9zcmMvZWZmZWN0LnRzIiwid2VicGFjazovL2FuaW1lLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2FuaW1lLy4vc3JjL3RpbWluZ3MvYmV6aWVyRWFzaW5nLnRzIiwid2VicGFjazovL2FuaW1lLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2FuaW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FuaW1lL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0lBQUE7SUFDQSxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUFDO0FBRFksOEJBQVM7Ozs7Ozs7Ozs7Ozs7O0FDQXRCO0lBQUE7SUFFQSxDQUFDO0lBQUQsYUFBQztBQUFELENBQUM7QUFGWSx3QkFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQW5CLHdHQUFrRDtBQUNsRCxtRUFBZ0M7QUFFaEMsb0ZBQTJCO0FBQzNCLDhFQUF3QjtBQUVqQixJQUFNLElBQUksR0FBRyxVQUFDLEVBQVU7SUFDN0IsSUFBTSxRQUFRLEdBQUcsSUFBSTtJQUNyQixJQUFNLEtBQUssR0FBRyxHQUFHO0lBRWpCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDO0lBQzFDLElBQUksT0FBTyxHQUFHLENBQUM7SUFDZixJQUFJLEtBQUssR0FBRyxDQUFDO0lBQ2IsSUFBTSxHQUFHLEdBQUcsVUFBQyxDQUFTO1FBQ3BCLElBQUksQ0FBQyxLQUFLO1lBQUUsS0FBSyxHQUFHLENBQUM7UUFDckIsT0FBTyxHQUFHLENBQUM7UUFDWCxJQUFNLE1BQU0sR0FBRyx3QkFBUyxDQUFDLGNBQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDekUsTUFBTSxDQUFDLEtB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TSxVQTRDbEI7QUFFRDs7R0FFRztBQUNVLFlBQUksR0FBRyxjQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO0FBQ25DLGNBQU0sR0FBRyxjQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ25DLGNBQU0sR0FBRyxjQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0FBQ2xDLGVBQU8sR0FBRyxjQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO0FBQ2pDLGlCQUFTLEdBQUcsY0FBTSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN6RzVDLElBQU0sTUFBTSxHQUFHLFVBQUMsTUFBYyxFQUFFLEdBQVcsRUFBRSxHQUFXLElBQUssV0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBcEMsQ0FBb0M7QUFBM0YsY0FBTSxVQUFxRjs7Ozs7OztVQ0F4RztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VDdEJBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XG59XG4iLCJleHBvcnQgY2xhc3MgRWZmZWN0IHtcblxufVxuIiwiaW1wb3J0IHsgZWFzZUluT3V0IH0gZnJvbSAnLi90aW1pbmdzL2JlemllckVhc2luZydcbmltcG9ydCB7IG1pbk1heCB9IGZyb20gJy4vdXRpbHMnXG5cbmV4cG9ydCAqIGZyb20gJy4vYW5pbWF0aW9uJ1xuZXhwb3J0ICogZnJvbSAnLi9lZmZlY3QnXG5cbmV4cG9ydCBjb25zdCBwbGF5ID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgY29uc3QgZHVyYXRpb24gPSA1MDAwXG4gIGNvbnN0IHZhbHVlID0gMzAwXG5cbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGxldCBjdXJyZW50ID0gMFxuICBsZXQgc3RhcnQgPSAwXG4gIGNvbnN0IHJ1biA9ICh0OiBudW1iZXIpID0+IHtcbiAgICBpZiAoIXN0YXJ0KSBzdGFydCA9IHRcbiAgICBjdXJyZW50ID0gdFxuICAgIGNvbnN0IHRpbWluZyA9IGVhc2VJbk91dChtaW5NYXgoY3VycmVudCAtIHN0YXJ0LCAwLCBkdXJhdGlvbikgLyBkdXJhdGlvbilcbiAgICB0YXJnZXQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aW1pbmcgKiB2YWx1ZX1weClgXG4gICAgaWYgKGN1cnJlbnQgLSBzdGFydCA8PSBkdXJhdGlvbikge1xuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJ1bilcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnQgPSAwXG4gICAgfVxuICB9XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSgodCkgPT4ge1xuICAgIHJ1bih0KVxuICB9KVxufVxuIiwiLyoqXG4gKiBiZXppZXJFYXNpbmdcbiAqIGNvcHkgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZ3JlL2Jlemllci1lYXNpbmdcbiAqL1xuY29uc3QgTkVXVE9OX0lURVJBVElPTlMgPSA0XG5jb25zdCBORVdUT05fTUlOX1NMT1BFID0gMC4wMDFcbmNvbnN0IFNVQkRJVklTSU9OX1BSRUNJU0lPTiA9IDAuMDAwMDAwMVxuY29uc3QgU1VCRElWSVNJT05fTUFYX0lURVJBVElPTlMgPSAxMFxuXG5jb25zdCBrU3BsaW5lVGFibGVTaXplID0gMTFcbmNvbnN0IGtTYW1wbGVTdGVwU2l6ZSA9IDEuMCAvIChrU3BsaW5lVGFibGVTaXplIC0gMS4wKVxuXG5jb25zdCBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPSB0eXBlb2YgRmxvYXQzMkFycmF5ID09PSAnZnVuY3Rpb24nXG5cbmNvbnN0IEEgPSAoYUExOiBudW1iZXIsIGFBMjogbnVtYmVyKSA9PiAxLjAgLSAzLjAgKiBhQTIgKyAzLjAgKiBhQTFcbmNvbnN0IEIgPSAoYUExOiBudW1iZXIsIGFBMjogbnVtYmVyKSA9PiAzLjAgKiBhQTIgLSA2LjAgKiBhQTFcbmNvbnN0IEMgPSAoYUExOiBudW1iZXIpID0+IDMuMCAqIGFBMVxuXG5jb25zdCBjYWxjQmV6aWVyID0gKGFUOiBudW1iZXIsIGFBMTogbnVtYmVyLCBhQTI6IG51bWJlcikgPT4gKChBKGFBMSwgYUEyKSAqIGFUICsgQihhQTEsIGFBMikpICogYVQgKyBDKGFBMSkpICogYVRcblxuY29uc3QgZ2V0U2xvcGUgPSAoYVQ6IG51bWJlciwgYUExOiBudW1iZXIsIGFBMjogbnVtYmVyKSA9PiAzLjAgKiBBKGFBMSwgYUEyKSAqIGFUICogYVQgKyAyLjAgKiBCKGFBMSwgYUEyKSAqIGFUICsgQyhhQTEpXG5cbmNvbnN0IGJpbmFyeVN1YmRpdmlkZSA9IChhWDogbnVtYmVyLCBhQTogbnVtYmVyLCBhQjogbnVtYmVyLCBtWDE6IG51bWJlciwgbVgyOiBudW1iZXIpID0+IHtcbiAgbGV0IGN1cnJlbnRYID0gMFxuICBsZXQgY3VycmVudFQgPSAwXG4gIGxldCBpID0gMFxuICBkbyB7XG4gICAgY3VycmVudFQgPSBhQSArIChhQiAtIGFBKSAvIDIuMFxuICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0gYVhcbiAgICBpZiAoY3VycmVudFggPiAwLjApIHtcbiAgICAgIGFCID0gY3VycmVudFRcbiAgICB9IGVsc2Uge1xuICAgICAgYUEgPSBjdXJyZW50VFxuICAgIH1cbiAgfSB3aGlsZSAoTWF0aC5hYnMoY3VycmVudFgpID4gU1VCRElWSVNJT05fUFJFQ0lTSU9OICYmICsraSA8IFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TKVxuICByZXR1cm4gY3VycmVudFRcbn1cblxuY29uc3QgbmV3dG9uUmFwaHNvbkl0ZXJhdGUgPSAoYVg6IG51bWJlciwgYUd1ZXNzVDogbnVtYmVyLCBtWDE6IG51bWJlciwgbVgyOiBudW1iZXIpID0+IHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBORVdUT05fSVRFUkFUSU9OUzsgKytpKSB7XG4gICAgY29uc3QgY3VycmVudFNsb3BlID0gZ2V0U2xvcGUoYUd1ZXNzVCwgbVgxLCBtWDIpXG4gICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSB7XG4gICAgICByZXR1cm4gYUd1ZXNzVFxuICAgIH1cbiAgICBjb25zdCBjdXJyZW50WCA9IGNhbGNCZXppZXIoYUd1ZXNzVCwgbVgxLCBtWDIpIC0gYVhcbiAgICBhR3Vlc3NUIC09IGN1cnJlbnRYIC8gY3VycmVudFNsb3BlXG4gIH1cbiAgcmV0dXJuIGFHdWVzc1Rcbn1cblxuY29uc3QgTGluZWFyRWFzaW5nID0gKHg6IG51bWJlcikgPT4geFxuXG5leHBvcnQgY29uc3QgYmV6aWVyID0gKG1YMTogbnVtYmVyLCBtWTE6IG51bWJlciwgbVgyOiBudW1iZXIsIG1ZMjogbnVtYmVyKSA9PiB7XG4gIGlmICghKDAgPD0gbVgxICYmIG1YMSA8PSAxICYmIDAgPD0gbVgyICYmIG1YMiA8PSAxKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignYmV6aWVyIHggdmFsdWVzIG11c3QgYmUgaW4gWzAsIDFdIHJhbmdlJylcbiAgfVxuXG4gIGlmIChtWDEgPT09IG1ZMSAmJiBtWDIgPT09IG1ZMikge1xuICAgIHJldHVybiBMaW5lYXJFYXNpbmdcbiAgfVxuXG4gIGNvbnN0IHNhbXBsZVZhbHVlcyA9IGZsb2F0MzJBcnJheVN1cHBvcnRlZCA/IG5ldyBGbG9hdDMyQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSkgOiBuZXcgQXJyYXkoa1NwbGluZVRhYmxlU2l6ZSlcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBrU3BsaW5lVGFibGVTaXplOyArK2kpIHtcbiAgICBzYW1wbGVWYWx1ZXNbaV0gPSBjYWxjQmV6aWVyKGkgKiBrU2FtcGxlU3RlcFNpemUsIG1YMSwgbVgyKVxuICB9XG5cbiAgY29uc3QgZ2V0VEZvclggPSAoYVg6IG51bWJlcikgPT4ge1xuICAgIGxldCBpbnRlcnZhbFN0YXJ0ID0gMC4wXG4gICAgbGV0IGN1cnJlbnRTYW1wbGUgPSAxXG4gICAgY29uc3QgbGFzdFNhbXBsZSA9IGtTcGxpbmVUYWJsZVNpemUgLSAxXG5cbiAgICBmb3IgKDsgY3VycmVudFNhbXBsZSAhPT0gbGFzdFNhbXBsZSAmJiBzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0gPD0gYVg7ICsrY3VycmVudFNhbXBsZSkge1xuICAgICAgaW50ZXJ2YWxTdGFydCArPSBrU2FtcGxlU3RlcFNpemVcbiAgICB9XG4gICAgLS1jdXJyZW50U2FtcGxlXG5cbiAgICBjb25zdCBkaXN0ID0gKGFYIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSAvIChzYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZSArIDFdIC0gc2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKVxuICAgIGNvbnN0IGd1ZXNzRm9yVCA9IGludGVydmFsU3RhcnQgKyBkaXN0ICoga1NhbXBsZVN0ZXBTaXplXG5cbiAgICBjb25zdCBpbml0aWFsU2xvcGUgPSBnZXRTbG9wZShndWVzc0ZvclQsIG1YMSwgbVgyKVxuICAgIGlmIChpbml0aWFsU2xvcGUgPj0gTkVXVE9OX01JTl9TTE9QRSkge1xuICAgICAgcmV0dXJuIG5ld3RvblJhcGhzb25JdGVyYXRlKGFYLCBndWVzc0ZvclQsIG1YMSwgbVgyKVxuICAgIH1cbiAgICBpZiAoaW5pdGlhbFNsb3BlID09PSAwLjApIHtcbiAgICAgIHJldHVybiBndWVzc0ZvclRcbiAgICB9XG4gICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIGtTYW1wbGVTdGVwU2l6ZSwgbVgxLCBtWDIpXG4gIH1cblxuICBjb25zdCBCZXppZXJFYXNpbmcgPSAoeDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKHggPT09IDAgfHwgeCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHhcbiAgICB9XG4gICAgcmV0dXJuIGNhbGNCZXppZXIoZ2V0VEZvclgoeCksIG1ZMSwgbVkyKVxuICB9XG4gIHJldHVybiBCZXppZXJFYXNpbmdcbn1cblxuLyoqXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGVhc2UgPSBiZXppZXIoMC4yNSwgMC4xLCAwLjI1LCAxLjApXG5leHBvcnQgY29uc3QgbGluZWFyID0gYmV6aWVyKDAuMCwgMC4wLCAxLjAsIDEuMClcbmV4cG9ydCBjb25zdCBlYXNlSW4gPSBiZXppZXIoMC40MiwgMCwgMS4wLCAxLjApXG5leHBvcnQgY29uc3QgZWFzZU91dCA9IGJlemllcigwLCAwLCAwLjU4LCAxLjApXG5leHBvcnQgY29uc3QgZWFzZUluT3V0ID0gYmV6aWVyKDAuNDIsIDAsIDAuNTgsIDEuMClcbiIsImV4cG9ydCBjb25zdCBtaW5NYXggPSAodGFyZ2V0OiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikgPT4gTWF0aC5taW4oTWF0aC5tYXgodGFyZ2V0LCBtaW4pLCBtYXgpXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9