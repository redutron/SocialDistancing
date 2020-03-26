'use strict'; 
/**
 * Gets the size of the browser window. 
 * @return {object} The length and breadth of the browser window.
 */
function getBrowserWindowSize() 
{
    var win = window,
    doc     = document,
    docElem = doc.documentElement,
    body    = doc.getElementsByTagName('body')[0],
    browserWindowWidth  = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight; 
    return {x:browserWindowWidth-10,y:browserWindowHeight-10}; 
}
/**
 * Creates new nodes.
 * @param  {number} numOfNodes The number of nodes to create. 
 * @return {array}  An array of all the new nodes created.
 */
function spawnNodes(numOfNodes) 
{
    var nodes = [];
    for(var i = 0; i< numOfNodes; i++)
    { 
        nodes.push(new Node(SCREEN_WIDTH,SCREEN_HEIGHT)); 
        
    }
    if(nodes.length>0)
    {
        nodes[nodes.length-1].setColor('black'); //make the last node infected
    }
    return nodes; 
}  
 
var c                   = document.getElementById("distancingCanvas");
var ctx                 = c.getContext("2d");  
var browserWindowSize   = getBrowserWindowSize();
//set size of canvas
c.width                 = browserWindowSize.x; 
c.height                = browserWindowSize.y; 
var SCREEN_WIDTH        = browserWindowSize.x;
var SCREEN_HEIGHT       = browserWindowSize.y;   
var totalSpan           = document.getElementById('total'), 
    infectedSpan        = document.getElementById('infected'),  
    numOfNodes          = 100; 
var nodes               = spawnNodes(numOfNodes), 
    lastTime            = 100, 
    windowSize,
    numInfected         = (nodes.length > 0? 1: 0); 
totalSpan.textContent   = numOfNodes;//display the total number of nodes
infectedSpan.textContent= numInfected;//display the total number of nodes
 
function nodeLoop(timestamp)
{  
    //Let the canvas correspond to window resizing
    windowSize     = getBrowserWindowSize();
    c.width        = windowSize.x; 
    c.height       = windowSize.y; 
    SCREEN_WIDTH   = windowSize.x;
    SCREEN_HEIGHT  = windowSize.y;  
    ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT); 
    numInfected    = 0; 
    //Nodes are represented on the canvas as filled circles. Get the center of each of these filled circles.
    var centerCoordinatesOfNodes =  nodes.reduce(function(array, node) 
    { 
        node.refreshScreenSize(SCREEN_HEIGHT,SCREEN_WIDTH);//let each node respond to window resizing]
        var coord = node.getCoordinatesOfCenter(); 
        if(coord.color === 'black')
        {
            numInfected++;
        }
        array.push(coord);  
        return array; 
    }, []); 
    infectedSpan.textContent= numInfected;//display the total number of infected nodes
    nodes.forEach(function (node) 
    {     
        let deltaTime = timestamp - lastTime; 
        lastTime = timestamp; 
        node.update(deltaTime);
        node.draw(ctx,centerCoordinatesOfNodes);   
    });    
    requestAnimationFrame(nodeLoop); 
} 
requestAnimationFrame(nodeLoop); 
 