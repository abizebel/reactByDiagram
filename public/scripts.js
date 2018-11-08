var network;
var container;
var importButton;
var exportButton;





function init() {
    container = document.getElementById('network');
    importButton = document.getElementById('import_button');
    exportButton = document.getElementById('export_button');
    network = new vis.Network(container, [], visOptions );
}


function downloadExpoer (){
    var file_path = '/component.zip';
    var a = document.createElement('A');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function destroyNetwork() {
    network.destroy();
    network = new vis.Network(container, [], visOptions );
}


function findLableById (ids){
    
    if (Array.isArray(ids)) {
        var finalIds  = []
        ids.forEach(function(id,i){
                finalIds.push(network.body.data.nodes._data[id].label)
        })
        return finalIds
    }
    else{
        return network.body.data.nodes._data[ids].label
    }
     
} 


function importNetwork() {
    var inputValue = exportArea.value;
    var inputData = JSON.parse(inputValue);

    var data = {
        nodes: getNodeData(inputData),
        edges: getEdgeData(inputData)
    }

    network = new vis.Network(container, data, {});

}

function getNodeData(data) {
    var networkNodes = [];

    data.forEach(function (elem, index, array) {
        networkNodes.push({
            id: elem.id,
            label: elem.id,
            x: elem.x,
            y: elem.y
        });
    });

    return new vis.DataSet(networkNodes);
}

function getNodeById(data, id) {
    for (var n = 0; n < data.length; n++) {
        if (data[n].id == id) { // double equals since id can be numeric or string
            return data[n];
        }
    };

    throw 'Can not find id \'' + id + '\' in data';
}

function getEdgeData(data) {
    var networkEdges = [];

    data.forEach(function (node) {
        // add the connection
        node.connections.forEach(function (connId, cIndex, conns) {
            networkEdges.push({
                from: node.id,
                to: connId
            });
            let cNode = getNodeById(data, connId);

            var elementConnections = cNode.connections;

            // remove the connection from the other node to prevent duplicate connections
            var duplicateIndex = elementConnections.findIndex(function (connection) {
                return connection == node.id; // double equals since id can be numeric or string
            });


            if (duplicateIndex != -1) {
                elementConnections.splice(duplicateIndex, 1);
            };
        });
    });

    return new vis.DataSet(networkEdges);
}

function objectToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key].id = key;
        return obj[key];
    });
}


function editNode(data, cancelAction, callback) {
    document.getElementById('node-label').value = data.label;
    document.getElementById('node-saveButton').onclick = saveNodeData.bind(this, data, callback);
    document.getElementById('node-cancelButton').onclick = cancelAction.bind(this, callback);
    document.getElementById('node-popUp').style.display = 'block';
    var input = document.getElementById('node-popUp').querySelector('#node-label');
    input.value = ''
    input.focus();
    input.addEventListener('keypress',function(e){
        if(e.keyCode == 13) {
            saveNodeData.call(this, data, callback)
        }
    })
}

// Callback passed as parameter is ignored
function clearNodePopUp() {

    document.getElementById('node-saveButton').onclick = null;
    document.getElementById('node-cancelButton').onclick = null;
    document.getElementById('node-popUp').style.display = 'none';

}

function cancelNodeEdit(callback) {
    clearNodePopUp();
    callback(null);
}

function saveNodeData(data, callback) {
    data.label = document.getElementById('node-label').value;
    clearNodePopUp();
    callback(data);
}

function editEdgeWithoutDrag(data, callback) {
    document.getElementById('edge-label').value = '';
    saveEdgeData.call(this, data, callback);
}

function clearEdgePopUp() {
    document.getElementById('edge-saveButton').onclick = null;
    document.getElementById('edge-cancelButton').onclick = null;
    document.getElementById('edge-popUp').style.display = 'none';
}

function cancelEdgeEdit(callback) {
    clearEdgePopUp();
    callback(null);
}

function saveEdgeData(data, callback) {
    if (typeof data.to === 'object')
        data.to = data.to.id
    if (typeof data.from === 'object')
        data.from = data.from.id
    data.label = document.getElementById('edge-label').value;
    clearEdgePopUp();
    callback(data);
}

function exportNetwork() {
    var nodes = objectToArray(network.getPositions());
    nodes.forEach( function(elem, index) { 
        
        elem.connections = network.getConnectedNodes(elem.id,'to')
    });
    

    var exportData= nodes.map(function(data,i){
        return {
            name : findLableById(data.id),
            connections : findLableById(data.connections)
        }
    })
    $.ajax({
        type: 'POST',
        data: JSON.stringify(exportData),
        contentType: 'application/json',
        url: 'http://localhost:3000/save',						
        success: function(data) {
            setTimeout(() => {
                downloadExpoer()
            }, 2000);
        }
    });
    
}
init();