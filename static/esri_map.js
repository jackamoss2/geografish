// sha256 function from https://geraintluff.github.io/sha256/
var sha256=function a(b){function c(a,b){return a>>>b|a<<32-b}for(var d,e,f=Math.pow,g=f(2,32),h="length",i="",j=[],k=8*b[h],l=a.h=a.h||[],m=a.k=a.k||[],n=m[h],o={},p=2;64>n;p++)if(!o[p]){for(d=0;313>d;d+=p)o[d]=p;l[n]=f(p,.5)*g|0,m[n++]=f(p,1/3)*g|0}for(b+="\x80";b[h]%64-56;)b+="\x00";for(d=0;d<b[h];d++){if(e=b.charCodeAt(d),e>>8)return;j[d>>2]|=e<<(3-d)%4*8}for(j[j[h]]=k/g|0,j[j[h]]=k,e=0;e<j[h];){var q=j.slice(e,e+=16),r=l;for(l=l.slice(0,8),d=0;64>d;d++){var s=q[d-15],t=q[d-2],u=l[0],v=l[4],w=l[7]+(c(v,6)^c(v,11)^c(v,25))+(v&l[5]^~v&l[6])+m[d]+(q[d]=16>d?q[d]:q[d-16]+(c(s,7)^c(s,18)^s>>>3)+q[d-7]+(c(t,17)^c(t,19)^t>>>10)|0),x=(c(u,2)^c(u,13)^c(u,22))+(u&l[1]^u&l[2]^l[1]&l[2]);l=[w+x|0].concat(l),l[4]=l[4]+w|0}for(d=0;8>d;d++)l[d]=l[d]+r[d]|0}for(d=0;8>d;d++)for(e=3;e+1;e--){var y=l[d]>>8*e&255;i+=(16>y?0:"")+y.toString(16)}return i};

