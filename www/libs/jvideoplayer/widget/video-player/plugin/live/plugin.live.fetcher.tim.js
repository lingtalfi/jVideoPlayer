(function () {

    window.pluginLiveFetcherTim = function (options) {
        this.d = $.extend({
            url: "/service/live_events.php",
        }, options);
    };

    pluginLiveFetcherTim.prototype = {
        fetch: function(onFetched){
            timPost(url, data, onSuccess, onFailure);                        
        },
    };

})();
