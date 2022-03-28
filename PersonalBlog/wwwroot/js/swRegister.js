if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(function (registration) {
            console.log('ServiceWorker registrado com sucesso no escopo:', registration.scope);
        }, function (error) {
            console.log('Falha ao registrar o ServiceWorker:', error);
        });
}