(function () {
    var __ = PrivateParts.createKey();
    
    function Grid(container, options) {
        /** DEFINE VARIABLES */
        if (Grid.prototype.instances.indexOf(container) !== -1) {
            console.warn('Selector '+container+' already used for Grid!');
            return false;
        }
        Grid.prototype.instances.push(container);
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
    Grid.prototype.instances = [];

    /**
     * Default options for Grid
     * @type {{fetchMethod: string, fetchHeaders: {}, fetchBody: null, fetchMode: string, fetchCredentials: string}}
     */
    Grid.prototype.defaults = {
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
    Grid.prototype.plugins = {};

    /**
     * Enable plugin for Grid
     */
    Grid.prototype.registerPlugin = function (name, plugin) {
        if (Object.keys(Grid.prototype.plugins).indexOf(name) !==-1) {
            console.warn('Plugin with name '+name+' already exists!');
            return false;
        }

        Grid.prototype.plugins[name] = plugin;
        return true;
    };

    /**
     * Init all plugins
     */
    Grid.prototype.initPlugins = function () {
        for (name in Grid.prototype.plugins) {
            __(this).plugins[name] = new Grid.prototype.plugins[name]();
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
    Grid.prototype.passThroughPlugins = function () {
        for (name in Grid.prototype.plugins) {
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
    Grid.prototype.config = function(name, default_option) {
        default_option = default_option || null;
        return __(this).container.dataset[name]
            || __(this).options[name]
            || Grid.prototype.defaults[name]
            || default_option;
    };

    /**
     * Helpers for fire events
     * @param name
     * @param details
     */
    Grid.prototype.fire = function(name, details) {
        var event = new Event(name,details||{});
        __(this).container.dispatchEvent(event);
    };

    /**
     * Run grid process chain:
     * 1. Fetch the data
     * 2. Render data with template engine
     * 3. Insert data into target node
     */
    Grid.prototype.run = function () {
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
    Grid.prototype.refresh = function () {
        this.passThroughPlugins();
        this.render();
        this.insert();
    };

    /**
     * Public function - allow other to define their method for fetching (use jQuery ajax etc.)
     */
    Grid.prototype.fetch = function() {
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
    Grid.prototype.render = function() {
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
    Grid.prototype.insert = function () {
        this.fire('grid:insert:before');
        __(this).target.innerHTML = this.getRendered();
        this.fire('grid:insert:after');
    };

    Grid.prototype.getContainer = function () {
        return __(this).container;
    };

    Grid.prototype.getUrl = function (prepared) {
        var self = this, url = __(this).url;
        if (prepared) {
            url += '?' + Object.keys(self.getQuery()).map(function (option) {
                    return new String(option + '=' + self.getQuery()[option]);
                }).join('&');
        }
        return encodeURI(url);
    };

    Grid.prototype.setUrl = function(data) {
        __(this).url = data;
        return this;
    };

    Grid.prototype.getQuery = function() {
        return __(this).query;
    };
    Grid.prototype.setQuery = function(option,value) {
        __(this).query[option] = value;
        return this;
    };

    Grid.prototype.getFetchParams = function () {
      return __(this).fetchParams;
    };

    Grid.prototype.setFetchParams = function(data) {
        __(this).FetchParams = data;
        return this;
    };

    Grid.prototype.getTemplate = function() {
        return __(this).template;
    };

    Grid.prototype.setTemplate = function(data) {
        __(this).template = document.querySelector(data).innerHTML;
        return this;
    };

    Grid.prototype.getFetched = function() {
        return __(this).fetched;
    };
    Grid.prototype.setFetched = function(data) {
        __(this).fetched = data;
        return this;
    };

    Grid.prototype.getMeta = function() {
        return __(this).meta;
    };
    Grid.prototype.setMeta = function(data) {
        __(this).meta = data;
        return this;
    };

    Grid.prototype.getExtra = function() {
        return __(this).extra;
    };
    Grid.prototype.setExtra = function(option,value) {
        __(this).extra[option] = value;
        return this;
    };

    Grid.prototype.getRendered = function() {
        return __(this).rendered;
    };
    Grid.prototype.setRendered = function(data) {
        __(this).rendered = data;
        return this;
    };

    window.Grid = Grid;
})();

