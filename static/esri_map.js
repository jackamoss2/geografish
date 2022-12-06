let vm = new Vue({
    el: "#app",
    delimiters: ['{&', '&}'],
    data: {
        csrftoken: '',
        mapID: '',
        mapTitle: '',
        loading: false,
        dataLayers: [],
        testPoints: [[-122.6784,45.5152],],
        map: null,
        view: null,
        layerToggles: null,
        // const fileSelector = document.getElementById('file-selector');
    },
    methods: {
        loadMap: function(action, data=null,) {
            require(["esri/config","esri/Map","esri/views/MapView","esri/Graphic","esri/layers/GraphicsLayer","esri/layers/GeoJSONLayer","esri/widgets/Expand",],
            function(esriConfig, Map, MapView, Graphic, GraphicsLayer, GeoJSONLayer, Expand,) {
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
                        expandIconClass: "esri-icon-settings2",
                        // container: document.getElementById("viewDiv"),
                        mode: "floating",
                    })
                    
                    vm.view.ui.add(expand, "top-right");
                }
                
                // renders geojson,visibility toggles on map
                // takes geospatial_data object which contains geojson
                const createAddGeoJsonLayer = (geospatial_data, visibility=true) => {
                    // create arcgis objects and add to map
                    geojson = geospatial_data.geospatial_data
                    const blob = new Blob([JSON.stringify(geojson)], {
                        type: "application/json"
                    })
                    const url = URL.createObjectURL(blob)
                    const geojsonlayer = new GeoJSONLayer({
                        url,
                    })
                    vm.map.layers.add(geojsonlayer)      
                    
                    // add visibility toggle html elements
                    const node = document.createElement("li")
                    const buttonNode = document.createElement("input")
                    buttonNode.id = "layer-toggle"
                    buttonNode.type = "checkbox"
                    if (visibility === true) {
                        buttonNode.checked = true
                        geojsonlayer.visible = true
                    }
                    else {
                        buttonNode.checked = false
                        geojsonlayer.visible = false
                    }
                    let functionText = "toggleLayerVisibility(" + String(geospatial_data.id) + ")"
                    buttonNode.setAttribute("v-on:click", functionText)
                    node.appendChild(buttonNode)
                    const textNode = document.createTextNode(geojson.name)
                    node.appendChild(textNode)
                    buttonNode.addEventListener("change", () => {
                        geojsonlayer.visible = buttonNode.checked
                    })
                    // todo: add delete button; deletes data from database and removes the html elements
                    // todo: allow user to change data name
                    vm.layerToggles.appendChild(node)     
                     
                }

                if (action == 'upload new data') {
                    createAddGeoJsonLayer({geospatial_data:data,})
                }

                // loads linked data and passes to createAddGeoJsonLayer function
                if (action == 'load from database') {
                    for (let geospatial_data of data) { // multiple points are used instead of multipoint object because I can't figure out how to add attributes to multipoint nodes   
                        vm.dataLayers.push({id:geospatial_data.id,title:geospatial_data.title,visible:true,})
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
        createMap: function() {
            axios.post('/map', {
                title: 'axios map',
            })
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })            
        },
        uploadData: function(geospatialData) {
            axios({
                method: 'POST',
                url: '/apis/v1/data/',
                headers: {'X-CSRFToken': this.csrftoken}, // from getCookie function
                data: {
                    title: 'axios data',
                    maps: [parseInt(this.mapID),],
                    geospatial_data: geospatialData,
                },
            })
            .then(function (response) {
                vm.loadMap(action='upload new data', data=geospatialData)
                console.log(response)
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
            .then(function (response) {
                console.log(response)
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
        this.mapID = document.querySelector("#map-id").value
        this.layerToggles = document.getElementById('layerToggles')
        axios({
            method: 'GET',
            url: '/apis/v1/data/?map_id=' + this.mapID,
        }).then(response => {
            this.loadMap(action='load from database', data=response.data)
        })
    },

})