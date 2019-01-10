layui.config({
    base: "../../js/"
}).extend({
    "address": "address"
});
layui.use(['form', 'layer', 'table', "address", 'util'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        address = layui.address,
        util = layui.util;

    var level = $.cookie("level");
    if(level.length === 0){
        address.provinces();

    }else if(level.length === 2){
        address.init1(level.slice(0,2));
        $("#province").attr("disabled","disabled");

    }else if(level.length === 4){
        address.init2(level.slice(0,2),level.slice(0,4));
        $("#province").attr("disabled","disabled");
        $("#city").attr("disabled","disabled");

    }else if(level.length === 6){
        address.init3(level.slice(0,2),level.slice(0,4),level);
        $("#province").attr("disabled","");
        $("#city").attr("disabled","");
        $("#area").attr("disabled","");
        loadPoint(level);
    }
    form.render();


    //根据地区加载网点
    form.on('select(area)', function (data) {
        loadPoint(data.value);
    });

    function loadPoint(data) {
        $("#point").removeAttr("disabled");
        var buildEl = $("#point");
        buildEl.empty();
        buildEl.append($("<option value=''>请选择网点</option>"));
        form.render('select');
        if (data === "") {
            $("#point").attr("disabled", true);
            buildEl.attr("disabled", "");
            form.render('select');
        } else {
            $.ajax({
                url: $.cookie("tempUrl") + "maps/selectListBySearch?areaId=" + data + "&name=&pageNum=1&pageSize=999",
                type: "GET",
                headers: {
                    "X-Access-Auth-Token": $.cookie("token")
                },
                contentType: "application/json;charset=utf-8",
                success: function (d) {
                    var builds = d.content;
                    if (builds) {
                        $.each(builds, function (index, item) {
                            buildEl.append($("<option value=" + item.id + ">" + item.name + "</option>"))
                        });
                        buildEl.removeAttr("disabled");
                        form.render('select'); //更新 lay-filter="test2" 所在容器内的全部 select 状态
                    }
                },
                error: function () {
                    console.log("请求ERROR");
                }
            })
        }
    }

    //列表
    var tableIns = table.render({
        elem: '#dataList',
        url: $.cookie("tempUrl") + 'AdDelivery/selectList',
        method: 'Get',
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
        id: "dataList",
        cols: [[
            {type: 'checkbox', fixed: 'left', width: 50},
            {field: 'adId', title: '节目编号', width: 100, align: "center"},
            {field: 'adName', title: '广告名称', minWidth: 120, align: "center"},
            {field: 'areaAddress', title: '投放城市', minWidth: 120, align: "center"},
            {field: 'addressName', title: '投放网点', minWidth: 120, align: "center"},
            {field: 'priority', title: '优先级', minWidth: 120, align: "center"},
            {
                field: 'beginTime', title: '开始时间', minWidth: 120, align: 'center', templet: function (d) {
                    return util.toDateString(d.beginTime)
                }
            },
            {
                field: 'endTime', title: '结束时间', minWidth: 120, align: 'center', templet: function (d) {
                    return util.toDateString(d.endTime)
                }
            },
            // {field: 'createBy', title: '投放人', minWidth: 120, align: "center"},
            {title: '操作', minWidth: 100, templet: '#userListBar', fixed: "right", align: "center"}
        ]]
    });

    //搜索
    form.on("submit(search_btn)", function (data) {
        table.reload("dataList", {
            url: $.cookie("tempUrl") + 'AdDelivery/selectListBySearch',
            method: 'GET',
            where: {
                areaId: data.field.area ? data.field.area : (data.field.city ? data.field.city : data.field.province),
                addressId: data.field.point,
                token: $.cookie("token")
            }
        })
    });

    //点击flash按钮事件
    $(document).on("click", "#flash", function () {
        window.location.reload();
    });

    // 投放
    $("#put-btn").click(function () {
        var index = layui.layer.open({
            title: "投放广告",
            type: 2,
            area: ["600px", "400px"],
            content: "AddAdvertisingPut.html",
            shade: 0.8,
            shadeClose: true,
            success: function (layero, index) {

            }
        })
    });
    //批量删除
    $("#delAll_btn").click(function () {
        let delList = table.checkStatus('dataList'); //dataList 即为基础参数 id 对应的值
        if (delList.data.length) {
            console.log(delList.data) //获取选中行的数据
            console.log(delList.isAll) //表格是否全选
            let advertisingIds = "";
            $.each(delList.data, function (index, item) {
                advertisingIds += item.id + ',';
            });
            console.log(advertisingIds);
            layer.confirm('确定进行批量删除？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "addelivery/batch_delete.do?token=" + $.cookie("token") + "&ids=" + advertisingIds.substring(0, advertisingIds.length - 1),
                    type: "POST",
                    success: function (result) {
                        layer.msg("删除成功");
                        window.location.href = "advertisingPut.html";
                    }
                });
                tableIns.reload();
                layer.close(index);
            });
        }
    });

    //列表操作
    table.on('tool(dataList)', function (obj) {
        let layEvent = obj.event,
            data = obj.data;

        if (layEvent === 'edit') { //编辑
            edit(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此广告投放？', {icon: 3, title: '提示信息'}, function (index) {
                $.ajax({
                    url: $.cookie("tempUrl") + "addelivery/delete.do?token=" + $.cookie("token") + "&id=" + data.id,
                    type: "POST",
                    success: function (result) {
                        if (result.httpStatus === 200) {
                            layer.msg("删除成功");
                            obj.del();
                            layer.close(index);
                        }
                    },
                    error: function () {
                        layer.msg('删除失败');
                        layer.close(index);
                    }
                });
            });
        }
    });

    function edit(data) {
        sessionStorage.setItem("areaId", data.areaid);
        sessionStorage.setItem("dateTime", util.toDateString(data.begintime) + " ~ " + util.toDateString(data.endtime));
        if (data.delivertype === 1) {
            sessionStorage.setItem("buildingId", data.buildingOrGroupId);
            var index = layui.layer.open({
                title: "修改楼宇投放",
                type: 2,
                area: ["600px", "400px"],
                content: "advertisingPutUpt.html",
                shade: 0.8,
                shadeClose: true,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find("#build").attr("data-id", data.id)
                    setTimeout(function () {
                        layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
        } else {
            sessionStorage.setItem("groupId", data.buildingOrGroupId);
            var index = layui.layer.open({
                title: "修改设备分组投放",
                type: 2,
                area: ["600px", "400px"],
                content: "advertisingPutUptTwo.html",
                shade: 0.8,
                shadeClose: true,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find("#group").attr("data-id", data.id)
                    setTimeout(function () {
                        layui.layer.tips('点击此处关闭', '.layui-layer-setwin .layui-layer-close', {
                            tips: 3
                        });
                    }, 500)
                }
            })
        }
    }


});