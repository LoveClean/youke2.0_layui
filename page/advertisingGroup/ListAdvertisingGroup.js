layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //列表
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'AdGroup/selectList',
        method: "get",
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
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [5, 10, 15, 20, 25],
        limit: 10,
        id: "userListTable",
        cols: [[
            {field: 'id', title: 'ID', width: 100, align: 'center'},
            {field: 'name', title: '分组名称', minWidth: 100, align: "center"},
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'AdGroup/selectListBySearch',
            where: {
                name: $(".searchVal").val(),
                token: $.cookie("token")
            },
        })
    });

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        var index = layui.layer.open({
            title: "新增广告分组",
            type: 2,
            shade: 0.5,
            shadeClose: true,
            area: ["600px", "200px"],
            offset: ['30px', '270px'],
            content: "AddAdvertisingGroup.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处返回广告分组列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        })
    });

    //编辑按钮
    function groupUpd(edit) {
        var index = layui.layer.open({
            title: "编辑广告分组",
            type: 2,
            shade: 0.5,
            shadeClose: true,
            area: ["600px", "200px"],
            offset: ['30px', '270px'],
            content: "UpdAdvertisingGroup.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (edit) {
                    body.find(".groupName").attr("data-id", edit.id);  //传id
                    body.find(".groupName").val(edit.name);  //标题
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回广告分组列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
    }

    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            groupUpd(data)
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此分组？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "AdGroup/deleteByPrimaryKey?id=" + data.id,
                    type: "DELETE",
                    headers:{
                        "X-Access-Auth-Token":$.cookie("token")
                    },
                    success: function (result) {
                        if (result.code === 0) {
                            layer.msg("广告分组删除成功");
                            obj.del();
                            layer.close(index);
                        } else {
                            layer.msg(result.exception, {icon: 7, anim: 6});
                        }
                    }
                });
                layer.close(index);
            });
        }
    });
});
