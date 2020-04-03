this.vega = this.vega || {};
this.vega.transforms = this.vega.transforms || {};
this.vega.transforms.arrow = (function (exports, vega, apacheArrow) {
    'use strict';

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
    class ArrowTransform extends vega.Transform {
        constructor(params) {
            super([], params);
            this._definition = null;
            this._value = null;
            this._definition = {
                type: "ArrowTransform",
                metadata: { changes: true, source: true },
                params: [
                    { name: "filter", type: "Predicate" },
                    { name: "getColumn", type: "field" },
                    { name: "getColumnAt", type: "number" },
                    { name: "select", type: "field", "array": true },
                    { name: "selectAt", type: "number", "array": true },
                    { name: "slice", type: "param", "params": [{ name: "begin", type: "number" }, { name: "end", type: "number" }] }
                ]
            };
            if (!vega.transforms["ArrowTransform"]) {
                vega.transforms["ArrowTransform"] = this;
            }
        }
        get Table() {
            return this._dataTable;
        }
        set Table(table_data) {
            if (table_data instanceof apacheArrow.Table) {
                this._dataTable = table_data;
            }
            if (table_data instanceof ArrayBuffer) {
                table_data = new Uint8Array(table_data);
                this._dataTable = apacheArrow.Table.from(Array.isArray(table_data) ? table_data : [table_data]);
            }
            this._dataTable = apacheArrow.Table.new(table_data);
        }
        get Definition() {
            return this._definition;
        }
        set Definition(value) {
            this._definition = value;
        }
        get Value() {
            return this._value;
        }
        set Value(value) {
            this._value = value;
        }
        transform(_, pulse) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._dataTable) {
                    throw Error("ArrowTransform missing data Table.");
                }
                const out = pulse.fork(pulse.NO_FIELDS & pulse.NO_SOURCE);
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
                out.rem = this._value;
                this._value = out.add = out.source = results;
                return out;
            });
        }
        ;
    }
    function register(Vega) {
        if ("undefined" !== Vega && !Vega.transforms["ArrowFilter"]) {
            Vega.transforms["ArrowFilter"] = ArrowTransform;
        }
    }
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
    exports.register = register;

    return exports;

}({}, vega, apacheArrow));
