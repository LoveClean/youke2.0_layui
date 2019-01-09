var form, $, areaData;
layui.config({
    base: "../../js/"
});
layui.use(['form', 'layer', 'upload', 'laydate'], function () {
    form = layui.form;
    $ = layui.jquery;
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        upload = layui.upload,
        laydate = layui.laydate,
        address = layui.address;

    // $(".truename").attr("value", $.cookie("truename"));
    $(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "admin/selectBySession?token=" + $.cookie("token"),
            type: "GET",
            success: function (result) {
                $(".id").attr("value", result.data.id);
                $(".phone").attr("value", result.data.phone);
                $(".truename").attr("value", result.data.truename);
                if (result.data.level == "000000") {
                    $(".level").attr("value", "全国管理员");
                } else {
                    $(".level").attr("value", "管理员");
                }
            }
        });
    });

    //提交个人资料
    form.on("submit(changeUser)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateByPrimaryKeySelective?token=" + $.cookie("token"),
            type: "put",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                id: $(".id").val(),
                trueName: $(".truename").val()
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg("更新成功,请重新登陆...");
                    setTimeout(function () {
                        top.layer.close(index);
                        layer.closeAll("iframe");
                        //跳转至登陆界面
                        $.cookie('truename', "", {path: '/'});
                        $.cookie('token', "", {path: '/'});
                        parent.location.href = "../../login.html";
                    }, 1000);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
});