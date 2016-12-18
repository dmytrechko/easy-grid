(function () {
    function Pagination() {};
    
    Pagination.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
        trigger = this.gridInstance.config('pluginPaginationTrigger','click');

        this.gridInstance.getContainer().addEventListener(trigger, function (e) {
            e.preventDefault();
            if (typeof e.target.dataset.actionGoFirst !== 'undefined') {
                self.goFirst.call(self,e);
                return true;
            }

            if (typeof e.target.dataset.actionGoLast !== 'undefined') {
                self.goLast.call(self,e);
                return true;
            }

            if (typeof e.target.dataset.actionGoNext !== 'undefined') {
                self.goNext.call(self,e);
                return true;
            }

            if (typeof e.target.dataset.actionGoPrevious !== 'undefined') {
                self.goPrevious.call(self,e);
                return true;
            }

            if (typeof e.target.dataset.actionGoTo !== 'undefined') {
                self.goTo.call(self,e);
                return true;
            }
        })
    };

    Pagination.prototype.modify = function () {
        var pages = Math.ceil(this.gridInstance.getMeta().total / this.gridInstance.getMeta().limit);
        this.gridInstance.setExtra('currentPage', this.gridInstance.getExtra().currentPage || 1);
        if (this.gridInstance.getExtra().currentPage > pages) {
            this.goToPage(pages);
        }
        this.gridInstance.setExtra('pages',pages);
        return true;
    };

    Pagination.prototype.goFirst = function (ev) {
        this.goToPage(1);
    };

    Pagination.prototype.goLast = function (ev) {
        this.goToPage(this.gridInstance.getExtra().pages);
    };

    Pagination.prototype.goPrevious = function (ev) {
        this.goToPage(this.gridInstance.getExtra().currentPage - 1);
    };

    Pagination.prototype.goNext = function (ev) {
        this.goToPage(this.gridInstance.getExtra().currentPage + 1);
    };

    Pagination.prototype.goTo = function (ev) {
        var page = ev.target.dataset.page || this.gridInstance.getExtra().currentPage;
        this.goToPage(page);
    };

    Pagination.prototype.goToPage = function (page) {
        var offset,limit = +this.gridInstance.getMeta().limit;
        offset = page ? (page - 1) * limit : 0;
        this.gridInstance.setQuery('offset',offset);
        this.gridInstance.setExtra('currentPage',+page);
        return this.gridInstance.run();
    };

    Grid.prototype.registerPlugin('pagination',Pagination)
})();