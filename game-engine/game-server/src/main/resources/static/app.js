var stompClient = null;

function setConnected(connected) {
    if (connected) {
        $("#connectionState").css('background-color', 'green');
    } else {
        $("#connectionState").css('background-color', 'red');
    }
}

function addToList(content) {
    $("#eventList").append("<li>" + content + "</li>");
}

function connect() {
    //if already connected
    if (stompClient != null) {
        if (stompClient.connected) {
            return;
        }
    }
    var socket = new SockJS('http://localhost:8080/live_view');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        var register_channel = stompClient.subscribe('/user/topic/poker_register', function (currentState) {
            addToList(JSON.parse(currentState.body).message);
            register_channel.unsubscribe();
            stompClient.subscribe('/topic/poker_updates', function (update) {
                addToList(JSON.parse(update.body).message);
            });
        });
        stompClient.send("/app/register", {}, {});

        console.log('Connected: ' + frame);
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

$(function () {
    $("#connectionState").css('background-color', 'red');
    $("#connect").click(function() { connect(); });
    $("#disconnect").click(function() { disconnect(); });
});
