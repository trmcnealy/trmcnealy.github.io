var RequireVegaLite, RequireVegaLiteData, RequireVegaLiteDataBuffered, VegaLiteLoaded;

! function (global) {

    //https://www.jsdelivr.com/package/npm/vega?path=src
    const vegaVersion = "5.10.0";

    //https://www.jsdelivr.com/package/npm/vega-lite?path=src
    const vegaLiteVersion = "4.8.1";

    //https://www.jsdelivr.com/package/npm/vega-embed?path=src
    const vegaEmbedVersion = "6.5.2";

    //https://www.jsdelivr.com/package/npm/vega-webgl-renderer
    const vegaWebglRendererVersion = "1.0.0-beta.2";

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

    function renderVegaLite(id, vegalite_spec, view_render) {
        return async (d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow) => {
            const vlSpec = vegalite_spec;

            // const opt = {
            //    renderer: "webgl",
            //    logLevel: vegaEmbed.Info
            //};
            // return vegaEmbed("#vis-" + `${id}`, vlSpec, opt);
            
            vega.formats("arrow", vegaLoaderArrow);

            const vgSpec = vegaLite.compile(vlSpec).spec;

            var view = new vega.View(vega.parse(vgSpec))
                .logLevel(vega.Error)
                .initialize("#vis-" + `${id}`)
                .renderer(view_render)
                .hover();

            if (vega) {
                global["vega"] = vega;
            } else {
                console.log("vega was not loaded.");
            }

            if (vegaLite) {
                global["vegaLite"] = vegaLite;
            } else {
                console.log("vegaLite was not loaded.");
            }

            if (vegaWebgl) {
                global["vegaWebgl"] = vegaWebgl;
            } else {
                console.log("vegaWebgl was not loaded.");
            }

            if (apacheArrow) {
                global["apacheArrow"] = apacheArrow;
            } else {
                console.log("apacheArrow was not loaded.");
            }

            if (vegaLoaderArrow) {
                global["vegaLoaderArrow"] = vegaLoaderArrow;
            } else {
                console.log("vegaLoaderArrow was not loaded.");
            }

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
        vega_require(["d3-color", "vega", "vega-lite", "vega-webgl", "apache-arrow", "vega-loader-arrow"],
            function(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow) {
                renderVegaLite(id, vegalite_spec, view_render)(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow).then(function(result) {

                    global["view"] = result.view;

                    result.view.run();
                });
            });
    };

    RequireVegaLiteData = function(id, vegalite_spec, view_render, variableName) {

        vega_require(["d3-color", "vega", "vega-lite", "vega-webgl", "apache-arrow", "vega-loader-arrow"],
            function(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow) {
                renderVegaLite(id, vegalite_spec, view_render)(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow).then(function(result) {
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

        vega_require(["d3-color", "vega", "vega-lite", "vega-webgl", "apache-arrow", "vega-loader-arrow"],
            function(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow) {
                renderVegaLite(id, vegalite_spec, "webgl")(d3Color, vega, vegaLite, vegaWebgl, apacheArrow, vegaLoaderArrow).then(function(result) {
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

    VegaLiteLoaded = new Event("vega-lite-loaded");

}("undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this);
