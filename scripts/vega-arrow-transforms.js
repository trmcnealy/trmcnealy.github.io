(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vega'), require('apache-arrow')) :
    typeof define === 'function' && define.amd ? define(['vega', 'apache-arrow'], factory) :
    (global = global || self, (global.vega = global.vega || {}, global.vega.transforms = global.vega.transforms || {}, global.vega.transforms.arrow = factory(global.vega, global.apacheArrow)));
}(this, (function (vega, apacheArrow) { 'use strict';

    var __awaiter = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    //arrow.predicate.col('precipitation').eq(0)
    function ArrowTransform(params) {
        vega.Transform.call(this, [], params);
    }
    ArrowTransform.DataTable = function (table_data) {
        if (table_data instanceof apacheArrow.Table) {
            this._dataTable = table_data;
        }
        if (table_data instanceof ArrayBuffer) {
            table_data = new Uint8Array(table_data);
            this._dataTable = apacheArrow.Table.from(Array.isArray(table_data) ? table_data : [table_data]);
        }
        return this._dataTable;
    };
    ArrowTransform.Definition = {
        type: "arrow_transform",
        metadata: { changes: true, source: true },
        params: [
            { name: "filter", type: "Predicate" },
            { name: "getColumn", type: "field" },
            { name: "getColumnAt", type: "number" },
            { name: "select", type: "field", array: true },
            { name: "selectAt", type: "number", array: true },
            { name: "slice", type: "param", "params": [{ name: "begin", type: "number" }, { name: "end", type: "number" }] }
        ]
    };
    const prototype = vega.inherits(ArrowTransform, vega.Transform);
    prototype.transform = function (_, pulse) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._dataTable) {
                throw Error("ArrowTransform missing data Table.");
            }
            let filter = _.filter;
            let getColumn = _.getColumn;
            let getColumnAt = _.getColumnAt;
            let select = _.select;
            let selectAt = _.selectAt;
            let slice = _.slice;
            let results = null;
            if (filter) {
                results = yield this._dataTable.filter(filter);
            }
            else if (getColumn) {
                results = yield this._dataTable.getColumn(getColumn);
            }
            else if (getColumnAt) {
                results = yield this._dataTable.getColumnAt(getColumnAt);
            }
            else if (select) {
                results = yield this._dataTable.select(select);
            }
            else if (selectAt) {
                results = yield this._dataTable.selectAt(selectAt);
            }
            else if (slice) {
                results = yield this._dataTable.slice(slice.get("begin"), slice.get("end"));
            }
            //results.forEach(ingest);
            for (var result in results) {
                vega.ingest(result);
            }
            const out = pulse.fork(pulse.NO_FIELDS & pulse.NO_SOURCE);
            out.rem = this._value;
            this._value = out.add = out.source = results;
            return out;
        });
    };

    return ArrowTransform;

})));
