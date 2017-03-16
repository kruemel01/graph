var Noodles;
(function (Noodles) {
    var Editor = (function () {
        function Editor(el) {
            var _this = this;
            this.handleEditorMouseDown = function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.mousePosition = {
                    x: e.pageX,
                    y: e.pageY
                };
                window.addEventListener("mousemove", _this.handleMouseMove);
                window.addEventListener("mouseup", _this.handleMouseUp);
            };
            this.handleMouseMove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var diff = {
                    x: e.pageX - _this.mousePosition.x,
                    y: e.pageY - _this.mousePosition.y
                };
                _this.mousePosition.x = e.pageX;
                _this.mousePosition.y = e.pageY;
                _this.moveDragContainer(diff);
            };
            this.handleMouseUp = function (e) {
                _this.mousePosition = null;
                window.removeEventListener("mousemove", _this.handleMouseMove);
                window.removeEventListener("mouseup", _this.handleMouseUp);
            };
            this.handleEditorWheel = function (e) {
                // TODO: reimplement
                /* Issues with node dragging
                this.contentScale = this.contentScale - 0.001 * e.deltaY;
                if (this.contentScale > 4) {
                    this.contentScale = 4;
                }
                if (this.contentScale < 0.25) {
                    this.contentScale = 0.25;
                }
        
                console.log(this.contentScale);
                this.dragContainer.style.transform = `scale(${this.contentScale})`;*/
            };
            this.draggedNode = null;
            this.mousePosition = null;
            this.dragContainerOffset = { x: 0, y: 0 };
            this.nodes = [];
            var rootContainer = document.createElement("div");
            rootContainer.className = "NoodlesEditorRootContainer";
            this.rootContainer = rootContainer;
            var dragContainer = document.createElement("div");
            dragContainer.className = "NoodlesEditorDragContainer";
            rootContainer.appendChild(dragContainer);
            this.dragContainer = dragContainer;
            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.style.position = "absolute";
            svg.style.overflow = "visible";
            dragContainer.appendChild(svg);
            this.svg = svg;
            var nodeContainer = document.createElement("div");
            nodeContainer.className = "NoodlesEditorNodeContainer";
            dragContainer.appendChild(nodeContainer);
            this.nodeContainer = nodeContainer;
            el.appendChild(rootContainer);
            this.rootContainer.addEventListener("mousedown", this.handleEditorMouseDown);
            this.rootContainer.addEventListener("wheel", this.handleEditorWheel);
            var shape = document.createElementNS(this.svg.namespaceURI, "circle");
            shape.setAttributeNS(null, "cx", "0");
            shape.setAttributeNS(null, "cy", "0");
            shape.setAttributeNS(null, "r", "10");
            shape.setAttributeNS(null, "fill", "blue");
            this.svg.appendChild(shape);
        }
        Editor.prototype.addNode = function (name) {
            var node = new Node(name);
            this.nodeContainer.appendChild(node.DOMElement);
        };
        Editor.prototype.getElementOffset = function (el) {
            var offset = { x: 0, y: 0 };
            while (el) {
                offset.x = el.offsetTop;
                offset.y = el.offsetLeft;
                el = el.offsetParent;
            }
            return offset;
        };
        Editor.prototype.moveDragContainer = function (offset) {
            this.dragContainerOffset.x = this.dragContainerOffset.x + offset.x;
            this.dragContainerOffset.y = this.dragContainerOffset.y + offset.y;
            this.dragContainer.style.marginLeft = this.dragContainerOffset.x + "px";
            this.dragContainer.style.marginTop = this.dragContainerOffset.y + "px";
        };
        return Editor;
    }());
    Noodles.Editor = Editor;
    var Node = (function () {
        function Node(name, initialPosition) {
            var _this = this;
            this.handleNodeTitleMouseDown = function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("node mousedown");
                _this.lastMousePosition = {
                    x: e.pageX,
                    y: e.pageY
                };
                console.log(_this.lastMousePosition);
                window.addEventListener("mousemove", _this.handleMouseMove);
                window.addEventListener("mouseup", _this.handleMouseUp);
            };
            this.handleMouseMove = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var diff = {
                    x: e.pageX - _this.lastMousePosition.x,
                    y: e.pageY - _this.lastMousePosition.y
                };
                _this.lastMousePosition.x = e.pageX;
                _this.lastMousePosition.y = e.pageY;
                _this.move(diff);
            };
            this.handleMouseUp = function (e) {
                _this.lastMousePosition = null;
                window.removeEventListener("mousemove", _this.handleMouseMove);
                window.removeEventListener("mouseup", _this.handleMouseUp);
            };
            this.name = name;
            this.nodePosition = initialPosition || {
                x: 0,
                y: 0
            };
            this.DOMElement = document.createElement("div");
            this.DOMElement.className = "NoodlesNode";
            var title = document.createElement("span");
            title.className = "NoodlesNodeTitle";
            title.innerHTML = name;
            this.DOMElement.appendChild(title);
            var controls = document.createElement("div");
            this.DOMElement.appendChild(controls);
            var inputs = document.createElement("ul");
            this.DOMElement.appendChild(inputs);
            var outputs = document.createElement("ul");
            this.DOMElement.appendChild(outputs);
            this.update();
            title.addEventListener("mousedown", this.handleNodeTitleMouseDown);
        }
        Node.prototype.registeredWithId = function (id) {
            this.id = id;
        };
        Node.prototype.move = function (diff) {
            this.nodePosition.x = this.nodePosition.x + diff.x;
            this.nodePosition.y = this.nodePosition.y + diff.y;
            this.update();
        };
        Node.prototype.update = function () {
            this.DOMElement.style.marginLeft = this.nodePosition.x + "px";
            this.DOMElement.style.marginTop = this.nodePosition.y + "px";
        };
        return Node;
    }());
    Noodles.Node = Node;
})(Noodles || (Noodles = {}));
