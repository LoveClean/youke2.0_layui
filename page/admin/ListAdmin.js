layui.use(['form', 'layer', 'table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

    //获取省信息
    var level = $.cookie("level");
    if (level.length === 6) {
        console.log("县区管理员没有添加会员权限");
        $(".addNews_btn").addClass("layui-btn-disabled");
    }else {
        //点击新增按钮事件
        $(".addNews_btn").click(function () {
            var index = layui.layer.open({
                title: "新增管理员",
                type: 2,
                area: ["600px", "600px"],
                content: "AddAdmin.html",
                shade: 0.8,
                shadeClose: true,
                success: function (layero, index) {
                    $(".layui-layer-content").css("overflow","inherit");
                    var body = layui.layer.getChildFrame('body', index);
                    setTimeout(function () {
                        layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
        });
    }

    //用户列表
    layer.load();
    var tableIns = table.render({
        elem: '#userList',
        url: $.cookie("tempUrl") + 'admin/selectList',
        where: {token: $.cookie("token")},
        method: "get",
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
        id: "dataTable",
        cols: [[
            {field: 'id', title: 'ID', width: 100, align: 'center'},
            {field: 'truename', title: '真实姓名', minWidth: 100, align: "center"},
            {field: 'phone', title: '手机号', align: 'center'},
            {field: 'levelNmae', title: '身份', align: 'center'},
            {field: 'levelAddress', title: '管辖范围', align: 'center'},
            {
                field: 'status', title: '状态', width: 100, align: 'center', templet: function (d) {
                    if (d.status == 1) {
                        return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.account + ' lay-text="启用|禁用" checked>';
                    } else if (d.status == 0) {
                        return '<input type="checkbox" lay-filter="status" lay-skin="switch" value=' + d.account + ' lay-text="启用|禁用" >';
                    }
                }
            },
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]],
        done: function () {
            layer.closeAll('loading');
        }
    });

    //搜索
    form.on("submit(search_btn)", function (data) {
        layer.load();
        table.reload("dataTable", {
            url: $.cookie("tempUrl") + 'admin/selectListBySearch',
            where: {
                phone: $("#account").val(),
                level: "",
                token: $.cookie("token")
            }
        })
    });

    // 修改状态开关
    form.on('switch(status)', function (data) {
        console.log(data.elem.checked); //开关是否开启，true或者false
        console.log(data.value); //开关value值，也可以通过data.elem.value得到
        $.ajax({
            url: $.cookie("tempUrl") + "manager/login_forbidden.do?token=" + $.cookie("token") + "&id=" + $(this).siblings().attr("data-id") + "&status=" + status,
            type: "POST",
            //datatype: "application/json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "account": data.value,
                "status": data.elem.checked ? "1" : "0"
            }),
            success: function (result) {
                if (result.httpStatus == 200) {
                    layer.msg(result.data);
                } else {
                    layer.alert(result.exception, {icon: 7, anim: 6});
                }
            }
        });
    });

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });


    //列表操作
    table.on('tool(userList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            sessionStorage.setItem("adminType", data.type);
            var index = layui.layer.open({
                title: "编辑用户",
                type: 2,
                area: ["500px", "400px"],
                content: "update.html",
                shade: 0.8,
                shadeClose: true,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find("input[name=id]").val(data.id);
                    body.find("input[name=account]").val(data.account);
                    body.find("input[name=email]").val(data.email);
                    body.find("input[name=trueName]").val(data.truename);
                    body.find("input[name=phone]").val(data.phone);
                    form.render();
                    setTimeout(function () {
                        layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
        }
    });
});
