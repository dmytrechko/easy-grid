(function () {
    function Filters() {};

    Filters.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginFiltersTrigger','click');

        this.gridInstance.listen(trigger,'filter',function(e) {
            return self.setFilter(e);
        });
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

    EasyGrid.prototype.registerPlugin('filters',Filters)
})();