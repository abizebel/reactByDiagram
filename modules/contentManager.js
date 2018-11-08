exports.create = function (node){
    var fragment = (node.connections.length >1) ? ' ,Fragment' : '';
    var imports = `import React, {Component${fragment}} from "react";\n`;
    var useComponents = (node.connections.length >1) ? '<Fragment>\n' : '';
     
    node.connections.forEach(function(link,i){
        imports += `import ${link} from "./${link}";\n`;
        useComponents += `${(node.connections.length >1) ?'\t\t\t\t':''}<${link} />${(node.connections.length >1) ?'\n':''}`;   
    })

    useComponents +=(node.connections.length >1) ? '\t\t\t</Fragment>' : '';
    if (node.connections.length == 0) {
        useComponents += "''";
    }
    
    var classDefinition = 
`
class ${node.name} extends Component {
    constructor(props){
        super(props)
    }
    render (){
        return (
            ${useComponents || ''}
        )
    }
}
export default ${node.name}
`;
    return imports+classDefinition
    
}
