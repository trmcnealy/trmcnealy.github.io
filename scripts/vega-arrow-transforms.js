import { Transform, ingest } from 'vega';
import { Table } from 'apache-arrow';

// ReSharper disable TsResolvedFromInaccessibleModule
// ReSharper disable QualifiedExpressionMaybeNull
var __awaiter = (window && window.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//var hop = Object.prototype.hasOwnProperty;
//function hasOwnProperty(object: any, property: string) {
//    return Object.prototype.hasOwnProperty.call(object, property);
//}
//arrow.predicate.col('precipitation').eq(0)
//export class Slice {
//    private _begin: number;
//    get begin() {
//        return this._begin;
//    }
//    set begin(value: number) {
//        this._begin = value;
//    }
//    private _end: number;
//    get end() {
//        return this._end;
//    }
//    set end(value: number) {
//        this._end = value;
//    }
//    constructor(begin: number, end: number) {
//        this._begin = begin;
//        this._end = end;
//    }
//}
class ArrowTransform extends Transform {
    constructor(params) {
        super([], params);
        this._value = null;
    }
    get Definition() {
        return ArrowTransform.Definition;
    }
    get Table() {
        return this._dataTable;
    }
    set Table(table_data) {
        if (table_data instanceof Table) {
            this._dataTable = table_data;
        }
        if (table_data instanceof ArrayBuffer) {
            table_data = new Uint8Array(table_data);
            this._dataTable = Table.from(Array.isArray(table_data) ? table_data : [table_data]);
        }
        this._dataTable = Table.new(table_data);
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
                ingest(result);
            }
            out.rem = this._value;
            this._value = out.add = out.source = results;
            return out;
        });
    }
    ;
}
ArrowTransform.isInitialized = false;
ArrowTransform.Definition = {
    "type": "arrow-transform",
    "metadata": { "changes": true, "source": true },
    "params": [
        { "name": "filter", "type": "Predicate" },
        { "name": "getColumn", "type": "field" },
        { "name": "getColumnAt", "type": "number" },
        { "name": "select", "type": "field", "array": true },
        { "name": "selectAt", "type": "number", "array": true },
        { "name": "slice", "type": "param", "params": [{ "name": "begin", "type": "number" }, { "name": "end", "type": "number" }] }
    ]
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

export default ArrowTransform;
