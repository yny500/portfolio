window.sfp = window.sfp || {};
sfp.socket = (function ($) {
	let options ={
    	isReconnection : true
    	, reconnectDelay : 10000
    	, onConnection : null		// function
    	, onError : null			// function disconnection
    	, onReconnection : null 	// function 재접속이 필요한가?
//    	, subscribes = [
//    		{
//				topic : "workstation/sample"
//				, onMessage : function(data){
//					alert("sample");
//				}
//				, onError : function(data){
//					alert("sample");
//				}
//			}
//    	]
    }, wsUrl = "/ws", ws = null, client = null, isConnection = false;

    const connect = function(op) {
    	$.extend(options, op);
    	ws = new SockJS(SFPURL.getUrl(wsUrl));
		client = Stomp.over(ws);
		client.connect({}, _onConnection, _onError);
//		disconnect();
    }
    , disconnect = function() {
    	if(client != null){
    		client.disconnect(_onDisconnect, {});
    	}
    }
    , _registSubscriber = function () {
    	!$.isArray(options.subscribes) && (options.subscribes = [options.subscribes]);
    	$.each(options.subscribes, function(index, subscribe){
    		client.subscribe('/subscribe/' + subscribe.topic
	        , function (payload) {
	            var message = JSON.parse(payload.body);
	            $.isFunction(subscribe.onMessage) && subscribe.onMessage.call(this, message);
	        }
	        , subscribe.onError);
    	});
	}
    , _onConnection = function(){
    	isConnection = true;
    	_registSubscriber();
    	$.isFunction(options.onConnection) && options.onConnection.call(this);
    }
    , _onError = function(){
    	isConnection = false;
		if(options.isReconnection === true){
			setTimeout(function(){
				disconnect();
				connect(options);
			}, options.reconnectDelay);
		}
		$.isFunction(options.onError) && options.onError.call(this);
    }
    , _onDisconnect = function() {
//		alert("disconnect");
	};

    return {
    	connect : connect
    	, disconnect : disconnect
    	, isConnection : isConnection
    }
})(jQuery);
window.SFPWebSocket  = sfp.socket;