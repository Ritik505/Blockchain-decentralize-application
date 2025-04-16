// Function to generate car images
function generateCarImages() {
    // Create player car
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = 100;
    playerCanvas.height = 200;
    const playerCtx = playerCanvas.getContext('2d');
    
    // Draw player car (blue sports car)
    playerCtx.fillStyle = '#3498db';
    playerCtx.fillRect(20, 50, 60, 100); // Main body
    playerCtx.fillStyle = '#2980b9';
    playerCtx.fillRect(10, 40, 80, 20); // Front
    playerCtx.fillRect(10, 150, 80, 20); // Back
    playerCtx.fillStyle = '#87CEEB';
    playerCtx.fillRect(30, 60, 40, 30); // Windshield
    playerCtx.fillStyle = '#000';
    playerCtx.fillRect(20, 40, 20, 20); // Left wheel
    playerCtx.fillRect(60, 40, 20, 20); // Right wheel
    playerCtx.fillRect(20, 140, 20, 20); // Left wheel
    playerCtx.fillRect(60, 140, 20, 20); // Right wheel
    
    // Create enemy car (Batman car - black with yellow accents)
    const enemyCanvas = document.createElement('canvas');
    enemyCanvas.width = 100;
    enemyCanvas.height = 200;
    const enemyCtx = enemyCanvas.getContext('2d');
    
    // Draw enemy car (Batman style)
    enemyCtx.fillStyle = '#000';
    enemyCtx.fillRect(20, 50, 60, 100); // Main body
    enemyCtx.fillStyle = '#111';
    enemyCtx.fillRect(10, 40, 80, 20); // Front
    enemyCtx.fillRect(10, 150, 80, 20); // Back
    enemyCtx.fillStyle = '#FFD700';
    enemyCtx.fillRect(30, 60, 40, 30); // Windshield
    enemyCtx.fillStyle = '#FFD700';
    enemyCtx.fillRect(20, 40, 20, 20); // Left wheel
    enemyCtx.fillRect(60, 40, 20, 20); // Right wheel
    enemyCtx.fillRect(20, 140, 20, 20); // Left wheel
    enemyCtx.fillRect(60, 140, 20, 20); // Right wheel
    
    // Add Batman symbol
    enemyCtx.fillStyle = '#FFD700';
    enemyCtx.beginPath();
    enemyCtx.moveTo(50, 80);
    enemyCtx.lineTo(30, 100);
    enemyCtx.lineTo(70, 100);
    enemyCtx.closePath();
    enemyCtx.fill();
    
    // Convert canvases to data URLs
    const playerCarDataURL = playerCanvas.toDataURL('image/png');
    const enemyCarDataURL = enemyCanvas.toDataURL('image/png');
    
    // Create download links
    const playerLink = document.createElement('a');
    playerLink.href = playerCarDataURL;
    playerLink.download = 'player-car.png';
    playerLink.textContent = 'Download Player Car';
    
    const enemyLink = document.createElement('a');
    enemyLink.href = enemyCarDataURL;
    enemyLink.download = 'batman-car.png';
    enemyLink.textContent = 'Download Batman Car';
    
    // Add links to document
    document.body.appendChild(playerLink);
    document.body.appendChild(document.createElement('br'));
    document.body.appendChild(enemyLink);
}

// Run when page loads
window.onload = generateCarImages; 