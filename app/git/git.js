define(['es6-promise'], function(Promise) {
    var git = {
        token: '11dcdccc770d3d654a21a64b739a88a1198bcedd',
    };

    function get(url, type) {
        return new Promise(function(resolve, reject) {
            if (navigator.onLine) {
                var req = new XMLHttpRequest();
                req.open('GET', url, true);
                req.responseType = type || 'json';
                req.onload = function(e) {
                    if (req.status === 200) {
                        resolve(req.response);
                    } else {
                        reject(Error(req.statusText))
                    }
                };
                req.onError = function(e) {
                    reject(Error("Network Error'"));
                };
                req.send();
            } else {
                reject(Error("Connection Error"));
            }
        });
    }

    git.getTree = function(owner, repo) {
        var that = this;
        return get(['https://api.github.com/repos', owner, repo, 'branches?access_token=' + that.token].join('/'))
            .then(function(res) {
                var sha = res[0].commit.sha;
                return get(['https://api.github.com/repos', owner, repo, 'git/trees', sha + '?access_token=' + that.token + '&recursive=1'].join('/'));
            })
            .then(function(res) {
                return res.tree;
            });
    };

    git.getFileContent = function(owner, repo, path) {
        var that = this;
        return get(['https://api.github.com/repos', owner, repo, 'contents', path + '?access_token=' + that.token].join('/'))
            .then(function(res) {
                var fileContent = atob(res.content);
                return fileContent;
            });
    };

    return git;
});
