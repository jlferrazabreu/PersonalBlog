"use strict";
importScripts('lib/localforage/localforage.min.js');
const cacheName = 'v2CacheBlog';
const blogCacheFiles = [
    '/',
    '/sw.js',
    '/lib/bootstrap/dist/css/bootstrap.css',
    '/css/site.css',
    '/lib/jquery/dist/jquery.js',
    '/lib/bootstrap/dist/js/bootstrap.js',
    '/lib/es6-promise/es6-promise.js',
    '/lib/fetch/fetch.js',
    '/lib/systemjs/system.js',
    '/lib/showdown/showdown.js',
    '/lib/localforage/localforage.min.js',
    '/lib/localforage/localforage-getitems.js',
    '/lib/localforage/localforage-setitems.js',
    '/js/site.js',
    '/js/app.js',
    '/js/blogService.js',
    '/js/swRegister.js',
    '/js/clientStorage.js',
    '/js/template.js',
    '/manifest.json',
    '/favicon.ico',
    '/images/icon-192x192.png',
    '/images/icon-256x256.png',
    '/images/icon-384x384.png',
    '/images/icon-512x512.png',
];

function timeout(ms, promise) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject();
        }, ms);
        promise.then(resolve, reject);
    });
}

//Installing
self.addEventListener('install', function (event) {
    console.log('SW: Evento de instalacao');
    self.skipWaiting();
    event.waitUntil(caches.open(cacheName).then(function (cache) {
        return cache.addAll(blogCacheFiles);
    }));
});

//Activation
self.addEventListener('activate', function (event) {
    console.log('SW: Evento de ativacao');
    self.clients.claim();
    event.waitUntil(
        caches.keys().then(function (cacheKeys) {
            const deletePromises = [];
            for (let i = 0; i < cacheKeys.length; i++) {
                deletePromises.push(caches.delete(cacheKeys[i]));
            }

            return Promise.all(deletePromises);
        })
    );
});

//Fetch
self.addEventListener('fetch', function (event) {
    console.log('SW: Evento de fetch:' + event.request.url);
    if (event.request.url.toLowerCase().includes('/home')) {
        console.log('[ServiceWorker] online - get online:', event.request.url);
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            timeout(500, fetch(event.request))
                .catch(function (error) {
                    console.log('[ServiceWorker] offline - get from cache:', event.request.url);
                    return caches.match(event.request);
                }));
    }
});

self.addEventListener('backgroundfetchsuccess', function (event) {
    console.log('backgroundfetchsuccess', event);
    const bgFetch = event.registration;

    console.log('backgroundfetchsuccess bgFetch', bgFetch);

    const blogInstance = localforage.createInstance({
        name: 'blog'
    });

    console.log('backgroundfetchsuccess blogInstance', blogInstance);

    const func = async function () {
        console.log('waitUntil');

        const records = await bgFetch.matchAll();
        const promises = records.map(async function (record) {
            const response = await record.responseReady;
            const text = await response.text();
            console.log('Texto recebido - guardando no IndexDB:' + text);
            blogInstance.setItem('#' + bgFetch.id, text);
        });

        await Promise.all(promises);
        event.updateUI({ title: 'Done!' });
    };

    event.waitUntil(func());
});
