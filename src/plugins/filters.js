(function () {
    function Filters() {};

    Filters.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginFiltersTrigger','click');
        this.gridInstance.getContainer().addEventListener(trigger, function (e) {
            e.preventDefault();
            if (typeof e.target.dataset.actionFilter !== 'undefined') {
                self.setFilter.call(self,e);
                return true;
            }
        })
    };

    Filters.prototype.modify = function () {
        return true;
    };

    Filters.prototype.setFilter = function (ev) {
        var filter = ev.target.dataset.actionFilter,
            meta = this.gridInstance.getMeta() || {},
            filters = meta.filters||[];
        if (filters.indexOf(filter) == -1) {
            //enable filter
            Array.prototype.push.call(filters, filter);
        } else {
            //disable filter
            Array.prototype.splice.call(filters,(filters).indexOf(filter),1);
        }

        meta.filters = filters;
        this.gridInstance.setMeta(meta);
        this.gridInstance.setQuery('filters',filters);

        this.gridInstance.run();
    };

    Grid.prototype.registerPlugin('filters',Filters)
})();