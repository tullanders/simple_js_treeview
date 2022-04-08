(function () {
    let _ul;
    let _nodes;


    // Define our constructor
    this.Tree = function () {

        // Define option defaults
        var defaults = {}

        // Create options by extending defaults with the passed in arugments
        if (arguments[0] && typeof arguments[0] === 'object') {
            this.options = extendDefaults(defaults, arguments[0]);
        }
       _ul= this.options.treeview;

    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    this.Tree.prototype.load = function (nodes, parentId) {
        _nodes = nodes;
        console.log(nodes);
        //iterateNode(0, null);
        let currentNode;
        for (var i = 0; i < _nodes.length; i++) {

            currentNode = _nodes[i];
            if (currentNode.parentId == parentId) {
                let newLi = createLi(currentNode);
                _ul.appendChild(newLi);
                createToggleEvent(newLi);
                iterateNode(nodes[i].id, newLi);
            }
        }
    };

    this.Tree.prototype.addNode = function (node) {
        let selectedLi = _ul.querySelector('li.selected');
        let newLi = createLi(node);
        if (node.parentId == 0) {
            _ul.appendChild(createLi(node));
            return;
        }
        else {
            
            let currentUl = selectedLi.querySelector('ul');
            if (currentUl == null) {
                currentUl = document.createElement('ul');
                selectedLi.appendChild(currentUl);
                selectedLi.classList.add('hasChild');
            };

            currentUl.appendChild(newLi);
        }
        selectedLi.classList.remove('hasHidden');
        selectedLi.querySelector('ul').classList.remove('hidden');
        return newLi;

    };

    this.Tree.prototype.editNode = function (node) {
        // hitta selected:
        let selectedLi = _ul.querySelector('li.selected');
        let selectedA = selectedLi.querySelector('a');
        selectedA.innerText = node.title;

    };

    this.Tree.prototype.removeNode = function () {
        // hitta selected:
        let selectedLi = _ul.querySelector('li.selected');
        
        if (!selectedLi) {
            console.log('No node is selected');
            return;
        }
        selectedLi.closest('ul').removeChild(selectedLi);
    };

    function iterateNode(parentId, currentLi) {
        const u = document.createElement('ul');
        u.classList.add('hidden');

        let currentNode;
        for (var i = 0; i < _nodes.length; i++) {
            if (_nodes[i].parentId == parentId) {
                
                currentNode = _nodes[i];
                currentLi.append(u);
                currentLi.classList.add('hasChild');

                currentLi.classList.add('hasHidden');

                let newLi = createLi(currentNode);
                u.appendChild(newLi);
                createToggleEvent(newLi);

                iterateNode(_nodes[i].id, newLi);
            }

        };
    }

    function createToggleEvent(li) {
        
        li.addEventListener('click', function (event) {
            event.preventDefault();
            if (event.target.classList.contains('hasChild')) {
                event.target.classList.toggle('hasHidden');
                event.target.querySelector('ul').classList.toggle('hidden');
            }
            event.stopImmediatePropagation();
            //event.cancelBubble = false;


        });
    }
    function createLi(node) {
        let li = document.createElement('li');
        //li.draggable = true;
        let a = document.createElement('a');
        a.href = "#";
        a.innerText = node.title;
        a.draggable = true;

        const event1 = new CustomEvent('nodeClick', { detail: [a,node] });
        a.addEventListener('click', function (event) {
            
            let selected = _ul.querySelectorAll('.selected');
            for (var i = 0; i < selected.length; i++) {
                selected[i].classList.remove('selected');
            }
            li.classList.add('selected');
            event.preventDefault();
            _ul.dispatchEvent(event1);
        });
        li.appendChild(a);

        const event2 = new CustomEvent('nodeAdded', { detail: [node, li] });
        _ul.dispatchEvent(event2);
        return li;
    }



}());