define([], function () {

    const GOOGLE_MAP_KEY = 'AIzaSyDSdcYXhi51SYOEgqPzNAt5QPWXKLEoGbQ';

    async function ipLookUp() {
        try {
            const response = await fetch('http://ip-api.com/json');
            const json = await response.json();
            if (json) {
                console.log('Localizado do IP do Usuario e:', json);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function getAddress(latitude, longitude) {
        try {
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='
                + latitude + ',' + longitude + '&key=' + GOOGLE_MAP_KEY;

            const response = await fetch(url);
            const json = await response.json();

            if (json) {
                const { results } = json;
                const firstAddress = results[0];
                $('#address-found').val(firstAddress.formatted_address);
                $('#address-found-input').show();
            }
        } catch (e) {
            console.log('Erro ao capturar endereco', e);
        }
    }

    function getGeolocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function success(position) {
                    console.log('latitude: ' + position.coords.latitude + ', longitude: ' + position.coords.longitude);
                    getAddress(position.coords.latitude, position.coords.longitude);
                },
                function error(error) {
                    console.log(error);
                }
            )
        } else {
            console.log('geolocation nao esta habilitada neste navegador');
            ipLookUp();
        }
    }

    return {
        getGeolocation: getGeolocation
    }
});
