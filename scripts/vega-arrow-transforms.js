(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('vega'), require('apache-arrow')) :
    typeof define === 'function' && define.amd ? define(['vega', 'apache-arrow'], factory) :
    (global = global || self, factory(global.vega, global.apacheArrow));
}(this, (function (vega, apacheArrow) { 'use strict';

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

})));
