// // export function returnLogin() {
// //     var pathName = window.document.location.pathname;
// //     var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
// //     console.log(projectName);
// //     top.location.replace(projectName + "/login.html");
// // }
//
// const TEMP_URL = 'http://localhost:8082/';

function thePost(url, data, success, error) {
    $.ajax({
        url: TEMP_URL + url,
        type: "POST",
        headers: {
            "X-Access-Auth-Token": $.cookie("token")
        },
        dataType: "application/json",
        contentType: "application/json;charset=utf-8",
        data: data,
        success: function (result) {
            success(result);
        },
        error: function (result) {
            error(result);
        }
    });
}

layui.define(["form", "jquery" , "address"], function (exports) {
    var form = layui.form,
        $ = layui.jquery,
        address = layui.address;
    var common = {
        accessControl: function () {
            //获取省信息
            console.log("开启权限控制");
            var level = $.cookie("level");
            if(level.length === 0){
                address.provinces();

            }else if(level.length === 2){
                address.init1(level.slice(0,2));
                $("#province").attr("disabled","disabled");

            }else if(level.length === 4){
                address.init2(level.slice(0,2),level.slice(0,4));
                $("#province").attr("disabled","disabled");
                $("#city").attr("disabled","disabled");

            }else if(level.length === 6){
                address.init3(level.slice(0,2),level.slice(0,4),level);
                $("#province").attr("disabled","");
                $("#city").attr("disabled","");
                $("#area").attr("disabled","");

            }
            form.render();
        }
    }

    exports("common", common);
});
