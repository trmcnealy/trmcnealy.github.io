var RequireVegaLiteSvg, RequireVegaLiteWebgl, VegaLiteScripts;

!function (global) {

    VegaLiteScripts = {};

    let vega_require = global.requirejs.config({
        context: "vega",
        paths: {
            "d3-color": "https://d3js.org/d3-color.v1.min",
            "vega": "https://cdn.jsdelivr.net/npm/vega?noext",
            "vega-lite": "https://cdn.jsdelivr.net/npm/vega-lite?noext",
            "vega-embed": "https://cdn.jsdelivr.net/npm/vega-embed?noext",
            "vega-webgl": "https://unpkg.com/vega-webgl-renderer/build/vega-webgl-renderer"
        },
        map: {
            '*': { 'vega-scenegraph': "vega" }
        }
    });

    function create2dArray(rows, columns) {
        return [...Array(rows).keys()].map(i => new Float32Array(columns));
    }

    function copyDataToBuffer(id, csharpVariable, dataDims) {

        const rows = dataDims.rows;
        const columns = dataDims.columns;

        if (rows === 0 || columns === 0) {
            return csharpVariable;
        }

        const vis_element = document.getElementById(`vis-${id}`);
        const canvas = vis_element.firstElementChild;
        const gl = canvas.getContext("webgl");

        const data = create2dArray(rows, columns);
        const buffers = new Array(rows);

        for (var i = 0; i < csharpVariable.length; ++i) {

            const obj = csharpVariable[i];

            var col_index = 0;
            for (const key in obj) {
                data[i][col_index++] = obj[key];
            }

            buffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, data[i], gl.STATIC_DRAW);
        }

        console.log("gl Buffer Enabled.");

        return data;
    }

    function updateViewDataId(view, id, variableName, csharpVariable, dataDims) {
        try {
            const data = copyDataToBuffer(id, csharpVariable, dataDims);
            view.data(variableName, data);
        } catch (err) {
            console.log(err);
        }
    }

    function renderVegaLiteWebgl(id, vegalite_spec) {
        return (d3Color, vega, vegaLite, vegaEmbed, vegaWebgl) => {

            const vlSpec = vegalite_spec;

            const opt = {
                renderer: "webgl",
                logLevel: vegaEmbed.Info
            };

            return vegaEmbed("#vis-" + `${id}`, vlSpec, opt);
        };
    }

    function renderVegaLiteSvg(id, vegalite_spec) {
        return (d3Color, vega, vegaLite, vegaEmbed, vegaWebgl) => {

            const vlSpec = vegalite_spec;

            const opt = {
                renderer: "svg",
                logLevel: vegaEmbed.Info
            };

            return vegaEmbed("#vis-" + `${id}`, vlSpec, opt);
        };
    }

    function Dims(rows, columns) {

        const dataDims = {
            "rows": rows,
            "columns": columns
        };

        return dataDims;
    }

    RequireVegaLiteWebgl = function(id, vegalite_spec, variableName, rows, columns) {

        const dataDims = Dims(rows, columns);

        vega_require(["d3-color", "vega", "vega-lite", "vega-embed", "vega-webgl"],
            function (d3Color, vega, vegaLite, vegaEmbed, vegaWebgl) {

                global.interactive.csharp.getVariable(variableName).then(function (csharpVariable) {

                    renderVegaLiteWebgl(id, vegalite_spec)(d3Color, vega, vegaLite, vegaEmbed, vegaWebgl).then(function (result) {

                        updateViewDataId(result.view, id, variableName, csharpVariable, dataDims);

                    });

                });
            });
    }
    
    RequireVegaLiteSvg = function(id, vegalite_spec) {

        vega_require(["d3-color", "vega", "vega-lite", "vega-embed", "vega-webgl"],
            function (d3Color, vega, vegaLite, vegaEmbed, vegaWebgl) {

                renderVegaLiteSvg(id, vegalite_spec)(d3Color, vega, vegaLite, vegaEmbed, vegaWebgl).then();

            });
    }

}(this);
