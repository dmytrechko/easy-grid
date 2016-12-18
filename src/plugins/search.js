(function () {
    function Search() {};

    Search.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginSearchTrigger','click');
        this.gridInstance.getContainer().addEventListener(trigger, function (e) {
            e.preventDefault();
            if (typeof e.target.dataset.actionSearch !== 'undefined') {
                self.search.call(self,e);
                return true;
            }
        })
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

    Grid.prototype.registerPlugin('search',Search)
})();