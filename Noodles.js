Noodles = {};

Noodles.Editor = class {
    constructor(el) {

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleEditorMouseDown = this.handleEditorMouseDown.bind(this);
        this.handleEditorWheel = this.handleEditorWheel.bind(this);
        this.handleNodeTitleMouseDown = this.handleNodeTitleMouseDown.bind(this);

        this.dragMode = 0;
        this.draggedNode = null;
        this.mousePosition = null;
        this.dragContainerOffset = {
            x: 0,
            y: 0,
        };
        this.contentScale = 1;

        this.nodes = [];
        this.paths = [];

        let rootContainer = document.createElement("div");
        rootContainer.style.width = "100%";
        rootContainer.style.height = "100%";
        rootContainer.style.margin = "0";
        rootContainer.style.position = "relative";
        rootContainer.style.overflow = "hidden";
        this.rootContainer = rootContainer;

        let dragContainer = document.createElement("div");
        dragContainer.style.width = "0px";
        dragContainer.style.height = "0px";
        dragContainer.style.marginTop = this.dragContainerOffset + "px";
        dragContainer.style.marginLeft = this.dragContainerOffset + "px";
        dragContainer.style.position = "absolute";
        rootContainer.appendChild(dragContainer);
        this.dragContainer = dragContainer;

        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.overflow = "visible";
        dragContainer.appendChild(svg);
        this.svg = svg;
        this.svg.ns = svg.namespaceURI;

        let nodeContainer = document.createElement("div");
        nodeContainer.style.position = "absolute";
        dragContainer.appendChild(nodeContainer);
        this.nodeContainer = nodeContainer;
        
        el.appendChild(rootContainer);

        this.rootContainer.addEventListener("mousedown", this.handleEditorMouseDown);
        this.rootContainer.addEventListener("wheel", this.handleEditorWheel);

        let shape = document.createElementNS(this.svg.ns, "circle");
        shape.setAttributeNS(null, "cx", 0);
        shape.setAttributeNS(null, "cy", 0);
        shape.setAttributeNS(null, "r", 10);
        shape.setAttributeNS(null, "fill", "blue");
        this.svg.appendChild(shape);
    }

    addNode(name) {
        let node = document.createElement("div");
        node.style.width = "300px";
        node.style.height = "250px";
        node.style.backgroundColor = "#ffffff";
        node.style.boxShadow = "0px 0px 25px rgba(100,100,100,0.5)";
        node.style.padding = "5px";
        node.style.overflow = "hidden";
        node.style.borderRadius = "5px";
        node.style.border = "1px solid rgba(100,100,100,0.2)";
        node.style.position = "absolute";

        let title = document.createElement("span");
        title.style.width = "90%";
        title.style.boxSizing = "border-box";
        title.style.margin = "0px 5%";
        title.style.padding = "15px";
        title.style.display = "block";
        title.style.fontWeight = "600";
        title.style.color = "#8e44ad";
        title.style.borderBottom = "0.5px solid rgba(100,100,100,0.2)";
        title.style.cursor = "default";
        title.innerHTML = name;
        node.appendChild(title);

        let controls = document.createElement("div");
        node.appendChild(controls);

        let inputs = document.createElement("ul");
        node.appendChild(inputs);

        let outputs = document.createElement("ul");
        node.appendChild(outputs);

        title.addEventListener("mousedown", this.handleNodeTitleMouseDown);

        this.nodes.push(node);

        this.nodeContainer.appendChild(node);
        
    }

    getElementOffset(el) {
        let offset = { x: 0, y: 0 };
        while (el) {
            offset.x = el.offsetTop;
            offset.y = el.offsetLeft;
            el = el.offsetParent;
        }
        return offset
    }

    moveDragContainer(offset) {
        this.dragContainerOffset.x = this.dragContainerOffset.x + offset.x;
        this.dragContainerOffset.y = this.dragContainerOffset.y + offset.y;
        this.dragContainer.style.marginLeft = this.dragContainerOffset.x + "px";
        this.dragContainer.style.marginTop = this.dragContainerOffset.y + "px";
    }

    moveNode(offset) {
        if (this.draggedNode) {
            let x = this.draggedNode.offsetLeft + offset.x;
            let y = this.draggedNode.offsetTop + offset.y;
            this.draggedNode.style.marginLeft = x + "px";
            this.draggedNode.style.marginTop = y + "px";
        }
    }

    handleEditorMouseDown(e) {
        this.dragMode = 1;
        this.mousePosition = {
            x: e.pageX,
            y: e.pageY,
        }

        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
    }

    handleNodeTitleMouseDown(e) {
        e.preventDefault(); e.stopPropagation();

        this.dragMode = 2;
        this.draggedNode = e.currentTarget.parentElement;

        this.mousePosition = {
            x: e.pageX,
            y: e.pageY,
        };

        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);
    }

    handleMouseMove(e) {
        if (this.dragMode === 1) {
            e.preventDefault(); e.stopPropagation();
            let diff = {
                x: e.pageX - this.mousePosition.x,
                y: e.pageY - this.mousePosition.y,
            }
            this.mousePosition.x = e.pageX;
            this.mousePosition.y = e.pageY;
            this.moveDragContainer(diff);
        }
        if (this.dragMode === 2) {
            e.preventDefault(); e.stopPropagation();
            console.log("mode 2");
            let diff = {
                x: e.pageX - this.mousePosition.x,
                y: e.pageY - this.mousePosition.y,
            }
            this.mousePosition.x = e.pageX;
            this.mousePosition.y = e.pageY;
            this.moveNode(diff);
        }
    }

    handleMouseUp(e) {
        this.dragMode = 0;
        this.mousePosition = null;
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
    }

    handleEditorWheel(e) {
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
    }
}

Noodles.Graph = class {

}