let vm = new Vue({
    el: "#app",
    delimiters: ['{&', '&}'],
    data: {
        csrftoken: '',
        mapID: '',
        mapTitle: '',
        loading: false,
        testPoints: [[-122.6784,45.5152],],
        map: null,
        view: null,
        layerToggles: null,
        dataLayers: [], // list of objects containing data id, name, visibility - visibility not used anywhere
        // const fileSelector = document.getElementById('file-selector');
    },
    methods: {
        loadMap: function(action, data=null, renderers=null,) {
            require(["esri/config","esri/Map","esri/views/MapView","esri/Graphic","esri/layers/GraphicsLayer","esri/layers/GeoJSONLayer","esri/widgets/Expand",],
            function(esriConfig, Map, MapView, Graphic, GraphicsLayer, GeoJSONLayer, Expand,) {
                let colorOptions = [
                    {name:"Red",hex:"#FF0000"},
                    {name:"Pink",hex:"#FFC0CB"},
                    {name:"Magenta",hex:"#FF00FF"},
                    {name:"Purple",hex:"#9B30FF"},
                    {name:"Blue",hex:"#0000FF"},
                    {name:'Turquoise',hex:"#00F5FF"},
                    {name:'Steel Blue',hex:"#4682B4"},
                    {name:'Lime Green',hex:"#00FF00"},
                    {name:'Forest Green',hex:"#228B22"},
                    {name:'Yellow',hex:"#FFFF00"},
                    {name:"Goldenrod",hex:"#DAA520"},
                    {name:'Brick',hex:"#9C661F"},
                    {name:'Black',hex:"#000000"},
                    {name:'Dark Gray',hex:"#5B5B5B"},
                    {name:'Light Gray',hex:"#C1C1C1"},
                    {name:'White',hex:"#FFFFFF"},
                ]
                
                if (action == 'initiate') {
                    esriConfig.apiKey = "AAPKa69c01d84be143d2aed0ad78c6386646fab0glupksy3eawHfYb4yW1TrjMS8hwjuF8YpsVqpzPfq0xCKaz-k-sIq9hXymW9"
                    vm.map = new Map({
                        basemap: "arcgis-topographic" // Basemap layer service
                    })
                    vm.view = new MapView({
                        map: vm.map,
                        center: [-122.6784,45.5152], // long, lat
                        zoom: 9,
                        container: "viewDiv", // Div element
                        constraints: {
                            maxScale: 35000
                        },
                    })
                    vm.view.popup.defaultPopupTemplateEnabled = true
                    
                    const expand = new Expand({
                        view: vm.view,
                        content: document.getElementById("rendererDiv"),
                        expanded: true,
                        expandIconClass: "esri-icon-layers",
                        
                        // container: document.getElementById("viewDiv"),
                        mode: "floating",
                    })
                    
                    vm.view.ui.add(expand, "top-right");
                }

                // renders geojson on map, creates html elements for visual changes Expand panel
                // takes geospatial_data object which contains geojson
                const createAddGeoJsonLayer = (geospatial_data, visibility=true) => {
                    // create arcgis objects and add to map
                    geojson = geospatial_data.geospatial_data
                    // if (geojson == undefined) {
                    //     geojson = geospatial_data
                    // }
                    const blob = new Blob([JSON.stringify(geojson)], {
                        type: "application/json"
                    })
                    const url = URL.createObjectURL(blob)
                    const geojsonlayer = new GeoJSONLayer({
                        url,
                    })
                    let selectedRenderer
                    
                    // if renderer connected to both map and data is found, apply to layer
                    if (renderers) {
                        for (let renderer of renderers) {
                            if (renderer.linked_data_id == geospatial_data.id) {
                                selectedRenderer = renderer.renderer
                                geojsonlayer.renderer = selectedRenderer
                            }
                        }
                    }
                    vm.map.layers.add(geojsonlayer)      
                    
                    // add visibility toggle html elements
                    const node = document.createElement("li") // "node" is the line containing html elements specific to this layer
                    const visibilityButtonNode = document.createElement("input")
                    visibilityButtonNode.id = "layer-toggle"
                    visibilityButtonNode.type = "checkbox"
                    if (visibility === true) {
                        visibilityButtonNode.checked = true
                        geojsonlayer.visible = true
                    }
                    else {
                        visibilityButtonNode.checked = false
                        geojsonlayer.visible = false
                    }
                    // let functionText = "toggleLayerVisibility(" + String(geospatial_data.id) + ")"
                    // visibilityButtonNode.setAttribute("v-on:click", functionText)
                    visibilityButtonNode.addEventListener("change", () => {
                        geojsonlayer.visible = visibilityButtonNode.checked
                    })
                    node.appendChild(visibilityButtonNode)

                    const textNode = document.createTextNode(geojson.name)
                    node.appendChild(textNode)

                    // modify layer display panel
                    const modifyButtonNode = document.createElement("span")
                    modifyButtonNode.classList.add("esri-icon-edit")
                    modifyButtonNode.setAttribute("aria-label", "close icon")
                    // modifyButtonNode.textContent='\ue61d' // todo: change text to gear symbol, same as expand
                    modifyButtonNode.addEventListener("click", (event) => {
                        let expandModify = document.getElementById("expand-modify")
                        expandModify.style.display = "block"
                        let expandDefault = document.getElementById("expand-default")
                        expandDefault.style.display = "none"
                        
                        function createRenderer(type) { // are any of these properties specific to points?
                            if (type == "Point") {
                                selectedRenderer = {
                                    type: "simple",
                                    symbol: {
                                        type: "simple-marker",
                                        color: colorSelection.value,
                                        outline: {
                                            width: 0.5,
                                            color: borderColorSelection.value,
                                        }
                                    }
                                }
                            }
                            else if (type == "Polygon") {
                                selectedRenderer = {
                                    type: "simple",
                                    symbol: {
                                        color: colorSelection.value,
                                        type: "simple-fill",
                                        outline: {
                                            color: borderColorSelection.value,
                                            width: 1,
                                        }
                                    },
                                }
                            }
                        }

                        function updateRenderer() {
                            geojsonlayer.renderer = selectedRenderer
                            axios({
                                method: 'POST',
                                url: '/apis/v1/renderer/',
                                headers: {'X-CSRFToken': vm.csrftoken}, // from getCookie function
                                data: {
                                    renderer: selectedRenderer,
                                    linked_data_id: geospatial_data.id,
                                    linked_map_id: Number(vm.mapID),
                                },
                            })
                        }

                        // todo: add axios fn to update renderer in db when user hits return btn
                        const returnButtonNode = document.createElement("span")
                        returnButtonNode.classList.add("esri-icon-left")
                        returnButtonNode.setAttribute("aria-label", "close icon")
                        returnButtonNode.addEventListener("click", () => {
                            expandModify.style.display = "none"
                            expandModify.innerHTML = "" // cleans div to prepare for another set of layer properties
                            expandDefault.style.display = "block"
                        })
                        expandModify.appendChild(returnButtonNode)

                        const layerStyleHeaderNode = document.createElement("h3")
                        layerStyleHeaderNode.textContent="Modify Style: " + event.target.parentNode.textContent
                        expandModify.appendChild(layerStyleHeaderNode)

                        const parameterUlNode = document.createElement("ul") // list of parameters displayed to edit
                        parameterUlNode.classList.add("style-edit")
                        expandModify.appendChild(parameterUlNode)

                        // todo: add different cases depending on feature type; point, polygon, line
                        function createAddColorSelector(id, paramenterName, defaultValueIndex) { // takes element id and displayed name of parameter
                            const parameterLiNode = document.createElement("li")
                            const colorTextNode = document.createTextNode(paramenterName)
                            const colorSelectNode = document.createElement("select")
                            colorSelectNode.id = id
                            for (var i = 0; i < colorOptions.length; i++) {
                                let option = document.createElement("option")
                                option.value = colorOptions[i].hex
                                option.style.backgroundColor = option.value
                                option.text = colorOptions[i].name
                                colorSelectNode.appendChild(option)
                                parameterLiNode.appendChild(colorTextNode)}
                            colorSelectNode.selectedIndex = defaultValueIndex
                            parameterLiNode.appendChild(colorSelectNode)
                            parameterUlNode.appendChild(parameterLiNode)
                        }
                        function createAddSlider(id, paramenterName) {
                            const parameterLiNode = document.createElement("li")
                            const colorTextNode = document.createTextNode(paramenterName)
                            const sliderNode = document.createElement("div")
                            sliderNode.id = id
                            const slider = new Slider({
                                container: sliderNode,
                                min: 1,
                                max: 10,
                                values: [ 5 ],
                            })
                            // vm.testVar = slider.value
                            slider.on(['thumb-change', 'thumb-drag'], function(event) {
                                selectedRenderer.size = event.value
                                geojsonlayer.renderer = selectedRenderer
                                console.log(geojsonlayer.renderer)
                                console.log(event.value)
                            })
                            parameterLiNode.appendChild(colorTextNode)
                            parameterLiNode.appendChild(sliderNode)
                            parameterUlNode.appendChild(parameterLiNode)
                        }

                        function getColorNameFromHex(value) {
                            for (let color of colorOptions) {
                                if (color.hex == value) {
                                    return colorOptions.indexOf(color)
                                }
                            }
                        }
                        if (selectedRenderer) {
                            defaultInnerColorIndex = getColorNameFromHex(selectedRenderer.symbol.color)
                            defaultBorderColorIndex = getColorNameFromHex(selectedRenderer.symbol.outline.color)
                        }
                        else {
                            defaultInnerColorIndex = 0
                            defaultBorderColorIndex = 0
                        }
                        createAddColorSelector("inner-color-selection", "Color", defaultInnerColorIndex)
                        createAddColorSelector("border-color-selection", "Border Color", defaultBorderColorIndex)
                        let colorSelection = document.getElementById("inner-color-selection")
                        colorSelection.addEventListener('change', () => {
                            if (typeof selectedRenderer === 'undefined'){ // if renderer doesn't exist, create it and add to layer
                                createRenderer(geojson.features[0].geometry.type)
                            }
                            selectedRenderer.symbol.color = colorSelection.value
                            updateRenderer()
                        })
                        let borderColorSelection = document.getElementById("border-color-selection")
                        borderColorSelection.addEventListener('change', (event) => {
                            if (typeof selectedRenderer === 'undefined'){ // if renderer doesn't exist, create it and add to layer
                                createRenderer(geojson.features[0].geometry.type)
                            }
                            selectedRenderer.symbol.outline.color = borderColorSelection.value
                            updateRenderer()
                        })

                        
                        const deleteButtonNode = document.createElement("span")
                        deleteButtonNode.classList.add("esri-icon-trash")
                        deleteButtonNode.setAttribute("aria-label", "close icon")
                        deleteButtonNode.addEventListener("click", () => {
                            node.remove() // remove toggle elements from settings panel
                            vm.map.layers.remove(geojsonlayer) // remove plotted data from map
                            expandModify.style.display = "none"
                            expandModify.innerHTML = "" // cleans div to prepare for another set of layer properties
                            expandDefault.style.display = "block"
    
                            // splice map out of data's maps array, then axios request to update in database
                            let index = geospatial_data.maps.indexOf(vm.mapID)
                            geospatial_data.maps.splice(index, 1)
                            if (geospatial_data.maps.length == 0) {
                                // if no more map links on data, remove the data from db
                                vm.deleteData(geospatial_data.id)
                            }
                            else {
                                // otherwise, just update db with updated map list
                                axios({
                                    method: 'PUT',
                                    url: '/apis/v1/data/' + geospatial_data.id + '/',
                                    headers: {'X-CSRFToken': vm.csrftoken}, // from getCookie function
                                    data: {
                                        maps: geospatial_data.maps,
                                    },
                                })
                                .catch(function (error) {
                                    console.log(error)
                                })
                            }
                        })
                        expandModify.appendChild(deleteButtonNode)
                    })
                    node.appendChild(modifyButtonNode)

                    // todo: allow user to change data name
                    vm.layerToggles.appendChild(node)     
                }

                // loads newly linked data and passes to createAddGeoJsonLayer function
                if (action == 'upload new data') {
                    vm.dataLayers.push(data.id)
                    createAddGeoJsonLayer(data)
                }

                // loads linked data and passes to createAddGeoJsonLayer function
                if (action == 'load from database') {
                    for (let geospatial_data of data) { // multiple points are used instead of multipoint object because I can't figure out how to add attributes to multipoint nodes
                        vm.dataLayers.push(geospatial_data.id)
                        createAddGeoJsonLayer(geospatial_data, visibility=true)
                    }
                }
            })
        },
        readFile(event) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = e => {
                let contents = e.target.result
                geojson = JSON.parse(contents)
                this.uploadData(geojson)
            }
            reader.readAsText(file)
        },
        createMap: function() { // todo: ensure function not used; remove
            axios.post('/map', {
                title: 'axios map',
            })
            .catch(function (error) {
                console.log(error)
            })            
        },
        deleteData: function(id) {
            axios({
                method: 'DELETE',
                url: '/apis/v1/data/' + id + '/',
                headers: {'X-CSRFToken': this.csrftoken}, // from getCookie function
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        uploadData: function(geospatialData) {
            // first, get list of all geospatial_data ids and hashes, then check if new hash matches (aka if data already exists in database)
            axios({
                method: 'GET',
                url: '/apis/v1/data/',
                headers: {'X-CSRFToken': this.csrftoken}, // from getCookie function
            })
            .then(function (response) {
                let json_string = JSON.stringify(geospatialData)
                let data_hash = sha256(json_string)
                let createNewData = true
                
                // then, check all existing data_hashes to see if file already in db
                for (let geospatial_data_ref of response.data) { 
                    // if geospatial_data already in database
                    if (geospatial_data_ref.data_hash == data_hash) { 
                        createNewData = false
                        // get existing geospatial_data object
                        axios({
                            method: 'GET',
                            url: '/apis/v1/data/?data_hash=' + data_hash,
                        }).then(response => {
                            let existingGeospatialData = response.data[0]
                            existingGeospatialData.maps.push(Number(vm.mapID))
                            // add data to map view
                            vm.loadMap(action='upload new data', data=existingGeospatialData)
                            // update data's map list in db
                            axios({
                                method: 'PUT',
                                url: '/apis/v1/data/' + existingGeospatialData.id + '/',
                                headers: {'X-CSRFToken': vm.csrftoken}, // from getCookie function
                                data: {
                                    // pk: this.mapID,
                                    maps: existingGeospatialData.maps,
                                },
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                        })
                    }
                }

                // finally, if no match found, create object in db
                if (createNewData == true) {
                    axios({
                        method: 'POST',
                        url: '/apis/v1/data/',
                        headers: {'X-CSRFToken': vm.csrftoken}, // from getCookie function
                        data: {
                            title: geospatialData.name,
                            geospatial_data: geospatialData,
                            maps: [parseInt(vm.mapID),],
                            data_hash: data_hash,
                        },
                    })
                    // once object is created, get object and add to map view
                    // need to pass to db and get from db in order to get id
                    .then(function () {
                        axios({
                            method: 'GET',
                            url: '/apis/v1/data/?data_hash=' + data_hash,
                        }).then(response => {
                            let newGeospatialData = response.data[0]
                            vm.loadMap(action='upload new data', data=newGeospatialData)
                        })
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        getCookie: function(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';')
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
                        break;
                    }
                }
            }
            return cookieValue;
        },
        changeMapName: function() {
            axios({
                method: 'PUT',
                url: '/apis/v1/maps/' + this.mapID + '/',
                headers: {'X-CSRFToken': this.csrftoken}, // from getCookie function
                data: {
                    // pk: this.mapID,
                    title: this.mapTitle,
                },
            })
            .catch(function (error) {
                console.log(error)
            })
        },
    },
    
    beforeMount: function() {
        this.csrftoken = this.getCookie('csrftoken');
        this.loadMap(action='initiate')
    },

    mounted: function() {
        let recievedData, recievedRenderers
        this.mapID = document.querySelector("#map-id").value
        this.layerToggles = document.getElementById('layerToggles')
        axios({ // get all data linked to map
            method: 'GET',
            url: '/apis/v1/data/?map_id=' + this.mapID,
        }).then(response => {
            recievedData = response.data
            if (recievedRenderers) { // only runs loadMap when both axios calls complete
                this.loadMap(action='load from database', data=recievedData, renderers=recievedRenderers)
            }
        })
        axios({ // get all renderers linked to map
            method: 'GET',
            url: '/apis/v1/renderer/?map_id=' + this.mapID,
        }).then(response => {
            recievedRenderers = response.data
            if (recievedData) { // only runs loadMap when both axios calls complete
                this.loadMap(action='load from database', data=recievedData, renderers=recievedRenderers)
            }
        })
    },
})