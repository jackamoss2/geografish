let vm = new Vue({
    el: "#app",
    data: {
        csrftoken: '',
        mapID: '',
        mapTitle: '',
        loading: false,
        dataLayers: [],
        testPoints: [[-122.6784,45.5152],],
        // const fileSelector = document.getElementById('file-selector');
    },
    methods: {
        loadMap: function(data = [],) {
            require(["esri/config","esri/Map","esri/views/MapView","esri/Graphic","esri/layers/GraphicsLayer","esri/layers/GeoJSONLayer",], function(esriConfig, Map, MapView, Graphic, GraphicsLayer, GeoJSONLayer) {

                esriConfig.apiKey = "AAPKa69c01d84be143d2aed0ad78c6386646fab0glupksy3eawHfYb4yW1TrjMS8hwjuF8YpsVqpzPfq0xCKaz-k-sIq9hXymW9"

                const map = new Map({
                    basemap: "arcgis-topographic" // Basemap layer service
                })
            
                const view = new MapView({
                    map: map,
                    center: [-122.6784,45.5152], // long, lat
                    zoom: 9,
                    container: "viewDiv" // Div element
                })
                view.popup.defaultPopupTemplateEnabled = true
                


                function createGeoJsonLayer(geojson) {
                    const blob = new Blob([JSON.stringify(geojson)], {
                        type: "application/json"
                    })
                    // console.log(JSON.stringify(geojson))

                    const url = URL.createObjectURL(blob)

                    const geojsonlayer = new GeoJSONLayer({
                        url,
                    })

                    map.layers.add(geojsonlayer)
                }
                if (JSON.stringify(data) !== JSON.stringify([])) { // passes on initiation - why?
                    console.log('loading data')
                    for (let geospatial_data of data) { // multiple points are used instead of multipoint object because I can't figure out how to add attributes to multipoint nodes   
                        console.log(geospatial_data.title)
                        // this.dataLayers.push(geospatial_data.title) // can't access this.dataLayers - why?
                        createGeoJsonLayer(geospatial_data.geospatial_data)
                    }
                }
                // view.when( function () { // https://jsfiddle.net/vgf5cryz
                //     console.log('load event called');
                //     map.layers.add(featureLayer);
                //     });

            })
        },
        readFile(event) {
            console.log('ok')
            console.log(event)
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = e => {
                let contents = e.target.result
                console.log(contents)
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
        this.loadMap(initiation=true)
    },

    mounted: function() {
        this.mapID = document.querySelector("#map-id").value
        console.log('/apis/v1/data/?map_id=' + this.mapID)
        axios({
            method: 'GET',
            url: '/apis/v1/data/?map_id=' + this.mapID,
        }).then(response => {
            console.log(response.data)
            this.loadMap(response.data)
        })
    },

})