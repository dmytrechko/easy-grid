# EASY - grid
Easy grid is a simple data grid that allows you to fetch data from server and display it easily. Making the Easy-grid, we tended to several conventions:

* It should be easy to use;
* It should be easy to extend;
* It should be light-weight and clear;
* It should use template-engine (lodash, underscore etc.) and
* It should be independent from jQuery and any HTML-layout.

## INSTALL
Use bower to install easy-grid

``bower install easy-grid --save``

or 

just copy source code from Github and include it into your project.

## Use 
Well.. 
```
var MyEasyGrid = new EasyGrid('#my-grid');
```
..or maybe you want change some default options?
```
EasyGrid.prototype.defaults.pluginPaginationTrigger = 'click';
var MyEasyGrid = new EasyGrid('#my-grid');
```
..or maybe you want to change some options manually and refresh grid without fetching data from server?
```
var MyEasyGrid = new EasyGrid('#my-grid');
MyEasyGrid.setTemplate('#alter-template');
MyEasyGrid.refresh();
```
## Options
All options can be specified in three ways. There are (ordered by priority):
1. Via data-* attributes on container.
2. Via optional parameter `options` when initiating data-grid
3. Via default options that can be defined via
```
Grid.prototype.defaults.option = 'my_custom_default_option';
```
### `url`
Url to send request
### `target`
Target where to insert rendered html
### `template`
Template for template engine
### fetchParams
Fetch params. [Learn more](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)
### `query`
Query params for filtering data (limit,offset etc)
## Methods
### Run
Run full grid process chain:
1. Fetch the data
2. Render data with template engine
3. Insert data into target node

### Refresh
Run  grid process chain without http-request:
1. Render data with template engine
2. Insert data into target node

### Fetch
Fetch data from server. Send http-request using fetch method according to fetchParams.
### Render
Render fetched data via template engine using `template` from options.
### Insert
Insert rendered data into `target`

## Getters and setters
It is very important to use getters and setters for accessing and mutating grid properties. It is so important, that we even prohibit access for these properties for you :). So just use following methods:

### `getContainer()` 
Get container that was used to init easy-grid. All events binded to this container. Returning DOM Element

### `getUrl(prepared)` 
Get URL used for requests.  If `prepared` true, then return URL with GET-parameters.

### `setUrl(data)` 
Set URL

### `getQuery()` 
Get current GET-parameters for http-request

### `setQuery(option, value)` 
Set or replace parameter for http-request. Ex.: `setQuery('limit',25)`

### `getFetchParams` and `setFetchParams` 
Getter and setter for fetch params. [Learn more](https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch)

### `getTEmplate()` and `setTemplate(data)` 
Getter and setter for template thar will be used for rendering via Lo-dash template engine. 

**Important!** Accept proper selector for `document.querySelector`

### `getFetched()` and `setFetched(data)`
Getter and setter for data, fetched from server. 
**Important!** Fetched data contains only data results. All additional stuff from server should be placed into `meta`.

### `getMeta()` and `setMeta(data)`
Getter and setter for meta-data, fetched from server. Meta-data is all additional data like total number of results, current offset etc.

### `getExtra()` and `setExtra(option, value)`
Getter and setter for Extra data. Extra data is all additional data, that can be added by plugins. For ex.: currentPage, currentFilters etc.

### `getRendered()` and `setRendered(data)`
Getter and setter for rendered data. Rendered data is data, already rendered by template engine (Lo-dash in our case) using defined template and variables:
* `fetched` as *results*
* `meta` as *meta*
* `extra` as *extra*

## Events

### `grid:fetch:before`
### `grid:fetch:after`
### `grid:fetch:fail`

### `grid:render:before`
### `grid:render:after`

### `grid:insert:before`
### `grid:insert:after`

## Contributing
Writing your own plugins for easy-grid is really easy! All that you need to know is:
1. Method `registerPlugin(name,plugin)` that accept name of your plugin and plugin itself.
2. All your plugins should have method `init(grid)` that accept instance of easy grid. In this method your can specify any extra data or bind events etc. This method will be executed after initiating grid and before fetching data.
3. All your plugins should have method `modify()` that will be executed after fetching data and before rendering it. In this method you can do whatever you want using getters and setters. 

    Changing limit, pagination and simple search and fileters is already made as Easy grid plugins. So you can either use them or just watch them as examples for creating your own.

## Requirements
We use philipwalton/privateParts to make some of our properties really private. [Learn more](https://github.com/philipwalton/private-parts) about package.

We use `fetch` for http-requests, so you probably will need a [polyfill](https://github.com/github/fetch).
