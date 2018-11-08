var visOptions = {
    edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.4
          }
        },
        color: {
            opacity: 0.4
        },
        smooth: false
    },
    manipulation : {
        enabled: true,
        initiallyActive: true,
        
        addNode: function (data, callback) {
            // filling in the popup DOM elementeditEdgeWithoutDrags
            document.getElementById('node-operation').innerHTML = "Add Node";
            editNode(data, clearNodePopUp, callback);
        },
        editNode: function (data, callback) {
            // filling in the popup DOM elements
            document.getElementById('node-operation').innerHTML = "Edit Node";
            editNode(data, cancelNodeEdit, callback);
        },
        addEdge: function (data, callback) {
            if (data.from == data.to) {
                return
                var r = confirm("Do you want to connect the node to itself?");
                if (r != true) {
                    callback(null);
                    return;
                }
            }
            document.getElementById('edge-operation').innerHTML = "Add Edge";
            editEdgeWithoutDrag(data, callback);
        },
        editEdge: {
            editWithoutDrag: function (data, callback) {
                document.getElementById('edge-operation').innerHTML = "Edit Edge";
                editEdgeWithoutDrag(data, callback);
            }
        }
    },
    interaction: {
        multiselect: true
    },
    layout: {
        hierarchical: {
        enabled: true,
        levelSeparation: 155
        }
    },
    nodes : {shape: "box"},
}