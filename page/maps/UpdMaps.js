layui.config({
    base: "../../js/"
}).extend({
    "address": "address"
});
layui.use(['form', 'layer', "address"], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        address = layui.address;

    var pointAreaId = sessionStorage.getItem("pointAreaId");
    address.init3(pointAreaId.slice(0, 2), pointAreaId.slice(0, 4), pointAreaId);//初始化地址
    console.log("开启权限控制");
    var level = $.cookie("level");
    if(level.length === 2){
        $("#province").attr("disabled","disabled");
    }else if(level.length === 4){
        $("#province").attr("disabled","disabled");
        $("#city").attr("disabled","disabled");
    }else if(level.length === 6){
        $("#province").attr("disabled","");
        $("#city").attr("disabled","");
        $("#area").attr("disabled","");
    }
    form.render();

    form.on("submit(UpdDataBtn)", function (data) {
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "maps/updateByPrimaryKeySelective",
            type: "PUT",
            headers:{
              "X-Access-Auth-Token": $.cookie("token")
            },
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                id: $("#name").attr("data-id"),
                address: data.field.address,
                areaId: data.field.area,
                name: data.field.name,
                phone: data.field.phone
            }),
            success: function (result) {
                top.layer.close(index);
                if (result.httpStatus == 200) {
                    top.layer.msg("网点更新成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false;
    });
});