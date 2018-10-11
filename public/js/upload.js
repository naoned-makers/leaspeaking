$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

/*
$("form#data").submit(function(e) {
  e.preventDefault();    
  let soundName = $('#sound-name').val();
  console.log("XXEEEEEEEEEEEEEEEEEEEEE", soundName);
  if (soundName == "") {
    alert("Upload impossible. Il est obligatoire de remplir un nom de fichier sans extension.")
    return false;
  }

  var formData = new FormData(this);

  $.ajax({
      url: '/upload',
      type: 'POST',
      data:  {formData: formData, soundName: soundName},
      success: function (data) {
          alert(data)
      },
      error: function (message) {
        alert(message)
      },
      cache: false,
      contentType: false,
      processData: false
  });
});


$('#upload-input').on('change', function(){
  let soundName = $('#sound-name').val();
  console.log("EEEEEEEEEEEEEEEEEEEEE", soundName);
  if (soundName == "") {
    console.log("UPLOAD IMPOSSIBLE")
    return false;
  }

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);

    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: {formData: formData, soundName: soundName},
      processData: false,
      contentType: 'application/octet-stream',
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});

*/
function upload() {
  let soundName = document.getElementById('sound-name').value;
  console.log("AAXXEEEEEEEEEEEEEEEEEEEEE", soundName);
  if (soundName != "") {
    loadSound();
  } else {
    alert("Upload impossible. Il est obligatoire de remplir un nom de fichier sans extension.");
  }
  //var files = $(this).get(0).files;
 /* let files = document.getElementById('upload-input').files;

  if (files.length > 0) {
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    let formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      let file = files[i];

      // add the files to formData object for the data payload
      //formData.append('uploads[]', file, file.name);
      formData.append('soundName', soundName);

    }
    doUpload(formData);
  }*/
}

function generateBoundary() {
  return "AJAX-----------------------" + (new Date).getTime();
}


function buildMessage() {
  var boundary = this.generateBoundary();
  var CRLF = "\r\n";
  var parts = [];

//NAME
  let soundName = document.getElementById('sound-name').value;
  let partSoundName = "";
  partSoundName += 'Content-Disposition: form-data; ';
  partSoundName += 'name="soundName"' + CRLF + CRLF;
  partSoundName += soundName + CRLF;
  parts.push(partSoundName);


// FILE
  let files = document.getElementById('upload-input').files
  var fieldName = 'uploads[]';
  var fileName = files[0].name;
  console.log()
  let partFile = "";
  partFile += 'Content-Disposition: form-data; ';
  partFile += 'name="' + fieldName + '"; ';
  partFile += 'filename="'+ fileName + '"' + CRLF;
  partFile += "Content-Type: application/octet-stream";
  partFile += CRLF + CRLF; // marks end of the headers part
  var r = new FileReader();
  partFile += r.readAsBinaryString(files[0]) + CRLF;

  parts.push(partFile);


  var request = "--" + boundary + CRLF;
      request+= parts.join("--" + boundary + CRLF);
      request+= "--" + boundary + "--" + CRLF;

  return request;
}   

function sendSound(sound) {
  var request = new XMLHttpRequest();
  request.open("POST", "http://localhost:3333/upload");
  request.addEventListener("progress", progress);
  //request.send(buildMessage());

  request.send((JSON.stringify({
    value: "value",
    soundName:  document.getElementById('sound-name').value,
    sound: sound
  })));

}

function loadSound() {
  let file = document.getElementById('upload-input').files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    sendSound(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

function progress(evt) {
  if (evt.lengthComputable) {
    // calculate the percentage of upload completed
    var percentComplete = evt.loaded / evt.total;
    percentComplete = parseInt(percentComplete * 100);

    // update the Bootstrap progress bar with the new percentage
    $('.progress-bar').text(percentComplete + '%');
    $('.progress-bar').width(percentComplete + '%');

    // once the upload reaches 100%, set the progress bar text to done
    if (percentComplete === 100) {
      $('.progress-bar').html('Done');
    }
  }
}

