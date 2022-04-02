var blogService = require('./blogService.js');
const serviceWorker = require('./swRegister.js');
const localization = require('./localization.js');
const gyroscope = require('./gyroscope.js');

let defferedPrompt;
window.addEventListener('beforeinstallprompt', function (event) {
    console.log('beforeinstallprompt iniciou');
    event.preventDefault();
    defferedPrompt = event;
    $('#install-container').show();
});

window.addEventListener('appinstalled', function (event) {
    console.log('App foi adicionado no home do SO');
});

if (!'BackgroundFetchManager' in self) {
    alert('Background Fetch nao esta disponivel neste site');
    return;
}

blogService.loadLatestBlogPosts();

window.pageEvents = {
    loadBlogPost: function (link) {
        blogService.loadBlogPost(link);
    },
    loadMoreBlogPosts: function () {
        blogService.loadMoreBlogPosts();
    },
    tryAddHomeScreen: function () {
        defferedPrompt.prompt();
        defferedPrompt.userChoice.then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceitou o prompt');
                $('#install-container').hide();
            }
        });
    },
    setBackgroundFetch: async function (link) {
        const swRegister = await navigator.serviceWorker.ready;
        const bgFetch = await swRegister.backgroundFetch.fetch(link,
            ['Home/Post/?link=' + link], {
            title: link,
            icons: [{
                sizes: '192x192',
                src: 'images/icon-192x192.png',
                type: 'image/png'
            }],
            downloadTotal: 15000
        });

        bgFetch.addEventListener('progress', function () {
            if (!bgFetch.downloadTotal) return;

            const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
            console.log('Download progress:' + percent + '%');
            console.log('Download status:' + bgFetch.result);

            $('.download-start').hide();
            $('#status-download').show();
            $('#status-download > .progress > .progress-bar').css('width', percent + '%');

            if (bgFetch.result == 'success') {
                $('#status-download > .text-success').show();
            }
        });
    },
    getGeolocation: function () {
        localization.getGeolocation();
    },
    vibrate: function () {
        if ('vibrate' in navigator) {
            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
            navigator.vibrate([1000]);
        }
    }
}

gyroscope.init();
gyroscope.animate();
