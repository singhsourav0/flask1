(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);

    // Fixed Navbar
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var $stickyTop = $('.sticky-top');

        if (scrollTop > 300) {
            $stickyTop.addClass('shadow-sm').css('top', '0px');
        } else {
            $stickyTop.removeClass('shadow-sm').css('top', '-200px');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var $backToTop = $('.back-to-top');

        if (scrollTop > 300) {
            $backToTop.fadeIn('slow');
        } else {
            $backToTop.fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

})(jQuery);

function openImageInput() {
    document.getElementById('imageInput').click();
}

function handleImage() {
    var input = document.getElementById('imageInput');
    var image = document.getElementById('uploadedImage');

    // Display the uploaded image
    image.src = URL.createObjectURL(input.files[0]);
    image.style.display = 'block';

    document.getElementById('moodOptions').style.display = 'block';
}

function selectMood(mood) {
    document.getElementById('selectedMood').innerHTML = 'Selected Mood: ' + mood;
    document.getElementById('submitBtn').style.display = 'block';

    // Add this line to store the selected mood in a global variable
    selectedMood = mood;
}

// // Function to show the loading spinner
// function showLoadingSpinner() {
//     document.getElementById('loadingSpinner').style.display = 'inline-block';
// }

// // Function to hide the loading spinner
// function hideLoadingSpinner() {
//     document.getElementById('loadingSpinner').style.display = 'none';
// }

function submitMood() {
    alert("Button clicked!");
    document.getElementById("submitBtn").innerHTML = "Processing...";

    // Start the timer
    startTimer();
    var outputBoxes = document.getElementById('outputBoxes');
    outputBoxes.innerHTML = ''; // Clear previous boxes

    // Assuming you want to send image data to the server (Python) for processing
    var formData = new FormData();
    formData.append('image', document.getElementById('imageInput').files[0]);
    formData.append('mood_category', selectedMood);  // Use the selectedMood variable directly

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
    console.log('Received data:', data);

    // ...

if (data && data.captions) {
    var captionsArray = data.captions.split('\n');


    captionsArray.forEach((caption, index) => {
        console.log('Caption:', caption);
        // Check if the caption starts with a digit
        if (/^\d|\s/.test(caption)) {
        
            var boxNumber = index + 1;
            var box = document.createElement('div');
            box.className = 'outputBox';
            box.textContent = '(⁠ ͡⁠°⁠ ⁠ʖ⁠ ͡⁠°⁠)⁠☞ ' + caption.trim();  // Remove leading/trailing spaces
            outputBoxes.appendChild(box);
        }
        
    });
} else {
    console.error('Invalid response structure or no captions found');
}



    })
    .catch(error => console.error('Error:', error));
}


// function submitMood() {
//     var outputBox = document.getElementById('outputBoxes');
//     outputBox.innerHTML = ''; // Clear previous content

//     // Assuming you want to send image data to the server (Python) for processing
//     var formData = new FormData();
//     formData.append('image', document.getElementById('imageInput').files[0]);

//     fetch('/upload', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Received data:', data);

//         // Assuming the data received from Python contains the results for the output box
//         if (data && data.captions) {
//             var captionsArray = data.captions.split('\n');
//             var captionsHTML = '';

//             captionsArray.forEach(caption => {
//                 captionsHTML += '<li>' + caption.trim() + '</li>';
//             });

//             var outputBox = document.getElementById('outputBoxes');
//             outputBox.innerHTML = '<h2>Generated Captions</h2><ul>' + captionsHTML + '</ul>';
//         } else {
//             console.error('Invalid response structure or no captions found');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }



function startTimer() {
    let seconds = 15;
    const timerElement = document.getElementById("timer");

    function updateTimer() {
        timerElement.innerHTML = `Time left: ${seconds}s`;
        seconds--;

        if (seconds < 0) {
            clearInterval(timerInterval);
            timerElement.innerHTML = "Time's up!";
            document.getElementById("submitBtn").innerHTML = "Wait... Generate";
        }
    }

    updateTimer(); // Update immediately

    const timerInterval = setInterval(updateTimer, 1000); // Update every second
}