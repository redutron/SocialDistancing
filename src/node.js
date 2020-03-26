'use strict';
class Node
{
    constructor(screenWidth,screenHeight)
    {    
        this.id                 = Math.floor((Math.random() * 100000000) + 1);
        this.screenWidth        = screenWidth;//width of browser window screen
        this.screenHeight       = screenHeight;//height of browser window screen 
        this.radius             = 2;  
        this.color              = 'white'; 
        this.velocityMagnitude  = 2;//0.5; 
        this.velocity           = this.getRandomVelocity();//the direction and speed with which the node moves on start 
        this.linkDistance       = 100;//The maximum distance required for a node to link to other nodes 
        //set the starting position of the node on the canvas
        this.xcoordinateOfCircleCenter = Math.floor((Math.random() * this.screenWidth) + 1);//a random number between 1 and the width of the screen.
        this.ycoordinateOfCircleCenter = Math.floor((Math.random() * this.screenHeight) + 1);//a random number between 1 and the height of the screen.  
    } 
    getColor(opacity) 
    {
        if(this.color === 'white')
        {
            return `rgba(255,255,255,${opacity})`; 
        }
        return `rgba(0,0,0,${opacity})`; 
    }
    setColor(color)
    {
        this.color = color; 
    }
    /**
    * Let node correspond to window resizing.
    * @param  {number} screenHeight The height of the screen. 
    * @param  {number} screenWidth  The width of the screen.  
    */
    refreshScreenSize(screenHeight,screenWidth)
    {
        if(this.screenHeight !== screenHeight || this.screenWidth !== screenWidth)//if the screen size has changed
        { 
            var dy              = screenHeight/this.screenHeight;//percentage change in browser window height 
            var dx              = screenWidth/this.screenWidth;//percentage change in browser window width  
            this.screenHeight   = screenHeight;  
            this.screenWidth    = screenWidth; 
            this.xcoordinateOfCircleCenter *= dx; 
            this.ycoordinateOfCircleCenter *= dy; 
        } 
    } 
    /**
    * Set the node in a random direction on start
    * @return  {object} The direction of the node (depicted as x and y coordinates).  
    */
    getRandomVelocity() 
    {  
        var x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves forwards or backwards
        var y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude;//flip a coin to decide if node moves upwards or downwards
        return {x:x, y:y};
    }
    /**
    * Draws three filled circles with increasing radius and decreasing opacity.   
    */
    drawNode(ctx)
    { 
        for(var i = 0; i < 3; i++)
        {
            var color   = ''; 
            var radius  = 0; 
            switch(i)
            {
                case 0:
                    radius  =   this.radius; 
                    color   =   'white';//keep the innermost circle always white
                    break; 
                case 1: 
                    radius  =   this.radius * 4; //this.radius * 3; 
                    color   =   this.getColor(0.5);  
                    break; 
                case 2: 
                    radius  =   this.radius * 7; //this.radius * 6; 
                    color   =   this.getColor(0.2); 
                    break; 
            }
            //draw the node
            ctx.beginPath(); 
            ctx.arc(this.xcoordinateOfCircleCenter,this.ycoordinateOfCircleCenter,radius,0,2*Math.PI);
            ctx.fillStyle = color; 
            ctx.fill(); 
            ctx.strokeStyle = color;
            ctx.stroke();
        } 
    }
    draw(ctx,centerCoordinatesOfNodes)
    {   
        this.drawNode(ctx);  
        this.drawLinkToOtherNodes(centerCoordinatesOfNodes,ctx); 
    }  
    getCoordinatesOfCenter() 
    {
        return {x:this.xcoordinateOfCircleCenter,y:this.ycoordinateOfCircleCenter,color: this.color,id:this.id};
    }
    update(deltaTime)
    {   
        //randomly change the angle of movement in the current direction 
        this.velocity.x += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        this.velocity.y += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        //keep the node moving in its current direction  
        this.xcoordinateOfCircleCenter += this.velocity.x;//if node is going left or right at an angle, keep it going
        this.ycoordinateOfCircleCenter += this.velocity.y;//if node is going up or down at an angle, keep it going  
        if(this.xcoordinateOfCircleCenter - this.radius < 0)//if node touches the left wall of the canvas
        {
            this.velocity.x = -this.velocity.x;//move to the right 
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down
        } 
        if(this.xcoordinateOfCircleCenter + this.radius> this.screenWidth)//if node touches the right wall
        {
            this.velocity.x = -this.velocity.x;//move to the left
            this.velocity.y = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either up or down 
        } 
        if( this.ycoordinateOfCircleCenter - this.radius< 0)//if node touches the top of the wall 
        {
            this.velocity.y = -this.velocity.y;//move down 
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right
        } 
        if(this.ycoordinateOfCircleCenter + this.radius > this.screenHeight)//if node touches the bottom of the wall
        { 
            this.velocity.y = -this.velocity.y;//move up  
            this.velocity.x = Math.random() > 0.5? -this.velocityMagnitude: this.velocityMagnitude ;//flip a coin to move either left or right 
        }  
    }  
    drawLinkToOtherNodes(coordinates,ctx)
    {
        var x1          = this.xcoordinateOfCircleCenter,
            y1          = this.ycoordinateOfCircleCenter, 
            color       = this.color,  
            linkDistance= this.linkDistance,
            id          = this.id; 
        coordinates.forEach(function(value, index, array) 
        { 
            if(id > value.id)//if another node can connect to this node
            {
                var x2 = value.x; 
                var y2 = value.y;  
                var dx = x2 - x1; 
                var dy = y2 - y1;  
                var distance = Math.sqrt(dx*dx + dy*dy);
                if( distance <= linkDistance)//if another node is in range, draw the link
                {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.3; 
                    ctx.beginPath();  
                    ctx.moveTo(x1, y1);  
                    ctx.lineTo(x2, y2);   
                    ctx.stroke();
                    ctx.closePath(); 
                }  
            } 
        }); 
        if(this.collisionDetected(coordinates))//if this node collides with other nodes
        { 
            this.color = 'black';  
        }
    }    
    collisionDetected(coordinates)//check if this node has collided with other nodes
    {  
        for(var i = 0; i < coordinates.length; i++)
        { 
            /*NB:The set of coordinates includes the most recent coordinates of all nodes including this node. 
            * Hence by default, there is at least one collision ie the collision of this node with itself.
            * That possibility must be eliminated.*/
            if(this.id !== coordinates[i].id && coordinates[i].color === 'black'/*node collides with infected node*/)
            {
                var dx = coordinates[i].x - this.xcoordinateOfCircleCenter; 
                var dy = coordinates[i].y - this.ycoordinateOfCircleCenter;  
                var distance = Math.sqrt(dx*dx + dy*dy); 
                if( distance <= (this.radius * 4))//if another node is within range  
                {
                    return true;//collision detected
                }  
            }  
        }   
        return false; 
    }
}