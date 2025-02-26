// // Wait for the DOM to fully load
// document.addEventListener('DOMContentLoaded', function() {
//     // Get the launch button
//     const launchButton = document.getElementById('launchSketch');
    
//     // Add click event listener to the button
//     launchButton.addEventListener('click', function() {
//       // Send message to the content script to show the toolbar
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         try {
//           // Check if we have a valid tab
//           if (tabs && tabs[0] && tabs[0].id) {
//             // Send a message to show the toolbar
//             chrome.tabs.sendMessage(tabs[0].id, {
//               action: 'showToolbar'
//             }, function(response) {
//               // Handle potential errors
//               if (chrome.runtime.lastError) {
//                 console.log('Error sending message:', chrome.runtime.lastError.message);
//               } else {
//                 // Close the popup after launching
//                 window.close();
//               }
//             });
//           }
//         } catch (error) {
//           console.log('Error:', error);
//         }
//       });
//     });
//   });