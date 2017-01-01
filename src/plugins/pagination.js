(function () {
    function Pagination() {};
    
    Pagination.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
        trigger = this.gridInstance.config('pluginPaginationTrigger','click');

        this.gridInstance
            .listen(trigger,'go-first',function(e) {
            return self.goFirst(e);
        })
            .listen(trigger,'go-last',function(e) {
            return self.goLast(e);
        })
            .listen(trigger,'go-next',function(e) {
            return self.goNext(e);
        })
            .listen(trigger,'go-previous',function(e) {
            return self.goPrevious(e);
        })
            .listen(trigger,'go-to',function(e) {
            return self.goTo(e);
        });
    };

    Pagination.prototype.modify = function () {
        var pages = Math.ceil(this.gridInstance.getMeta().count / this.gridInstance.getMeta().limit);
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

    EasyGrid.prototype.registerPlugin('pagination',Pagination)
})();