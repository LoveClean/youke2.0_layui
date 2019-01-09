layui.use(['form', 'layer', 'table',  'upload'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        upload = layui.upload;

    var url = "file/uploadImage";
    var path = "";
    var type = "图片"
    form.on('radio(test)', function (data) {
        console.log(data.value); //被点击的radio的value值
        var val = data.value;
        type = val;
        if (val === "图片") {
            url = "file/uploadImage";
        } else {
            url = "file/uploadAudio";
        }
    });

    form.verify({
        pathJudge: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (item.innerText === "") {
                return '必须上传文件';
            }
        }
    });

    upload.render({
        elem: '#test1'
        , url: $.cookie("tempUrl") + url + '?token=' + $.cookie("token")
        ,accept: 'file'
        , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            layer.load(); //上传loading
        }
        , done: function (res, index, upload) {
            layer.closeAll('loading'); //关闭loading
            //假设code=0代表上传成功
            if (res.code === 0) {
                $("#demoText").text("素材地址：" + res.data);
                path = res.data;
            } else {
                layer.msg(res.exception);
            }
        }
        , error: function (index, upload) {
            layer.closeAll('loading'); //关闭loading
        }
    });

    $.ajax({
        url: $.cookie("tempUrl") + "MaterialGroup/selectList",
        type: "GET",
        headers:{
            "X-Access-Auth-Token":$.cookie("token")
        },
        success: function (result) {
            var data = result.content;
            for (var i = 0; i < data.length; i++) {
                var option = $("<option value='" + data[i].id + "'>" + data[i].name + "</option>");
                $("#materialGroup").append(option)
                form.render('select');
            }
            layer.closeAll('loading');
        }
    });
    form.on('submit(addMaterial)', function(data) {
        var imageReg = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/i;
        var videoReg = /\.avi$|\.mkv$|\.mp4$|\.mov$|\.flv$/i;
        var musicReg = /\.mp3$|\.wma$|\.flac$|\.aac$|\.wav$/i;
        var groupid = $("#materialGroup").val();
        var name = $("#materialName").val();
        if(type === "音频") {
            if(!musicReg.test(path.substring(path.lastIndexOf(".")))){
                layer.msg("文件类型不匹配")
                return false;
            }
        }else if (type === "视频") {
            if(!videoReg.test(path.substring(path.lastIndexOf(".")))){
                layer.msg("文件类型不匹配")
                return false;
            }
        }else if(type === "图片"){
            if(!imageReg.test(path.substring(path.lastIndexOf(".")))){
                layer.msg("文件类型不匹配")
                return false;
            }
        }
        $.ajax({
            url: $.cookie("tempUrl") + "Material/insertSelective",
            type: "POST",
            headers:{
                "X-Access-Auth-Token":$.cookie("token")
            },
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                groupId: groupid,
                name: name,
                path: path,
                type: type
            }),
            success: function (result) {
                if (result.code === 0) {
                    layer.msg("素材添加成功");
                    setTimeout(function () {
                        layer.closeAll("iframe");
                        //刷新父页面
                        parent.location.reload();
                    }, 500);
                } else {
                    layer.msg(result.exception, {icon: 7, anim: 6});
                }
            }
        })
        return false;
    })
})