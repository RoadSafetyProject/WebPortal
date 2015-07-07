/**
 * Created by kelvin on 6/30/15.
 */
// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

// Define the string
var serverUrl="http://roadsafety.go.tz/demo";

// Encode the String
var encodedString = Base64.encode("portal:PORTAL2015");
console.log(encodedString); // Outputs: "SGVsbG8gV29ybGQh"

// Decode the String
var decodedString = Base64.decode(encodedString);
console.log(decodedString); // Outputs: "Hello World!"

$(document).ready(function(){

    $.ajax({
                    type: 'GET',
                    url: serverUrl+'/api/dashboards.json?fields=id,name,href,dashboardItems[id,type,shape]&paging=false',
                    headers: {
                        "Authorization": "Basic " + encodedString,
                        "Content-Type": "application/json"
                    },
                    success : function(data) {
                        $.each(data.dashboards, function(index, element) {
                            $(".menu").append("<li  class='main-menu' id='"+element.id+"'><a href='#'>"+element.name+"</a></li>");
                        });
                        $(".main-menu").click(function(){
                            $(".main-menu").removeClass('active');
                            $(this).addClass("active");
                            var id = $(this).attr("id");
                            $(".contents").html(id);
                            var item = $(this);
                            $.each(data.dashboards, function(index, element) {
                                if(element.id == id){
                                    $(".contents").html("");
                                    $.each(element.dashboardItems, function(index, ds) {
                                        if(ds.shape == "normal")
                                            $.ajax({
                                                type: 'GET',
                                                url: serverUrl+'/api/dashboardItems/'+ds.id,
                                                headers: {
                                                    "Authorization": "Basic " + encodedString,
                                                    "Content-Type": "application/json"
                                                },
                                                success : function(data) {
                                                    var imgurl = data[data.type].href+'/data'
                                                    if(data.type=='reportTable') {
														$.get(imgurl+'.html+css',function(htmldata){
															$(".contents").append("<div class='col-sm-6'><div style='width: 100%' class='thumbnail responsive'>"+htmldata+"</div></div>" );
														});
													}else {
														$(".contents").append("<div class='col-sm-6' style=''><img src='"+imgurl+"' style='width: 100%' class='thumbnail responsive'></div>" );
													}
                                                }

                                            });
                                        if(ds.shape == "double_width" || ds.shape == "full_width" )
                                            $.ajax({
                                                type: 'GET',
                                                url: serverUrl+'/api/dashboardItems/'+ds.id,
                                                headers: {
                                                    "Authorization": "Basic " + encodedString,
                                                    "Content-Type": "application/json"
                                                },
                                                success : function(data) {
                                                    var imgurl = data[data.type].href+'/data'
                                                     if(data.type=='reportTable') {
														$.get(imgurl+'.html+css',function(htmldata){
															$(".contents").append("<div class='col-sm-12'><div style='width: 100%' class='thumbnail responsive'>"+htmldata+"</div></div>" );
														});
													}else {
														$(".contents").append("<div class='col-sm-12' style=''><img src='"+imgurl+"' style='width: 100%' class='thumbnail responsive'></div>" );
													}
                                                }

                                            });
                                    });
                                }
                            });
                        });
                        $( ".main-menu" ).first().trigger("click");
                    }

                });
});

    function setHeader(xhr) {
        xhr.setRequestHeader('Authorization', 'Basic '+encodedString);
    }
