layui.config({
    base: "../../js/"
}).extend({
    "address": "address"
});
layui.use(['form', 'layer' , 'address'], function () {
    var form = layui.form,
        layer = layui.layer,
        address = layui.address;


    var updLevel = sessionStorage.getItem("updLevel");
    address.init3(updLevel.slice(0, 2), updLevel.slice(0, 4), updLevel);//初始化地址
    var level = $.cookie("level");
    if (level.length === 2) {
        $("#province").attr("disabled","disabled");
    } else if (level.length === 4) {
        $("#province").attr("disabled", "disabled");
        $("#city").attr("disabled", "disabled");
    } else if (level.length === 6) {
        $("#province").attr("disabled", "");
        $("#city").attr("disabled", "");
        $("#area").attr("disabled", "");
    }
    //提交
    form.on("submit(submit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateByPrimaryKeySelective?token=" + $.cookie("token"),
            type: "PUT",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "id": $("input[name='phone']").attr("data-id"),
                "trueName": data.field.trueName,
                "level": data.field.area? data.field.area : (data.field.city? data.field.city : data.field.province)
            }),
            success: function (result) {
                top.layer.close(index);
                if (result.code === 0) {
                    top.layer.msg("管理员修改成功！");
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