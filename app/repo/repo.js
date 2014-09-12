define(['underscore', 'es6-promise', 'localforage', 'git/git'], function(_, Promise, localforage, git) {

    function Repo() {
        this.owner = null;
        this.name = null;
        this.searches = [];
        this.tree = {
            name: 'root',
            git: {
                type: 'tree'
            },
            indexes: {},
            selfMatch: 0,   // node matches query
            childrenMatches: 0, // node's descendants matching query
            parent: null,
            children: []
        };
    };

    Repo.prototype.init = function(owner, name) {
        this.owner = owner;
        this.name = name;
        var $this = this;
        return new Promise(function(resolve, reject) {
            if (navigator.onLine) {
                // GET FILES FROM GITHUB & SAVE ON LOCALFORAGE
                git.getTree($this.owner, $this.name)
                    .then(function(gitFiles) {
                        localforage.setItem(owner + ":" + name, gitFiles);
                        resolve(gitFiles);
                    });
            } else {
                // GET FILES FROM LOCALFORAGE
                localforage.getItem(owner + ":" + name)
                    .then(function(gitFiles) {
                        if (gitFiles) {
                            resolve(gitFiles);
                        } else {
                            reject(Error('Localforage Get Error'));
                        }
                    });
            }
        }).then(function(gitFiles) {
            // BUILD TREE FROM FILES
            gitFiles.forEach(function(file) {
                $this.insertFile(file);
            });
            return $this.tree;
        })
    };

    Repo.prototype.insertFile = function(file) {
        var path = file.path.split('/'),
            children = this.tree.children,
            parent = this.tree;

        _.each(path, function(nodeName, nodeIndex) {
            // node template
            var node = {
                name: nodeName,
                git: file,
                indexes: {},
                selfMatch: 0,
                childrenMatches: 0,
                parent: parent,
                children: []
            };

            var childMatchingNodeName = _.findWhere(children, {name: nodeName});
            if (!childMatchingNodeName) {
                // if path not present in children list, insert node.
                children.push(node);
                parent = node;
                children = node.children;
            } else if (nodeIndex === path.length - 1) {
                // if path present in children list and if path is last in hierarchy,
                // set child git property.
                childMatchingNodeName.git = file;
            } else {
                // if path present in children list, continue.
                parent = childMatchingNodeName;
                children = parent.children;
            }
        });
    };

    // TODO UNIFY findMAtches and listMatches: save last request and compare.
    Repo.prototype.findMatches = function(query, rootNode) {
        var current = rootNode ? rootNode : this.tree,
            results = [];

        function parse(node, query, path) {
            // if node.name matches query, set node.selfMatch, push path to results
            if (node.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                node.selfMatch = query ? 1 : 0;
            } else {
                node.selfMatch = 0;
            }
            // if terminal node return node.selfMatch
            if (node.children.length == 0) {
                return node.selfMatch;
            }
            // set node.childrenMatches with cumulated children matches
            node.childrenMatches = node.children.reduce(function(acc, child) {
                return acc + parse(child, query, path.slice(0).concat(node));
            }, 0);
            return node.childrenMatches + node.selfMatch;
        }
        parse(current, query, []);

        if (query) {
            results = this.listMatchingPaths(current);
        } else {
            results = current.children.map(function(child) {
                return [child];
            });
        }
        return [this.tracePath(current), results];
    };

    Repo.prototype.listMatchingPaths = function(rootNode) {
        var results = [];

        function parse(node, path) {
            if (node.selfMatch && node.parent == rootNode) {
                results.push(path.slice(1).concat(node));
            }
            if (node.children.length == 0) {
                return;
            }
            var matches = 0;
            node.children.forEach(function(child) {
                if (node !== rootNode && child.selfMatch) {
                    matches = 1;
                }
                parse(child, path.slice(0).concat(node));
            });
            if (matches) {
                results.push(path.slice(1).concat(node));
            }
        }
        parse(rootNode, []);
        return results;
    };

    Repo.prototype.tracePath = function(node) {
        var path = [];
        var current = node;
        while(current) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };

    return Repo;
});
