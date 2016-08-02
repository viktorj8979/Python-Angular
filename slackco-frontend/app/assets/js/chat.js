$(function() {
    // When we're using HTTPS, use WSS too.
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var room_id = 10;
    var chatsock = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat" + room_id);
    
    chatsock.onmessage = function(message) {
        var data = JSON.parse(message.data);
        console.log("data: ", data)
        var chat = $("#chat")
        var ele = $('<tr></tr>')

        ele.append(
            $("<td></td>").text(data.timestamp)
        )
        ele.append(
            $("<td></td>").text(data.handle)
        )
        if (data.type == 'file') {
            var fileUrl = data.message
            var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
            console.log('file uploaded')
            ele.append(
                $("<td></td>").html("<a href="+fileUrl+" target=_blank>"+fileName+"</a>")
            )
        } else {
            console.log("data-type: ", data.type)
            ele.append(
                $("<td></td>").text(data.message)
            )
        }
        
        chat.append(ele)
    };

    $("#chatform").on("submit", function(event) {
        var message = {
            handle: $('#handle').val(),
            type: "text",
            message: $('#message').val(),
        }
        chatsock.send(JSON.stringify(message));
        $("#message").val('').focus();
        return false;
    });
    $("#file").change(function() {
        var fileName = $(this).val();
        if (fileName) {
            console.log("file is selected");
            // Added code
            var fd = new FormData();
            var files = $('#file').prop("files");
            if (files.length) {
                fd.append("file", files[0], files[0].name);
            }
            $.ajax({
                url: '/api/v1/files/',
                type: 'post',
                contentType: false,
                data: fd,
                processData: false,
                success: function(response){
                    console.log("response: ", response);
                    var message = {
                        handle: $('#handle').val(),
                        type: "file",
                        message: response.file,
                    }
                    chatsock.send(JSON.stringify(message));
                    $("#message").val('').focus();
                    $("#file").val('');
                    return false;
                }
            });
            // End of code
            
        } else {
            console.log("not selected");
        }
        // console.log("fileName: ", fileName);
    })
});