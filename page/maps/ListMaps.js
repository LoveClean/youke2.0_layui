layui.config({
    base: "../../js/"
}).extend({
    "common" : "common"
});
layui.use(['form', 'layer', 'table',"common"], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        common = layui.common;

    //权限控制
    common.accessControl();

    //列表
    var tableIns = table.render({
        elem: '#dataTable',
        url: $.cookie("tempUrl") + 'maps/selectList',
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
        cellMinWidth: 95,
        page: true,
        height: "full-125",
        limits: [5, 10, 15, 20, 25],
        limit: 10,
        id: "userListTable",
        cols: [[
            {field: 'id', title: '编号', width: 100, align: "center"},
            {field: 'name', title: '网点名称', minWidth: 120, align: "center"},
            {
                field: 'areaAddress', title: '省市区', minWidth: 120, align: 'center', templet: function (d) {
                    try {
                        return d.areaAddress.fullName
                    }catch (e) {
                        return ""
                    }
                }
            },
            {field: 'address', title: '详细地址', minWidth: 170, align: "center"},
            {field: 'phone', title: '负责人电话', minWidth: 170, align: "center"},
            {title: '操作', minWidth: 160, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("userListTable", {
            url: $.cookie("tempUrl") + 'maps/selectListBySearch',
            where: {
                areaId: data.field.area? data.field.area : (data.field.city? data.field.city : data.field.province),
                name: $(".searchVal").val(),
                token: $.cookie("token")
            }
        })
    });

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });

    //点击新增按钮事件
    $(".addNews_btn").click(function () {
        var index = layui.layer.open({
            title: "新增网点",
            type: 2,
            area: ["600px", "400px"],
            content: "AddMaps.html",
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

    //列表操作
    table.on('tool(dataTable)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            buildUpd(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此楼宇？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "maps/deleteByPrimaryKey?id=" + data.id,
                    type: "DELETE",
                    headers:{
                        "X-Access-Auth-Token": $.cookie("token")
                    },
                    success: function (result) {
                        layer.msg("删除成功");
                        obj.del();
                        layer.close(index);
                    }
                });
            });
        }
    });

    //编辑文章
    function buildUpd(data) {
        sessionStorage.setItem("dataAddress", data.areaId);
        var index = layui.layer.open({
            title: "编辑网点",
            type: 2,
            area: ["600px", "400px"],
            content: "UpdMaps.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                if (data) {
                    body.find("#name").attr("data-id", data.id);  //传id
                    body.find("#name").val(data.name);  //楼宇名称
                    body.find("#address").val(data.address);  //详细地址
                    body.find("#phone").val(data.phone);
                    form.render();
                }
                setTimeout(function () {
                    layui.layer.tips('点击此处返回楼宇列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 500)
            }
        });
    }
});
