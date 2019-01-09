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

    address.provinces();

    //提交
    form.on("submit(submit)", function (data) {
        var field = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "manager/add.do?token=" + $.cookie("token"),
            type: "POST",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "account": field.account,
                "answer": "答案",
                "email": field.email,
                "password": field.password,
                "phone": field.phone,
                "question": "问题",
                "trueName": field.trueName,
                "type": field.type
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
                returnLogin();
            }
        });
        return false;
    });
});