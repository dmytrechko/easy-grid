(function () {
    function Search() {};

    Search.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginSearchTrigger','click');

        this.gridInstance.listen(trigger,'search',function(e) {
            return self.search(e);
        });
    };

    Search.prototype.modify = function () {
        return true;
    };

    Search.prototype.search = function (ev) {
        var searchContainer = this.gridInstance.getContainer().querySelector('[data-container="search"]'),
            searchQuery = searchContainer.value||'';

        this.gridInstance.setQuery('search',encodeURIComponent(searchQuery));
        this.gridInstance.run();
    };

    EasyGrid.prototype.registerPlugin('search',Search)
})();