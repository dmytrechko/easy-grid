(function () {
    var __ = PrivateParts.createKey();
    
    function EasyGrid(container, options) {
        /** DEFINE VARIABLES */
        if (EasyGrid.prototype.instances.indexOf(container) !== -1) {
            console.warn('Selector '+container+' already used for EasyGrid!');
            return false;
        }
        EasyGrid.prototype.instances.push(container);
        __(this).options = options || {};
        __(this).plugins = {}; //plugins of current instance
        __(this).container = document.querySelector(container); // data, fetched from remote
        __(this).url = this.config('url'); //url to send
        __(this).target = document.querySelector(this.config('target')); // target where to insert rendered html
        __(this).template = document.querySelector(this.config('template')).innerHTML; // html of template
        __(this).fetchParams = {
            method:this.config('fetchMethod'),
            headers:this.config('fetchHeaders'),
            body:this.config('fetchBody'),
            mode:this.config('fetchMode'),
            credentials:this.config('fetchCredentials')
        }; //query parameters to send (method, options, headers etc)
        __(this).query = {}; // query params for filtering data (limit,offset etc)
        __(this).fetched = []; // data, fetched from remote
        __(this).rendered = ''; //data rendered with template engine
        __(this).meta = {}; // meta data - used in `query` for ajax and for displaying on html
        __(this).extra = {}; // `extra` data - used for js plugins to display it on template

        this.initPlugins();
        this.run();
    }

    /**
     * List of currently initiated instances of grid to prevent duplicate
     *
     * @type {Array}
     */
    EasyGrid.prototype.instances = [];

    /**
     * Default options for EasyGrid
     * @type {{fetchMethod: string, fetchHeaders: {}, fetchBody: null, fetchMode: string, fetchCredentials: string}}
     */
    EasyGrid.prototype.defaults = {
        fetchMethod:"get",
        fetchHeaders:{},
        fetchBody:null,
        fetchMode:'same-origin',
        fetchCredentials:'same-origin',
    };

    /**
     * List of plugins
     *
     * @type {{}}
     */
    EasyGrid.prototype.plugins = {};

    /**
     * Enable plugin for EasyGrid
     */
    EasyGrid.prototype.registerPlugin = function (name, plugin) {
        if (Object.keys(EasyGrid.prototype.plugins).indexOf(name) !==-1) {
            console.warn('Plugin with name '+name+' already exists!');
            return false;
        }

        EasyGrid.prototype.plugins[name] = plugin;
        return true;
    };

    /**
     * Init all plugins
     */
    EasyGrid.prototype.initPlugins = function () {
        for (name in EasyGrid.prototype.plugins) {
            __(this).plugins[name] = new EasyGrid.prototype.plugins[name]();
            if (!__(this).plugins[name].init) {
                console.warn('There is no init method in '+name+' plugin');
                continue;
            }
            __(this).plugins[name].init(this);
        }
    };

    /**
     * Pass through all plugins
     * before rendering template
     */
    EasyGrid.prototype.passThroughPlugins = function () {
        for (name in EasyGrid.prototype.plugins) {
            if (!__(this).plugins[name].modify) {
                console.warn('There is no modify method in '+name+' plugin');
                continue;
            }
            __(this).plugins[name].modify();
        }
    };

    /**
     * Get config from options or defaults
     * @param name
     * @param default_option
     */
    EasyGrid.prototype.config = function(name, default_option) {
        default_option = default_option || null;
        return __(this).container.dataset[name]
            || __(this).options[name]
            || EasyGrid.prototype.defaults[name]
            || default_option;
    };

    /**
     * Helpers for fire events
     * @param name
     * @param details
     */
    EasyGrid.prototype.fire = function(name, details) {
        var event = new Event(name,details||{});
        __(this).container.dispatchEvent(event);
    };

    /**
     * Run grid process chain:
     * 1. Fetch the data
     * 2. Render data with template engine
     * 3. Insert data into target node
     */
    EasyGrid.prototype.run = function () {
        var self = this;

        this.fetch()
            .then(function () {
                return self.passThroughPlugins();
            })
            .then(function(){
                return self.render();
            })
            .then(function () {
                return self.insert();
            });
    };

    /**
     * Refresh grid without fetching
     */
    EasyGrid.prototype.refresh = function () {
        this.passThroughPlugins();
        this.render();
        this.insert();
    };

    /**
     * Public function - allow other to define their method for fetching (use jQuery ajax etc.)
     */
    EasyGrid.prototype.fetch = function() {
        var self = this;
        self.fire('grid:fetch:before');
        return fetch(this.getUrl(true), this.getFetchParams())
            .then(function (response) {
                return response.json();
            },function () {
                self.fire('grid:fetch:fail');
            })
            .then(function (data) {
                self.setFetched(data.results);
                self.setMeta(data.meta || {});
                self.fire('grid:fetch:after');
            });
    };

    /**
     * Render fetched data, using template engine lo-dash
     * Public method - allow other to define their method for render (use Underscore etc.)
     */
    EasyGrid.prototype.render = function() {
        this.fire('grid:render:before');
        var rendered,template = _.template(__(this).template);
        rendered = template({
            results: this.getFetched(),
            meta: this.getMeta(),
            extra: this.getExtra(),
        });
        this.setRendered(rendered);
        this.fire('grid:render:after');
    };

    /**
     * Insert rendered data into specified target
     */
    EasyGrid.prototype.insert = function () {
        this.fire('grid:insert:before');
        __(this).target.innerHTML = this.getRendered();
        this.fire('grid:insert:after');
    };

    EasyGrid.prototype.getContainer = function () {
        return __(this).container;
    };

    EasyGrid.prototype.getUrl = function (prepared) {
        var self = this, url = __(this).url;
        if (prepared) {
            url += '?' + Object.keys(self.getQuery()).map(function (option) {
                    return new String(option + '=' + self.getQuery()[option]);
                }).join('&');
        }
        return encodeURI(url);
    };

    EasyGrid.prototype.setUrl = function(data) {
        __(this).url = data;
        return this;
    };

    EasyGrid.prototype.getQuery = function() {
        return __(this).query;
    };
    EasyGrid.prototype.setQuery = function(option,value) {
        __(this).query[option] = value;
        return this;
    };

    EasyGrid.prototype.getFetchParams = function () {
      return __(this).fetchParams;
    };

    EasyGrid.prototype.setFetchParams = function(data) {
        __(this).FetchParams = data;
        return this;
    };

    EasyGrid.prototype.getTemplate = function() {
        return __(this).template;
    };

    EasyGrid.prototype.setTemplate = function(data) {
        __(this).template = document.querySelector(data).innerHTML;
        return this;
    };

    EasyGrid.prototype.getFetched = function() {
        return __(this).fetched;
    };
    EasyGrid.prototype.setFetched = function(data) {
        __(this).fetched = data;
        return this;
    };

    EasyGrid.prototype.getMeta = function() {
        return __(this).meta;
    };
    EasyGrid.prototype.setMeta = function(data) {
        __(this).meta = data;
        return this;
    };

    EasyGrid.prototype.getExtra = function() {
        return __(this).extra;
    };
    EasyGrid.prototype.setExtra = function(option,value) {
        __(this).extra[option] = value;
        return this;
    };

    EasyGrid.prototype.getRendered = function() {
        return __(this).rendered;
    };
    EasyGrid.prototype.setRendered = function(data) {
        __(this).rendered = data;
        return this;
    };

    window.EasyGrid = EasyGrid;
})();


(function () {
    function Limit() {};
    
    Limit.prototype.init = function (grid) {
        this.gridInstance = grid;
        var self = this,
            trigger = this.gridInstance.config('pluginLimitTrigger','change');

        this.gridInstance.getContainer().addEventListener(trigger, function (e) {
            if (typeof e.target.dataset.actionLimit !== 'undefined') {
                self.changeLimit.call(self,e);
            }
        })
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

    EasyGrid.prototype.registerPlugin('search',Search)
})();
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

    EasyGrid.prototype.registerPlugin('filters',Filters)
})();