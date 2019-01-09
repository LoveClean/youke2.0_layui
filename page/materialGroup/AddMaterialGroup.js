layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    $("#addGroup").click(function () {
        $.ajax({
            url: $.cookie("tempUrl") + "MaterialGroup/insertSelective?token=" + $.cookie("token"),
            type: "POST",
            datatype: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                name: $("#materialGroupName").val()
            }),
            success: function (result) {
                if (result.code === 0) {
                    layer.msg("素材分组组添加成功");
                    setTimeout(function () {
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                    }, 500);
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        });
        return false;
    })
})