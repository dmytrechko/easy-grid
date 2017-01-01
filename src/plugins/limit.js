(function () {
    function Limit() {};
    
    Limit.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginLimitTrigger','change');

        this.gridInstance.listen(trigger,'limit',function(e) {
            return self.changeLimit(e);
        });
    };

    Limit.prototype.modify = function () {
        return true;
    };
    
    Limit.prototype.changeLimit = function (ev) {
        var limit = ev.target.value;
        this.gridInstance.setQuery('limit',limit);
        this.gridInstance.setExtra('limit',limit);
        return this.gridInstance.run();
    };

    EasyGrid.prototype.registerPlugin('limit',Limit)
})();