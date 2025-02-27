// Global variables
let drawingCanvas = null;
let toolbar = null;
let drawingEnabled = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let ctx;

// Create canvas element
function createDrawingCanvas() {
    const canvas = document.createElement('canvas');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';  
    canvas.style.zIndex = '9998';         
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    return canvas;
}

// Create toolbar element
function createToolbar() {
    const toolbarDiv = document.createElement('div');
    
    // Style the toolbar
    toolbarDiv.style.position = 'fixed';
    toolbarDiv.style.top = '10px';
    toolbarDiv.style.right = '10px';
    toolbarDiv.style.padding = '10px';
    toolbarDiv.style.backgroundColor = '#f0f0f0';
    toolbarDiv.style.borderRadius = '5px';
    toolbarDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toolbarDiv.style.zIndex = '9999';
    toolbarDiv.style.display = 'none'; // Hidden by default
    
    // Add toolbar buttons
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Enable Drawing';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';

    const clearButton = document.createElement('button');
    clearButton.textContent = 'X'; // change to trash can icon later??
    clearButton.style.padding = '5px 10px';
    clearButton.style.backgroundColor = 'black';
    clearButton.style.color = 'red';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '3px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.marginLeft = '5px';

    clearButton.addEventListener('click', function () {
        clearAll();
    })
    
    toggleButton.addEventListener('click', function() {
        toggleDrawing();
        
        if (drawingEnabled) {
            toggleButton.textContent = 'Disable Drawing';
            toggleButton.style.backgroundColor = '#f44336';
            //clearButton.style.textContent
        } else {
            toggleButton.textContent = 'Enable Drawing';
            toggleButton.style.backgroundColor = '#4CAF50';
        }
    });


    
    toolbarDiv.appendChild(toggleButton);
    toolbarDiv.appendChild(clearButton);
    return toolbarDiv;
}

// Toggle drawing mode
function toggleDrawing() {
    drawingEnabled = !drawingEnabled;
    setDrawingMode(drawingEnabled);
}

// Clear all drawings on the canvas
function clearAll() {
    if (ctx && drawingCanvas) {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
}

// Enable or disable drawing mode
function setDrawingMode(enabled) {
    if (!drawingCanvas) return;

    drawingCanvas.style.pointerEvents = enabled ? 'auto' : 'none';

    if (enabled) {
        drawingCanvas.addEventListener('mousedown', startDrawing);
        drawingCanvas.addEventListener('mousemove', draw);
        drawingCanvas.addEventListener('mouseup', stopDrawing);
        drawingCanvas.addEventListener('mouseout', stopDrawing);
    } else {
        drawingCanvas.removeEventListener('mousedown', startDrawing);
        drawingCanvas.removeEventListener('mousemove', draw);
        drawingCanvas.removeEventListener('mouseup', stopDrawing);
        drawingCanvas.removeEventListener('mouseout', stopDrawing);
    }
    
    console.log('Drawing mode ' + (enabled ? 'enabled' : 'disabled'));
}

// Initialize everything
function initialize() {
    // Create and inject canvas
    drawingCanvas = createDrawingCanvas();
    document.body.appendChild(drawingCanvas);

    // Set up canvas context
    ctx = drawingCanvas.getContext('2d');
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    // Create and inject toolbar
    toolbar = createToolbar();
    document.body.appendChild(toolbar);
    
    // Show toolbar
    toolbar.style.display = 'block';
    
    console.log('Canvas and toolbar have been injected!');
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    [lastX, lastY] = [e.clientX, e.clientY];
}

function stopDrawing() {
    isDrawing = false;
}

// Listen for messages from the popup and/or the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('Message received:', message);
    
    if (message.action === 'showToolbar') {
        // Old support for popup.js if I find out I need it later
        toolbar.style.display = 'block';
        sendResponse({status: 'success'});
        // Listen for the action of clicking on the extention icon
    } else if (message.action === 'toggleVisibility') {
        if (message.isActive) {
            toolbar.style.display = 'block';
            drawingCanvas.style.display = 'block';
        } else {
            toolbar.style.display = 'none';
            drawingCanvas.style.display = 'none';

            if (drawingEnabled) {
                toggleDrawing();
            }
        }
        sendResponse({status: 'success'});
    }

    return true;
});

// Handle window resize
window.addEventListener('resize', function() {
    if (!drawingCanvas) return;
    
    // Update canvas dimensions
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    
    // Restore context settings after resize
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
});

// Run initialization when the page is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}