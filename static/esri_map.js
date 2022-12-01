let vm = new Vue({
    el: "#app",
    data: {
        csrftoken: '',
        mapID: '',
        loading: false,
        testPoints: [[-122.6784,45.5152],],
        // const fileSelector = document.getElementById('file-selector');
    },
    methods: {
        loadMap: function() {
            require(["esri/config", "esri/Map", "esri/views/MapView"], function(esriConfig, Map, MapView) {

                esriConfig.apiKey = "AAPKa69c01d84be143d2aed0ad78c6386646fab0glupksy3eawHfYb4yW1TrjMS8hwjuF8YpsVqpzPfq0xCKaz-k-sIq9hXymW9"
            
                const map = new Map({
                    basemap: "arcgis-topographic" // Basemap layer service
                })
            
                const view = new MapView({
                    map: map,
                    center: [-118.805, 34.027], // Longitude, latitude
                    zoom: 13, // Zoom level
                    container: "viewDiv" // Div element
                })
            })
        },
        readFile(event) {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = e => {
                let contents = e.target.result
                console.log(contents)
                geojson = JSON.parse(contents)
                this.loadMap(points = [], geojson = geojson)
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
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },
    },
    
    beforeMount: function() {
        this.csrftoken = this.getCookie('csrftoken');
        geospatial_data_sets = 

        this.loadMap()
    },
    mounted: function() {
        this.mapID = document.querySelector("#map-id").value
    }

})