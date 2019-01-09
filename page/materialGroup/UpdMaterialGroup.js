layui.config({
    base: "../../js/"
}).extend({
    "address": "address"
})
layui.use(['form', 'layer', 'table', 'laytpl', 'upload', "address", 'laydate'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        laydate = layui.laydate
    table = layui.table;
    upload = layui.upload;
    address = layui.address;

    form.on("submit(updataMaterialGroup)", function (data) {
        $.ajax({
            url: $.cookie("tempUrl") + "MaterialGroup/updateByPrimaryKeySelective",
            type: "PUT",
            headers:{
                "X-Access-Auth-Token":$.cookie("token")
            },
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                id: parseInt(sessionStorage.getItem("materialGroupId")),
                name: $("#materialGroupName").val()
            }),
            success: function (result) {
                if (result.code === 0) {
                    layer.msg("素材分组更新成功");
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