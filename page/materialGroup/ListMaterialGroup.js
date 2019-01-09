layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //素材组列表
    var tableIns = table.render({
        elem: '#materialGroupList',
        url: $.cookie("tempUrl") + 'MaterialGroup/selectList',
        method: 'get',
        where: {token: $.cookie("token")},
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code' //数据状态的字段名称，默认：code
            , statusCode: 0 //成功的状态码，默认：0
            , msgName: 'httpStatus' //状态信息的字段名称，默认：msg
            , countName: 'totalElements' //数据总数的字段名称，默认：count
            , dataName: 'content' //数据列表的字段名称，默认：data
        },
        page: true,
        limits: [5, 10, 15, 20, 25],
        limit: 10,
        id: "materialGroupListTable",
        cols: [[
            {field: 'id', title: 'ID', width: 120, align: "center"},
            {field: 'name', title: '分组名称', minWidth: 180, align: "center"},
            {
                title: '操作', minWidth: 150, width: 200, fixed: "right", align: "center", templet: "#userListBar"
            },
        ]]
    });

    //搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("materialGroupListTable", {
            url: $.cookie("tempUrl") + 'MaterialGroup/selectListBySearch',
            where: {
                name: $("#groupName").val(),
                token: $.cookie("token")
            }
        })
    });

    //列表操作
    table.on('tool(materialGroupList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') {
            updataMaterialGroup(data);
        }
        else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此素材分组？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "MaterialGroup/deleteByPrimaryKey?id=" + data.id,
                    type: "DELETE",
                    headers:{
                        "X-Access-Auth-Token":$.cookie("token")
                    },
                    success: function (result) {
                        if (result.code === 0) {
                            layer.msg("素材分组删除成功");
                            obj.del();
                            layer.close(index);
                        } else {
                            layer.msg(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
            });
        }
    });

    function updataMaterialGroup(data) {
        var index = layui.layer.open({
            title: "素材分组更新",
            type: 2,
            area: ["450px", "170px"],
            shade: 0.5,
            shadeClose: true,
            content: "UpdMaterialGroup.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    sessionStorage.setItem("materialGroupId", data.id); //传id
                    body.find("#materialGroupName").val(data.name);
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
    }

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });
    //点击新增按钮事件
    $(".addMaterialGroup_btn").click(function () {
        var index = layui.layer.open({
            title: "素材分组添加",
            type: 2,
            shade: 0.5,
            shadeClose: true,
            area: ["450px", "170px"],
            content: "AddMaterialGroup.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
    });
});