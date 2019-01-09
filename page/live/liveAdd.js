layui.config({
    base: "../../layui/lay/mymodules/"
}).use(['jquery', 'table', 'eleTree', 'code', 'laydate', 'upload', 'form'], function () {
    var $ = layui.jquery;
    var eleTree = layui.eleTree;
    var table = layui.table;
    var code = layui.code;
    var upload = layui.upload;
    var laydate = layui.laydate;
    var form = layui.form;


    form.verify({
        pathJudge: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (item.innerText === "") {
                return '必须上传文件';
            }
        }
    });
    var imagePath = "";
    upload.render({
        elem: '#test1'
        , url: $.cookie("tempUrl") + 'file/uploadImage?token=' + $.cookie("token")
        , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(); //上传loading
        }
        , done: function (res, index, upload) {
            layer.closeAll('loading'); //关闭loading
            //假设code=0代表上传成功
            if (res.code === 0) {
                $("#demoText").text("素材地址：" + res.data);
                $("#demoText2").attr("src", res.data);
                $("#demoText2").attr("width", "40%");
                imagePath = res.data;
            } else {
                layer.msg(res.exception);
            }
        }
        , error: function (index, upload) {
            layer.closeAll('loading'); //关闭loading
        }
    });

    //直播员渲染
    $.ajax({
        url: $.cookie("tempUrl") + "play/selectPlayerList.do?token=" + $.cookie("token"),
        type: "POST",
        success: function (result) {
            $.each(result.data, function (index, item) {
                $("#player").append($('<option value=' + item.id + '>' + item.truename + '</option>'));
            });
            form.render('select');
        }
    });

    form.on('submit(addLive)', function (data) {
        var title = $("#title").val();
        var address = $("#address").val()
        var player = parseInt($("#player").val())
        var dateTime = $("#dateTime").val().split("~");
        弹出loading
        var index = top.layer.msg('数据提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        $.ajax({
            url: $.cookie("tempUrl") + "play/addPlay.do?token=" + $.cookie("token"),
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                begintime: dateTime[0].trim(),
                endtime: dateTime[1].trim(),
                picpath: imagePath,
                playerid: player,
                realaddress: address,
                title: title,
                type: 0
            }),
            success: function (result) {
                if (result.code === 0) {
                    top.layer.close(index);
                    layer.msg("直播添加成功");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        })
        return false;
    })


    //日期时间控件
    laydate.render({
        elem: '.dateTime',
        type: 'datetime',
        range: '~',    // 开启时间段选择
        calendar: true,    // 公立节日
        format: 'yyyy-MM-dd HH:mm:ss',
        trigger: 'click',
        position: 'fixed',
        min: 0,
        max: 4073558400000,
        done: function (value, date) {
        }
    });
});