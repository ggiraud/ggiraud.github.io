define(['underscore', 'ractive', 'rv!search/search', 'repo/repo'], function(_, Ractive, parsedTemplate, Repo) {

    var repo = new Repo();
    var ractive = new Ractive({
        el: 'footer',
        template: parsedTemplate,
        data: function() {
            var $this = this;
            repo.init('processing', 'processing-web-archive')
                .then(function(tree) {
                    ractive.update();
                })
                .catch(function(err) {
                    console.error(err.message);
                });

            return {
                query: '', // USER QUERY
                repo: repo, // REPO OBJECT
                index: 0, // CURRENT RESULT INDEX
                // rootNode: repo.tree,
                history: [repo.tree]
            }
        },
        computed: {
            // SETS ROOT NODE TO LAST HISTORY VALUE  
            rootNode: "_.last(${history})",
            // [ROOT,RESULTS] RETURN FROM REPO.FINDMATCHES METHOD
            matchResult: "${repo}.findMatches(${query}, ${rootNode})",
            // ROOT PATH NODES
            root: "${matchResult}[0]",
            // ROOT+QUERY FILTERED GIT TREE
            results: "${matchResult}[1]",
            // TOTAL QUERY BASED RESULTS
            total: "${results}.length",
            // CURRENT RESULT 
            current: "${results}[${index}]",
        }
    });

    //////////////////////////
    // PROXY-EVENT HANDLERS //
    //////////////////////////
    ractive.on({
        // INCREMENT OR DECREMENT INDEX
        setIndex: function(event, amount) {
            showKeyboard(event, this.find('input'));
            var total = this.get('total'),
                index = this.get('index'),
                rootNode = this.get('rootNode'),
                query = this.get('query'),
                newIndex = (((index + amount) % total) + total) % total;

            this.set('index', newIndex);
            rootNode.indexes[query] = newIndex;
        },
        // IF CHILDREN MATCHES, SET ROOT NODE TO CURRENT CONTEXT
        setRoot: function(event) {
            showKeyboard(event, this.find('input'));
            var history = this.get('history');
            if (event.context.git.type === 'tree') {
                if (_.last(history).git.path !== event.context.git.path) {
                    this.push('history', event.context);
                }
            }
        },
        // RESET ROOT NODE
        resetRoot: function(event, index) {
            showKeyboard(event, this.find('input'));
            var root = this.get('root'),
                history = this.get('history');
            if (index > 0 && index === root.length - 1) {
                // IF 
                if (history.length > 1) {
                    this.pop('history');
                }
            } else if (index > 0) {
                if (history.length > 1) {
                    this.pop('history');
                }
                if (_.last(history).git.path !== event.context.git.path) {
                    this.push('history', event.context);
                }
            } else { 
                this.set('history', [repo.tree]);
            }
        },
        previousRoot: function(event) {
            showKeyboard(event, this.find('input'));
            if (this.get('history').length > 1) {
                this.pop('history');
            }
        }
    });

    ///////////////
    // OBSERVERS //
    ///////////////
    ractive.observe({
        // SET INDEX TO SAVED INDEX OR ZERO
        rootNode: function(newValue, oldValue) {
            var query = this.get('query');
            if (_(newValue.indexes).has(query)) {
                this.set('index', newValue.indexes[query]);
            } else {
                this.set('index', 0);
            }
        },
        history: function(newValue, oldValue) {
            console.log(_.chain(newValue).pluck('git').pluck('path').value());
        }
    });

    function showKeyboard(event, inputNode) {
        event.original.preventDefault();
        inputNode.click();
        inputNode.focus();
    }

    return ractive;

});

/*
TODO:
    - backup git tree
        -> html manifest appcache
*/
