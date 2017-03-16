namespace Noodles {

    interface Position {
        x : number,
        y : number,
    }

    export class Editor {

        private draggedNode : Node;
        private mousePosition : Position;
        private dragContainerOffset : Position;

        private rootContainer : HTMLDivElement;
        private dragContainer : HTMLDivElement;
        private nodeContainer : HTMLDivElement;
        private svg : SVGSVGElement;
        
        private nodes : Array<Node>;

        constructor(el) {

            this.draggedNode = null;
            this.mousePosition = null;
            this.dragContainerOffset = { x: 0, y: 0 };

            this.nodes = [];

            let rootContainer = document.createElement("div");
            rootContainer.className = "NoodlesEditorRootContainer";
            this.rootContainer = rootContainer;

            let dragContainer = document.createElement("div");
            dragContainer.className = "NoodlesEditorDragContainer";
            rootContainer.appendChild(dragContainer);
            this.dragContainer = dragContainer;

            let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.style.position = "absolute";
            svg.style.overflow = "visible";
            dragContainer.appendChild(svg);
            this.svg = svg;

            let nodeContainer = document.createElement("div");
            nodeContainer.className = "NoodlesEditorNodeContainer";
            dragContainer.appendChild(nodeContainer);
            this.nodeContainer = nodeContainer;
        
            el.appendChild(rootContainer);

            this.rootContainer.addEventListener("mousedown", this.handleEditorMouseDown);
            this.rootContainer.addEventListener("wheel", this.handleEditorWheel);

            let shape = document.createElementNS(this.svg.namespaceURI, "circle");
            shape.setAttributeNS(null, "cx", "0");
            shape.setAttributeNS(null, "cy", "0");
            shape.setAttributeNS(null, "r", "10");
            shape.setAttributeNS(null, "fill", "blue");
            this.svg.appendChild(shape);
        }

        addNode(name) {
            let node = new Node(name);
            this.nodeContainer.appendChild(node.DOMElement);
            this.nodes.push(node);
            node.registeredWithId(this.nodes.indexOf(node));
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

    	handleEditorMouseDown = (e : MouseEvent) => {
            e.preventDefault(); e.stopPropagation();

            this.mousePosition = {
                x: e.pageX,
                y: e.pageY,
            }

            window.addEventListener("mousemove", this.handleMouseMove);
            window.addEventListener("mouseup", this.handleMouseUp);
        }


        handleMouseMove = (e : MouseEvent) => {
            e.preventDefault(); e.stopPropagation();

            let diff = {
                x: e.pageX - this.mousePosition.x,
                y: e.pageY - this.mousePosition.y,
            };

            this.mousePosition.x = e.pageX;
            this.mousePosition.y = e.pageY;
            this.moveDragContainer(diff);
        }

        handleMouseUp = (e : MouseEvent) => {
            this.mousePosition = null;
            window.removeEventListener("mousemove", this.handleMouseMove);
            window.removeEventListener("mouseup", this.handleMouseUp);
        }

        handleEditorWheel = (e : MouseEvent) => {
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
        }
    }

    export class Node {

        public name : string;
        public readonly DOMElement : HTMLDivElement;
        public id : number;

        private lastMousePosition : Position;
        private nodePosition : Position;

        constructor(name : string, initialPosition? : Position) {
            this.name = name;

            this.nodePosition = initialPosition || {
                x: 0,
                y: 0,
            };

            this.DOMElement = document.createElement("div");
            this.DOMElement.className = "NoodlesNode";

            let title = document.createElement("span");
            title.className = "NoodlesNodeTitle";
            title.innerHTML = name;
            this.DOMElement.appendChild(title);

            let controls = document.createElement("div");
            this.DOMElement.appendChild(controls);

            let inputs = document.createElement("ul");
            this.DOMElement.appendChild(inputs);

            let outputs = document.createElement("ul");
            this.DOMElement.appendChild(outputs);

            this.update();

            title.addEventListener("mousedown", this.handleNodeTitleMouseDown);
        }

        registeredWithId(id : number) {
            this.id = id;
        }

        move(diff : Position) {
            this.nodePosition.x = this.nodePosition.x + diff.x;
            this.nodePosition.y = this.nodePosition.y + diff.y;
            this.update();
        }

        update() {
            this.DOMElement.style.marginLeft = this.nodePosition.x + "px";
            this.DOMElement.style.marginTop = this.nodePosition.y + "px";
        }

        handleNodeTitleMouseDown = (e : MouseEvent) => {
            e.preventDefault(); e.stopPropagation();

            console.log("node mousedown");

            this.lastMousePosition = {
                x: e.pageX,
                y: e.pageY,
            };

            console.log(this.lastMousePosition);

            window.addEventListener("mousemove", this.handleMouseMove);
            window.addEventListener("mouseup", this.handleMouseUp);
        }

        handleMouseMove = (e : MouseEvent) => {
            e.preventDefault(); e.stopPropagation();

            let diff = {
                x: e.pageX - this.lastMousePosition.x,
                y: e.pageY - this.lastMousePosition.y,
            }

            this.lastMousePosition.x = e.pageX;
            this.lastMousePosition.y = e.pageY;
            this.move(diff);
        }

        handleMouseUp = (e : MouseEvent) => {
            this.lastMousePosition = null;
            window.removeEventListener("mousemove", this.handleMouseMove);
            window.removeEventListener("mouseup", this.handleMouseUp);
        }
    }
}