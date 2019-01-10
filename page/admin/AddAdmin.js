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

    //获取省信息
    var level = $.cookie("level");
    if (level.length === 0) {
        address.provinces();
        $("#province").attr("lay-verify","required");
    } else if (level.length === 2) {
        address.init1(level.slice(0, 2));
        $("#province").attr("disabled", "disabled");
        $("#city").attr("lay-verify","required");
    } else if (level.length === 4) {
        address.init2(level.slice(0, 2), level.slice(0, 4));
        $("#province").attr("disabled", "disabled");
        $("#city").attr("disabled", "disabled");
        $("#area").attr("lay-verify","required");
    } else if (level.length === 6) {
       console.log("县区管理员没有添加会员权限");
    }
    form.render();

    //提交
    form.on("submit(submit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "admin/insertSelective?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "level": data.field.area? data.field.area : (data.field.city? data.field.city : data.field.province),
                "password": data.field.password,
                "phone": data.field.phone,
                "trueName": data.field.trueName
            }),
            success: function (result) {
                top.layer.close(index);
                if (result.httpStatus == 200) {
                    top.layer.msg("管理员添加成功！");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            },
            error: function () {

            }
        });
        return false;
    });
});