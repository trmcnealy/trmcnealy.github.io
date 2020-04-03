(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vega'), require('apache-arrow')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vega', 'apache-arrow'], factory) :
    (global = global || self, factory((global.vega = global.vega || {}, global.vega.transforms = global.vega.transforms || {}, global.vega.transforms.arrow = {}), global.vega, global.apacheArrow));
}(this, (function (exports, vega, apacheArrow) { 'use strict';

    // ReSharper disable TsResolvedFromInaccessibleModule
    // ReSharper disable QualifiedExpressionMaybeNull
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    //arrow.predicate.col('precipitation').eq(0)
    class Slice {
        constructor(begin, end) {
            this._begin = begin;
            this._end = end;
        }
        get begin() {
            return this._begin;
        }
        set begin(value) {
            this._begin = value;
        }
        get end() {
            return this._end;
        }
        set end(value) {
            this._end = value;
        }
    }
    //ArrowTransform.staticconstructor();
    //
    //export function register(Vega: any) {
    //    if ("undefined" !== Vega && !Vega.transforms["arrow-transform"]) {
    //        Vega.transforms["arrow-transform"] = ArrowTransform;
    //    }
    //}
    // TODO
    //Map 
    //    hours = (function () {
    //        const arr = [];
    //        for (const x of rainfall.getColumn('date')) {
    //            arr.push(x.getHours())
    //        }
    //        return arr;
    //    }())
    //Scan
    //    (function () {
    //        const vec = rainfall.getColumn('precipitation')
    //        let highIdx = 0;
    //        rainfall.scan((idx) => { highIdx = vec.get(idx) > vec.get(highIdx) ? idx : highIdx; })
    //        const row = rainfall.get(highIdx)
    //        return `${row.date} => ${row.precipitation} inches`
    //    }())

    exports.Slice = Slice;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
