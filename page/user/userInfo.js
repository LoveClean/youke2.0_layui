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
                $(".level").val(result.data.levelName);
                $(".levelAddress").val(result.data.levelAddress);
            }
        });
    });

    //提交个人资料
    form.on("submit(changeUser)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});

        $.ajax({
            url: $.cookie("tempUrl") + "admin/updateMeByPrimaryKeySelective?token=" + $.cookie("token"),
            type: "put",
            datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                id: $(".id").val(),
                trueName: $(".truename").val()
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg("更新成功");
                    setTimeout(function () {
                        top.layer.close(index);
                        layer.closeAll("iframe");
                        // 刷新主界面
                        $.cookie('truename', $(".truename").val(), {path: '/'});
                        top.location.reload();
                    }, 1000);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })
});