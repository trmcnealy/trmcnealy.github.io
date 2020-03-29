var RequireVegaLite, RequireVegaLiteData, RequireVegaLiteDataBuffered, VegaLiteLoaded;

!function(global) {
    //"vega-embed": "https://cdn.jsdelivr.net/npm/vega-embed?noext",
    let vega_require = global.requirejs.config({
        context: "vega",
        paths: {
            "d3-color": "https://d3js.org/d3-color.v1.min",
            "vega": "https://cdn.jsdelivr.net/npm/vega?noext",
            "vega-lite": "https://cdn.jsdelivr.net/npm/vega-lite?noext",
            "vega-webgl": "https://cdn.jsdelivr.net/npm/vega-webgl-renderer?noext",
            "apache-arrow": "https://cdn.jsdelivr.net/npm/apache-arrow?noext",
            "vega-loader-arrow": "https://cdn.jsdelivr.net/npm/vega-loader-arrow?noext"
        },
        map: { '*': { 'vega-scenegraph': "vega" } }
    });

    function create2dArray(rows, columns) {
        return [...Array(rows).keys()].map(i => new Float32Array(columns));
    }

    async function clientGetVariable(rootUrl, variable) {
        let response = await fetch(`${rootUrl}variables/csharp/${variable}`, { method: "GET", cache: "no-cache", mode: "cors" });
        let variableBundle = await response.json();
        return variableBundle;
    };

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

    //TODO
    //https://github.com/apache/arrow/tree/master/js

    function renderVegaLite(id, vegalite_spec, view_render) {
        return async(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl) => {
            const vlSpec = vegalite_spec;

            // const opt = {
            //    renderer: "webgl",
            //    logLevel: vegaEmbed.Info
            //};
            // return vegaEmbed("#vis-" + `${id}`, vlSpec, opt);

            vegaLite.vega.formats("arrow", await require("vega-loader-arrow@0.0.6"));

            vegaLite.vega.formats("arrow", vegaLoaderArrow);

            const vgSpec = vegaLite.compile(vlSpec).spec;

            var view = new vega.View(vega.parse(vgSpec))
                .logLevel(vega.Error)
                .initialize(`#vis-${id}`)
                .renderer(view_render)
                .hover();

            window["vega"] = vega;
            window["vegaLite"] = vegaLite;
            //window["vegaEmbed"] = vegaEmbed;
            window["apacheArrow"] = apacheArrow;
            window["vegaLoaderArrow"] = vegaLoaderArrow;
            window["vegaWebgl"] = vegaWebgl;

            return new Promise((function*() {
                return {
                    view: view,
                    spec: vlSpec,
                    vgSpec: vgSpec
                };
            }));
        };
    }

    function Dims(rows, columns) {

        const dataDims = { "rows": rows, "columns": columns };

        return dataDims;
    }

    async function GetVariable(variableName) {

        const scripts = document.getElementsByTagName("script");

        for (const script of scripts) {
            const status = script.getAttribute("data-requiremodule");
            if (status === "dotnet-interactive/dotnet-interactive") {
                const dotnet_script = script.src;

                const rootUrl = dotnet_script.substring(0, dotnet_script.length - 31);

                let csharpVariable = await clientGetVariable(rootUrl, variableName).then(function(variable) {
                    return variable;
                });

                if (csharpVariable !== null) {
                    return csharpVariable;
                }
            }
        }

        return [];
    }

    RequireVegaLite = function(id, vegalite_spec, view_render) {
        vega_require(["d3-color", "vega", "vega-lite", "apache-arrow", "vega-loader-arrow", "vega-webgl"],
            function(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl) {
                renderVegaLite(id, vegalite_spec, view_render)(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl).then(function(result) {

                    global["view"] = result.view;

                    result.view.run();
                });
            });
    };

    RequireVegaLiteData = function(id, vegalite_spec, view_render, variableName) {

        vega_require(["d3-color", "vega", "vega-lite", "apache-arrow", "vega-loader-arrow", "vega-webgl"],
            function(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl) {
                renderVegaLite(id, vegalite_spec, view_render)(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl).then(function(result) {
                    GetVariable(variableName).then((csharpVariable) => {

                        //result.view.data(variableName, csharpVariable);
                        result.view.insert(variableName, csharpVariable);

                        global["view"] = result.view;

                        result.view.run();
                    });
                });
            });
    };

    RequireVegaLiteDataBuffered = function(id, vegalite_spec, variableName, rows, columns) {

        const dataDims = Dims(rows, columns);

        vega_require(["d3-color", "vega", "vega-lite", "apache-arrow", "vega-loader-arrow", "vega-webgl"],
            function(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl) {
                renderVegaLite(id, vegalite_spec, "webgl")(d3Color, vega, vegaLite, apacheArrow, vegaLoaderArrow, vegaWebgl).then(function(result) {
                    GetVariable(variableName).then((csharpVariable) => {

                        const data = copyDataToBuffer(id, csharpVariable, dataDims);

                        // result.view.data(variableName, csharpVariable);
                        // result.view._runtime.data[variableName].values = data;
                        // result.view.data(variableName, data);

                        result.view.insert(variableName, data);

                        global["view"] = result.view;

                        result.view.run();
                    });
                });
            });
    };

    //RequireVegaLiteSvg = function(id, vegalite_spec) {
    //    vega_require(["d3-color", "vega", "vega-lite", "vega-embed", "vega-webgl"], function(d3Color, vega, vegaLite, vegaEmbed, vegaWebgl) {
    //            renderVegaLiteSvg(id, vegalite_spec)(d3Color, vega, vegaLite, vegaEmbed, vegaWebgl).then(function(result) {
    //
    //                global["view"] = result.view;
    //
    //                result.view.run();
    //            });
    //        });
    //};

    VegaLiteLoaded = new Event("vega-lite-loaded");
}(this);